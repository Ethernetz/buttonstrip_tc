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
    if(propBase == 'strokeWidth' && state == State.unselected){ //TODO fix this edge case
        return formatObj[propBase + 'U'] || 0
    }
        // return formatObj[getCorrectPropertyStateName(state, propBase)] != null 
        // ? formatObj[getCorrectPropertyStateName(state, propBase)]
        // : formatObj[propBase + "D"]
        return formatObj[getCorrectPropertyStateName(state, propBase)]
}

export function getCorrectPropertyStateName(state: State, propBase: string): string {
    switch (state) {
        case State.all:
            return propBase + "A"
        case State.selected:
            return propBase + "S"
        case State.unselected:
            return propBase + "U"
        case State.hovered:
            return propBase + "H"
        case State.disabled:
            return propBase + "N"
    }
}


export function round(n, p?): number{
    let x = p ? Math.pow(10, p) : 100
    return Math.round(n*x) / x
}

export function hexToRgb(hex: string): {r: number, g: number, b: number} {
    if(!hex.startsWith("#"))
        return {r:0, b:0, g:0}
    if(hex.length == 4)
        hex = "#" + hex.substr(1).replace(/./g, '$&$&')
    if(hex.length != 7)
        return {r:0, b:0, g:0}
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }