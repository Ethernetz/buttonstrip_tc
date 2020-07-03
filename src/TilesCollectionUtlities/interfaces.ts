import {State} from '../TilesCollection/enums'

export interface PropertyGroupKeys {
    all: string,
    selected: string,
    unselected: string,
    hover: string,
    default: string
}

export interface PropertyGroupValues {
    all: string | number,
    selected: string | number,
    unselected: string | number,
    hover: string | number,
    default: string | number
}

export interface PropertyGroupValuesWithState extends PropertyGroupValues {
    state: State
}

export interface PropertyGroupValuesWithDidChange extends PropertyGroupValues {
    didChange: boolean
}