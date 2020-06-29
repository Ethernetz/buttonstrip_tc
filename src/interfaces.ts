import powerbi from "powerbi-visuals-api";
import {State} from './TilesCollection/enums'
import { SelectionManagerUnbound } from "./SelectionManagerUnbound";


interface DatapointCommon {
    value: powerbi.PrimitiveValue,
}

export interface propertyStateName {
    all: string,
    selected: string,
    unselected: string,
    hover: string
}

export interface propertyStateValue {
    all: string | number,
    selected: string | number,
    unselected: string | number,
    hover: string | number,
}

export interface propertyStatesInput extends propertyStateValue {
    state: State
}

export interface propertyStatesOutput extends propertyStateValue {
    didChange: boolean
}

export interface containerProperties{
    xPos: number,
    yPos: number,
    width: number,
    height: number
}

export interface Handle{
    buttonXPos: number,
    buttonYPos: number,
    buttonWidth: number,
    buttonHeight: number,
    xPos: number,
    yPos: number,
    axis: string,
    propName: string,
    disp: number,
    z: number,
    handleFocused: boolean,
}