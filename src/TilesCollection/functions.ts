import {State} from './enums'
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

export function getMatchingStateProperty(state: State, formatObj: any, propBase: string){
    if(propBase == 'strokeWidth' && State.unselected){ //TODO fix this edge case
        return formatObj[propBase + 'U'] || 0
    }
    switch(state){
        case State.all:
            return formatObj[propBase + 'A']
        case State.selected:
            return formatObj[propBase + 'S']
        case State.hovered:
            if(formatObj.hoverStyling)
                return formatObj[propBase + 'H']
        case State.unselected:
            return formatObj[propBase + 'U']
    }
}



export function round(n, p?): number{
    let x = p ? Math.pow(10, p) : 100
    return Math.round(n*x) / x
}