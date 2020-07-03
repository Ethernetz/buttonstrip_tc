import {State} from './TilesCollection/enums'
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