import { PropertyGroupKeys, StatesUsed, PropertyGroupValues } from '../TilesCollection/interfaces'
import { State, PresetStyle } from '../TilesCollection/enums'
import powerbi from "powerbi-visuals-api";
import { VisualSettings } from '../settings';
import { DarkerPreset, Preset, LighterPreset, FilledPreset, PressedPreset, DefaultPreset, PoppedPreset, GlowPreset, OutlinedPreset } from './PresetStyleSettings'


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


export function getObjectsToPersist(visualSettings: VisualSettings, currentPresetStyle?: PresetStyle, usePreset?: boolean): powerbi.VisualObjectInstancesToPersist {
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
            let propValuesBefore: PropertyGroupValues = {
                default: visualSettings[objKey][propKeys.default],
                all: visualSettings[objKey][propKeys.all],
                selected: visualSettings[objKey][propKeys.selected],
                unselected: visualSettings[objKey][propKeys.unselected],
                hover: visualSettings[objKey][propKeys.hover],
                disabled: visualSettings[objKey][propKeys.disabled],
            }

            let propValuesAfter:PropertyGroupValues = {
                default: visualSettings[objKey][propKeys.default],
                all: visualSettings[objKey][propKeys.all],
                selected: visualSettings[objKey][propKeys.selected],
                unselected: visualSettings[objKey][propKeys.unselected],
                hover: visualSettings[objKey][propKeys.hover],
                disabled: visualSettings[objKey][propKeys.disabled],
            };

            Preset.baseColor = visualSettings && visualSettings["presetStyle"] && visualSettings["presetStyle"]["color"]

            let preset = usePreset ? getPreset(currentPresetStyle) : null
            if (preset){
                propValuesAfter = styleWithPreset(propValuesAfter, new DefaultPreset(), objKey, propKeys)
                
                propValuesAfter = styleWithPreset(propValuesAfter, preset, objKey, propKeys)
            }
            propValuesAfter = levelProperties(propValuesAfter, propKeys, statesUsed, visualSettings[objKey].state)
            if (didChange(propValuesBefore, propValuesAfter)) {
                object.properties[propKeys.all] = propValuesAfter.all
                if (statesUsed.selected)
                    object.properties[propKeys.selected] = propValuesAfter.selected
                if (statesUsed.unselected)
                    object.properties[propKeys.unselected] = propValuesAfter.unselected
                if (statesUsed.hover)
                    object.properties[propKeys.hover] = propValuesAfter.hover
                if (statesUsed.disabled)
                    object.properties[propKeys.disabled] = propValuesAfter.disabled
            }
        }
        if (Object.keys(object.properties).length != 0)
            objects.merge.push(object)
    }
    return objects
}

export function getPreset(preset: PresetStyle): object {
    switch (preset) {
        case PresetStyle.darker:
            return new DarkerPreset()
        case PresetStyle.lighter:
            return new LighterPreset()
        case PresetStyle.filled:
            return new FilledPreset()
        case PresetStyle.popped:
            return new PoppedPreset()
        case PresetStyle.pressed:
            return new PressedPreset()
        case PresetStyle.glow:
            return new GlowPreset()
        case PresetStyle.outlined:
            return new OutlinedPreset()
        default:
            null
    }
}

export function styleWithPreset(propValues: PropertyGroupValues, preset: any, objKey: string, propKeys: PropertyGroupKeys): PropertyGroupValues {
    if (!preset || !objKey || !preset[objKey])
        return propValues
    
    propValues.all = preset[objKey][propKeys.selected] !=null ? preset[objKey][propKeys.all] : propValues.all
    propValues.selected = preset[objKey][propKeys.selected] !=null ? preset[objKey][propKeys.selected] : propValues.selected
    propValues.unselected = preset[objKey][propKeys.unselected] !=null ? preset[objKey][propKeys.unselected] : propValues.unselected
    propValues.hover = preset[objKey][propKeys.hover] !=null ? preset[objKey][propKeys.hover] : propValues.hover
    propValues.disabled = preset[objKey][propKeys.disabled] !=null ? preset[objKey][propKeys.disabled] : propValues.disabled
    return propValues
}

export function levelProperties(propValues: PropertyGroupValues, propKeys: PropertyGroupKeys, statesUsed: StatesUsed, state: State): PropertyGroupValues {
    let _all = propValues.all
    let _selected = propValues.selected
    let _unselected = propValues.unselected
    let _hover = propValues.hover
    let _disabled = propValues.disabled
    let allExists = false
    let nullValue = null
    if (typeof propValues.default == 'number' || typeof propValues.default == 'object') {
        allExists = _all != null && _all >= 0
    } else {
        _all = <string>_all
        allExists = _all != null && _all.length > 0
        nullValue = ""
    }

    let overrideWithAll: boolean = state == State.all && allExists
    if (propKeys.selected && statesUsed.selected)
        _selected = overrideWithAll ? _all : _selected == null ? propValues.default : _selected

    if (propKeys.unselected && statesUsed.unselected)
        _unselected = overrideWithAll ? _all : _unselected == null ? propValues.default : _unselected

    if (propKeys.hover && statesUsed.hover)
        _hover = overrideWithAll ? _all : _hover == null ? propValues.default : _hover

    if (propKeys.disabled && statesUsed.disabled)
        _disabled = overrideWithAll ? _all : _disabled == null ? propValues.default : _disabled


    let allSame = (_selected == _unselected || !_unselected)
        && (_selected == _hover || !_hover)
        && (_selected == _disabled || !_disabled);

    _all = allSame ? _selected : nullValue
    return {
        default: propValues.default,
        all: _all,
        selected: _selected,
        unselected: _unselected,
        hover: _hover,
        disabled: _disabled
    }
}

export function didChange(beforeValues: PropertyGroupValues, afterValues: PropertyGroupValues): boolean {
    return (beforeValues.all != afterValues.all ||
        beforeValues.selected != afterValues.selected ||
        beforeValues.unselected != afterValues.unselected ||
        beforeValues.hover != afterValues.hover ||
        beforeValues.disabled != afterValues.disabled)
}