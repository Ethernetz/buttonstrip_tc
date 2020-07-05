import { PropertyGroupKeys, StatesUsed } from '../TilesCollection/interfaces'
import { PropertyGroupValuesWithState, PropertyGroupValuesWithDidChange } from './interfaces'
import { State } from '../TilesCollection/enums'
import powerbi from "powerbi-visuals-api";
import { VisualSettings } from '../settings';


export function getPropertyStateNameArr(propKeys: string[]): PropertyGroupKeys[] {
    let propertyGroupKeysArr: PropertyGroupKeys[] = []
    for (let i = 0; i < propKeys.length; i++)
        if (propKeys[i].endsWith('A'))
            propertyGroupKeysArr.push(getPropertyStateNames(propKeys, propKeys[i].slice(0, -1)))
    return propertyGroupKeysArr
}

export function getPropertyStateNames(propKeys: string[], propBase: string): PropertyGroupKeys {
    return {
        get default(): string { return propKeys.indexOf(propBase + "D") > -1 ? propBase + "D" : null },
        get all(): string { return propKeys.indexOf(propBase + "A") > -1 ? propBase + "A" : null },
        get selected(): string { return propKeys.indexOf(propBase + "S") > -1 ? propBase + "S" : null },
        get unselected(): string { return propKeys.indexOf(propBase + "U") > -1 ? propBase + "U" : null },
        get hover(): string { return propKeys.indexOf(propBase + "H") > -1 ? propBase + "H" : null },
        get disabled(): string { return propKeys.indexOf(propBase + "N") > -1 ? propBase + "N" : null }
    }
}


export function getObjectsToPersist(visualSettings: VisualSettings): powerbi.VisualObjectInstancesToPersist {
    let objKeys = Object.keys(visualSettings)
    let objects: powerbi.VisualObjectInstancesToPersist = {
        merge: []
    }
    for (let i = 0; i < objKeys.length; i++) {
        let objKey: string = objKeys[i]
        let propKeys: string[] = Object.keys(visualSettings[objKey])

        let statesUsed: StatesUsed = visualSettings[objKey].statesUsed || {
            selected: false,
            unselected: false,
            hover: false,
            disabled: false
        }

        let groupedKeyNamesArr: PropertyGroupKeys[] = getPropertyStateNameArr(propKeys)
        let object: powerbi.VisualObjectInstance = {
            objectName: objKey,
            selector: undefined,
            properties:
                {}
        }

        for (let j = 0; j < groupedKeyNamesArr.length; j++) {
            let propKeys: PropertyGroupKeys = groupedKeyNamesArr[j]
            let propValues: PropertyGroupValuesWithState = {
                default: visualSettings[objKey][propKeys.default],
                all: visualSettings[objKey][propKeys.all],
                selected: visualSettings[objKey][propKeys.selected],
                unselected: visualSettings[objKey][propKeys.unselected],
                hover: visualSettings[objKey][propKeys.hover],
                disabled: visualSettings[objKey][propKeys.disabled],
                state: visualSettings[objKey].state,
            }
            let leveledPropertyState = levelProperties(propValues, propKeys, statesUsed)
            if (leveledPropertyState.didChange) {
                object.properties[propKeys.all] = leveledPropertyState.all
                if (statesUsed.selected)
                    object.properties[propKeys.selected] = leveledPropertyState.selected
                if (statesUsed.unselected)
                    object.properties[propKeys.unselected] = leveledPropertyState.unselected
                if (statesUsed.hover)
                    object.properties[propKeys.hover] = leveledPropertyState.hover
                if (statesUsed.disabled)
                    object.properties[propKeys.disabled] = leveledPropertyState.disabled
            }
        }
        if (Object.keys(object.properties).length != 0)
            objects.merge.push(object)
    }
    return objects
}

export function levelProperties(propValues: PropertyGroupValuesWithState, propKeys: PropertyGroupKeys, statesUsed: StatesUsed): PropertyGroupValuesWithDidChange {
    let _all = propValues.all
    let _selected = propValues.selected
    let _unselected = propValues.unselected
    let _hover = propValues.hover
    let _disabled = propValues.disabled
    let allExists = false
    let nullValue = null
    if (typeof _all == 'number') {
        allExists = _all >= 0
    } else {
        allExists = _all != null && _all.length > 0
        nullValue = ""
    }

    let overrideWithAll: boolean = propValues.state == State.all && allExists
    if (propKeys.selected && statesUsed.selected)
        _selected = overrideWithAll ? _all : _selected || propValues.default

    if (propKeys.unselected && statesUsed.unselected)
        _unselected = overrideWithAll ? _all : _unselected || propValues.default

    if (propKeys.hover && statesUsed.hover)
        _hover = overrideWithAll ? _all : _hover || propValues.default

    if (propKeys.disabled && statesUsed.disabled)
        _disabled = overrideWithAll ? _all : _disabled || propValues.default


    let allSame = (_selected == _unselected || !_unselected)
        && (_selected == _hover || !_hover)
        && (_selected == _disabled || !_disabled);

    _all = allSame ? _selected : nullValue

    let didChange: boolean = (propValues.all != _all ||
        (propValues.selected != _selected) ||
        propValues.unselected != _unselected ||
        propValues.hover != _hover ||
        propValues.disabled != _disabled)



    return {
        default: propValues.default,
        all: _all,
        selected: _selected,
        unselected: _unselected,
        hover: _hover,
        disabled: _disabled,
        didChange: didChange
    }
}