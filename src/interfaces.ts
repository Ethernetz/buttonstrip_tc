import {State} from './TilesCollection/enums'

export interface propertyStateName {
    all: string,
    selected: string,
    unselected: string,
    hover: string
    default: string
}

export interface propertyStateValue {
    all: string | number,
    selected: string | number,
    unselected: string | number,
    hover: string | number,
    default: string | number
}

export interface propertyStatesInput extends propertyStateValue {
    state: State
}

export interface propertyStatesOutput extends propertyStateValue {
    didChange: boolean
}