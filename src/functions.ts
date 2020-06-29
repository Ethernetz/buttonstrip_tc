import { propertyStateName, propertyStatesInput, propertyStatesOutput } from './interfaces'
import {State} from './TilesCollection/enums'
import powerbi from "powerbi-visuals-api";
import { VisualSettings } from './settings';

export function calculateWordDimensions(text: string, fontFamily: string, fontSize: string, widthType?: string, maxWidth?: string): { width: number, height: number } {
    var div = document.createElement('div');
    div.style.fontFamily = fontFamily
    div.style.fontSize = fontSize
    div.style.width = widthType
    div.style.maxWidth = maxWidth || 'none'
    div.style.whiteSpace = maxWidth ? "normal" : "nowrap"
    div.style.position = "absolute";
    div.innerHTML = text
    document.body.appendChild(div);
    var dimensions = {
        width: div.offsetWidth+1,
        height: div.offsetHeight
    }
    div.parentNode.removeChild(div);
    
    return dimensions;
}

export function getPropertyStateNameArr(propKeys: string[]): propertyStateName[] {
    let propertyStateNameArr: propertyStateName[] = []
    for (let i = 0; i < propKeys.length; i++)
        if (propKeys[i].endsWith('A')) 
            propertyStateNameArr.push(getPropertyStateNames(propKeys[i].slice(0, -1)))
    return propertyStateNameArr
}

export function getPropertyStateNames(propBase: string): propertyStateName{
    return {
            all: propBase+"A",
            selected: propBase+"S",
            unselected: propBase+"U",
            hover: propBase+"H"
        }
}

export function getCorrectPropertyStateName(state: State, propBase: string): string{
    switch(state){
        case State.all:
            return propBase+"A"
        case State.selected:
            return propBase+"S"
        case State.unselected:
            return propBase + "U"
        case State.hovered:
            return propBase + "H"
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
        let groupedKeyNamesArr: propertyStateName[] = getPropertyStateNameArr(propKeys)
        let object: powerbi.VisualObjectInstance = {
            objectName: objKey,
            selector: undefined,
            properties:
                {}
        }

        for (let j = 0; j < groupedKeyNamesArr.length; j++) {
            let groupedKeyNames: propertyStateName = groupedKeyNamesArr[j]
            let type = typeof visualSettings[objKey][groupedKeyNames.all]
            let propertyState: propertyStatesInput = {
                all: visualSettings[objKey][groupedKeyNames.all],
                selected: visualSettings[objKey][groupedKeyNames.selected],
                unselected: visualSettings[objKey][groupedKeyNames.unselected],
                hover: visualSettings[objKey][groupedKeyNames.hover],
                state: visualSettings[objKey].state
            }
            let leveledPropertyState = levelProperties(propertyState)
            if (leveledPropertyState.didChange) {
                object.properties[groupedKeyNames.all] = leveledPropertyState.all
                object.properties[groupedKeyNames.selected] = leveledPropertyState.selected
                object.properties[groupedKeyNames.unselected] = leveledPropertyState.unselected
                object.properties[groupedKeyNames.hover] = leveledPropertyState.hover
            }
        }
        if (Object.keys(object.properties).length != 0)
            objects.merge.push(object)
    }
    return objects
}

export function levelProperties(propertyStates: propertyStatesInput): propertyStatesOutput {
    let _all = propertyStates.all
    let _selected = propertyStates.selected
    let _unselected = propertyStates.unselected
    let _hover = propertyStates.hover
    let _allExists: boolean = typeof _all == 'number' ? _all >= 0 : _all && _all.length > 0
    let _selectedExists: boolean = typeof _selected == 'number' ? _selected >= 0 : _selected && _selected.length > 0
    let _nullValue = typeof _all == 'number' ? null : ""
    if (propertyStates.state == State.all && _allExists)
        _selected = _unselected = _hover = _all
    if (_selectedExists && _selected == _unselected)
        _all = _selected
    if (!(_selected == _unselected && _selected == _hover))
        _all = _nullValue
    return {
        all: _all,
        selected: _selected,
        unselected: _unselected,
        hover: _hover,
        didChange: !(propertyStates.all == _all && 
                    (propertyStates.selected == null || propertyStates.selected == _selected)  && 
                    (propertyStates.unselected == null || propertyStates.unselected == _unselected) &&
                    (propertyStates.hover == null || propertyStates.hover == _hover))
    }
}
