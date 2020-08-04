import {State, ShapeDirection} from './enums'
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

  export function rotatePath(pathRight: [string, ...number[]][], direction: ShapeDirection, height: number, width: number):  [string, ...number[]][] {
    for (let i = 0; i < pathRight.length - 1; i++ ) {
        let commandGroup = pathRight[i]
        let command = commandGroup[0]
        switch (direction) {
            case ShapeDirection.left:
                if (command == 'm')
                    commandGroup[1] = width - commandGroup[1]
                else if (command == 'l')
                    commandGroup[1] = -1 * commandGroup[1]
                else if (command == 'a'){
                    commandGroup[5] = commandGroup[5] == 1 ? 0 : 1
                    commandGroup[6] = -1 * commandGroup[6]
                } else if (command == 'c'){
                    commandGroup[1] = -1 * commandGroup[1]
                    commandGroup[3] = -1 * commandGroup[3]
                    commandGroup[5] = -1 * commandGroup[5]
                } 
                break
            case ShapeDirection.up:
                if (command == 'm'){
                    let x = commandGroup[1]
                    let y = commandGroup[2]
                    commandGroup[2] = width - x
                    commandGroup[1] = y
                }
                else if (command == 'l'){
                    let x = commandGroup[1]
                    let y = commandGroup[2]
                    commandGroup[2] = -1 * x
                    commandGroup[1] = y
                }
                else if (command == 'a'){
                    let ax = commandGroup[6]
                    let ay = commandGroup[7]
                    commandGroup[7] = -1 * ax
                    commandGroup[6] = ay
                } else if (command == 'c'){
                    let dx1 = commandGroup[1]
                    let dy1 = commandGroup[2]
                    let dx2 = commandGroup[3]
                    let dy2 = commandGroup[4]
                    let dx = commandGroup[5]
                    let dy = commandGroup[6]
                    commandGroup[2] = -1 * dx1
                    commandGroup[1] = dy1
                    commandGroup[4] = -1 * dx2
                    commandGroup[3] = dy2
                    commandGroup[6] = -1 * dx
                    commandGroup[5] = dy
                }
                break
            case ShapeDirection.down:
                if (command == 'm'){
                    let x = commandGroup[1]
                    let y = commandGroup[2]
                    commandGroup[1] = height - y
                    commandGroup[2] = x
                }
                else if (command == 'l'){
                    let x = commandGroup[1]
                    let y = commandGroup[2]
                    commandGroup[1] = -1 * y
                    commandGroup[2] = x
                }
                else if (command == 'a'){
                    let ax = commandGroup[6]
                    let ay = commandGroup[7]
                    commandGroup[6] = -1 * ay
                    commandGroup[7] = ax
                } else if (command == 'c'){
                    let dx1 = commandGroup[1]
                    let dy1 = commandGroup[2]
                    let dx2 = commandGroup[3]
                    let dy2 = commandGroup[4]
                    let dx = commandGroup[5]
                    let dy = commandGroup[6]
                    commandGroup[1] = -1 * dy1
                    commandGroup[2] = dx1
                    commandGroup[3] = -1 * dy2
                    commandGroup[4] = dx2
                    commandGroup[5] = -1 * dy
                    commandGroup[6] = dx
                }
                break
        }
    }
    return pathRight
}