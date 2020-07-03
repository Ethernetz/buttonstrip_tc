import {State} from '../TilesCollection/enums'
import {PropertyGroupKeys, PropertyGroupValues} from '../TilesCollection/interfaces'

export interface PropertyGroupValuesWithState extends PropertyGroupValues {
    state: State
}

export interface PropertyGroupValuesWithDidChange extends PropertyGroupValues {
    didChange: boolean
}