import { PropertyGroupKeys } from '../TilesCollection/interfaces'
import { PropertyGroupValuesWithState, PropertyGroupValuesWithDidChange } from './interfaces'
import {State} from '../TilesCollection/enums'
import powerbi from "powerbi-visuals-api";
import { VisualSettings } from '../settings';


export function getPropertyStateNameArr(propKeys: string[]): PropertyGroupKeys[] {
    let propertyGroupKeysArr: PropertyGroupKeys[] = []
    for (let i = 0; i < propKeys.length; i++)
        if (propKeys[i].endsWith('A')) 
        propertyGroupKeysArr.push(getPropertyStateNames(propKeys[i].slice(0, -1)))
    return propertyGroupKeysArr
}

export function getPropertyStateNames(propBase: string): PropertyGroupKeys{
    return {
            all: propBase+"A",
            selected: propBase+"S",
            unselected: propBase+"U",
            hover: propBase+"H",
            default: propBase+ "D"
        }
}


export function getObjectsToPersist(visualSettings: VisualSettings): powerbi.VisualObjectInstancesToPersist{
    let objKeys = Object.keys(visualSettings)
    let objects: powerbi.VisualObjectInstancesToPersist = {
        merge: []
    }
    for (let i = 0; i < objKeys.length; i++) {
        let objKey: string = objKeys[i]
        let propKeys: string[] = Object.keys(visualSettings[objKey])
        let groupedKeyNamesArr: PropertyGroupKeys[] = getPropertyStateNameArr(propKeys)
        let object: powerbi.VisualObjectInstance = {
            objectName: objKey,
            selector: undefined,
            properties:
                {}
        }

        for (let j = 0; j < groupedKeyNamesArr.length; j++) {
            let propertyGroupKeys: PropertyGroupKeys = groupedKeyNamesArr[j]
            let type = typeof visualSettings[objKey][propertyGroupKeys.all]
            let propertyState: PropertyGroupValuesWithState = {
                all: visualSettings[objKey][propertyGroupKeys.all],
                selected: visualSettings[objKey][propertyGroupKeys.selected],
                unselected: visualSettings[objKey][propertyGroupKeys.unselected],
                hover: visualSettings[objKey][propertyGroupKeys.hover],
                state: visualSettings[objKey].state,
                default: visualSettings[objKey][propertyGroupKeys.default]
            }
            let leveledPropertyState = levelProperties(propertyState)
            if (leveledPropertyState.didChange) {
                object.properties[propertyGroupKeys.all] = leveledPropertyState.all
                object.properties[propertyGroupKeys.selected] = leveledPropertyState.selected
                object.properties[propertyGroupKeys.unselected] = leveledPropertyState.unselected
                object.properties[propertyGroupKeys.hover] = leveledPropertyState.hover
            }
        }
        if (Object.keys(object.properties).length != 0)
            objects.merge.push(object)
    }
    return objects
}

export function levelProperties(propertyStates: PropertyGroupValuesWithState): PropertyGroupValuesWithDidChange {
    let _all = propertyStates.all
    let _selected = propertyStates.selected
    let _unselected = propertyStates.unselected
    let _hover = propertyStates.hover
    let allExists = false
    let nullValue = null
    if(typeof _all == 'number'){
        allExists = _all >= 0
    } else {
        allExists = _all != null && _all.length > 0
        nullValue = ""
    }

    if(_selected == null || _unselected == null || _hover == null){
        _selected = _unselected = _hover = propertyStates.default
    }

    if (propertyStates.state == State.all && allExists)
        _selected = _unselected = _hover = _all
    if (_selected == _unselected && _selected == _hover)
        _all = _selected
    if (_selected != _unselected || _selected != _hover)
        _all = nullValue
    return {
        all: _all,
        selected: _selected,
        unselected: _unselected,
        hover: _hover,
        default: propertyStates.default,
        didChange: !((propertyStates.all == _all) && 
                    propertyStates.selected == _selected  && 
                    propertyStates.unselected == _unselected &&
                    propertyStates.hover == _hover)
    }
}


export function getCorrectPropertyStateName(state: State, propBase: string): string{
    switch(state){
        case State.all:
            return propBase + "A"
        case State.selected:
            return propBase + "S"
        case State.unselected:
            return propBase + "U"
        case State.hovered:
            return propBase + "H"
    }
}