import { BoundingBox, Handle } from "./interfaces"
import { ShapeDirection, TileLayoutType } from "./enums"
import { rotatePath } from "./functions"
export class Shape {
    width: number
    height: number
    roundedCornerRadius: number
    direction: ShapeDirection
    static alterPadding: boolean = false

    _shapePath: string
    _strokePath: string


    constructor(height: number, width: number, direction: ShapeDirection, roundedCornerRadius?: number, ...args: number[]) {
        this.width = width || 0
        this.height = height || 0
        this.direction = direction || ShapeDirection.right
        this.roundedCornerRadius = roundedCornerRadius || 0
    }
    get shapePath(): string {
        this._shapePath = this._shapePath || [].concat.apply([], rotatePath(this.shapePathRight, this.direction, this.height, this.width)).join(" ")
        return this._shapePath;
    }
    get shapePathRight(): [string, ...number[]][] {
        return []
    }
    get strokePath(): string {
        this._strokePath = this._strokePath || [].concat.apply([], rotatePath(this.shapePathRight, this.direction, this.height, this.width)).join(" ");
        return this._strokePath
    }
    get strokePathRight(): [string, ...number[]][] {
        return this.shapePathRight
    }

    get contentBoundingBox(): BoundingBox {
        let contentBoundingBoxRight = this.contentBoundingBoxRight
        switch (this.direction) {
            case ShapeDirection.left:
                return {
                    x: this.width - (contentBoundingBoxRight.x + contentBoundingBoxRight.width),
                    y: contentBoundingBoxRight.y,
                    width: contentBoundingBoxRight.width,
                    height: contentBoundingBoxRight.height
                }
            case ShapeDirection.up:
                return {
                    x: contentBoundingBoxRight.y,
                    y: this.width - (contentBoundingBoxRight.x + contentBoundingBoxRight.width),
                    width: contentBoundingBoxRight.height,
                    height: contentBoundingBoxRight.width
                }
            case ShapeDirection.down:
                return {
                    x: this.height - (contentBoundingBoxRight.y + contentBoundingBoxRight.height),
                    y: contentBoundingBoxRight.x,
                    width: contentBoundingBoxRight.height,
                    height: contentBoundingBoxRight.width
                }
            default:
                return contentBoundingBoxRight
        }
    }
    get contentBoundingBoxRight(): BoundingBox {
        return {
            x: 0,
            y: 0,
            width: this.width,
            height: this.height
        }
    }

    static getDimsWithoutContent(direction: ShapeDirection, height: number, width: number, ...args: number[]): { width: number, height: number } {

        if (direction == ShapeDirection.left || direction == ShapeDirection.right)
            return this.getDimsWithoutContentRight(height, width, ...args)
        else {
            let dims = this.getDimsWithoutContentRight(width, height, ...args)
            return {
                width: dims.height,
                height: dims.width
            }
        }
    }

    static getDimsWithoutContentRight(...args: number[]): { width: number, height: number } {
        return { width: 0, height: 0 }
    }

    static getAutoPreference(layoutType: TileLayoutType): ShapeDirection {
        return ShapeDirection.right
    }

}

export class Rectangle extends Shape {
    constructor(height: number, width: number, direction: ShapeDirection, roundedCornerRadius: number) {
        super(height, width, direction, roundedCornerRadius)
    }

    get shapePathRight(): [string, ...number[]][] {
        let path = new Path()
        path.moveTo(0, 0)
        path.drawTo(this.width, 0)
        path.drawTo(0, this.height)
        path.drawTo(-1 * this.width, 0)
        path.drawTo(0, -1 * this.height)
        path.roundCorners(this.roundedCornerRadius)
        path.close()
        return path.path
    }
}


export class Parallelogram extends Shape {
    static alterPadding: boolean = true
    private z: number;
    constructor(height: number, width: number, direction: ShapeDirection, angle: number, roundedCornerRadius: number) {
        super(height, width, direction, roundedCornerRadius)
        this.z = this.height / Math.tan(angle * (Math.PI / 180))
    }

    get shapePathRight(): [string, ...number[]][] {
        let path = new Path()
        path.moveTo(this.z, 0)
        path.drawTo(this.width - this.z, 0)
        path.drawTo(-1 * this.z, this.height)
        path.drawTo(-1 * this.width + this.z, 0)
        path.drawTo(this.z, -1 * this.height)
        path.roundCorners(this.roundedCornerRadius)
        path.close()
        return path.path
    }


    get contentBoundingBoxRight(): BoundingBox {
        return {
            x: this.z,
            y: 0,
            width: this.width - 2 * this.z,
            height: this.height
        }
    }

    static getDimsWithoutContentRight(height: number, width: number, angle: number): { width: number, height: number } {
        return {
            width: 2 * height / Math.tan(angle * (Math.PI / 180)),
            height: 0
        }
    }
    static getAutoPreference(layoutType: TileLayoutType): ShapeDirection {
        if (layoutType == TileLayoutType.vertical)
            return ShapeDirection.down
        return ShapeDirection.right
    }
}

export class Chevron extends Shape {
    static alterPadding: boolean = true
    private z: number;
    constructor(height: number, width: number, direction: ShapeDirection, angle: number, roundedCornerRadius: number) {
        super(height, width, direction, roundedCornerRadius)
        this.z = 0.5 * this.height / Math.tan(angle * (Math.PI / 180))
    }

    get shapePathRight(): [string, ...number[]][] {
        let path = new Path()
        path.moveTo(0, 0)
        path.drawTo(this.width - this.z, 0)
        path.drawTo(this.z, this.height / 2)
        path.drawTo(-1 * this.z, this.height / 2)
        path.drawTo(-1 * this.width + this.z, 0)
        path.drawTo(this.z, this.height / -2)
        path.drawTo(-1 * this.z, this.height / -2)
        path.roundCorners(this.roundedCornerRadius)
        path.close()
        return path.path
    }


    get contentBoundingBoxRight(): BoundingBox {
        return {
            x: this.z,
            y: 0,
            width: this.width - 2 * this.z,
            height: this.height
        }
    }

    static getDimsWithoutContentRight(height: number, width: number, angle: number): { width: number, height: number } {
        return {
            width: height / Math.tan(angle * (Math.PI / 180)),
            height: 0
        }
    }
    static getAutoPreference(layoutType: TileLayoutType): ShapeDirection {
        if (layoutType == TileLayoutType.vertical)
            return ShapeDirection.down
        return ShapeDirection.right
    }
}

export class Pentagon extends Shape {
    private z: number;
    constructor(height: number, width: number, direction: ShapeDirection, angle: number, roundedCornerRadius: number) {
        super(height, width, direction, roundedCornerRadius)
        this.z = 0.5 * this.height / Math.tan(angle * (Math.PI / 180))
    }

    get shapePathRight(): [string, ...number[]][] {
        let path = new Path()
        path.moveTo(0, 0)
        path.drawTo(this.width - this.z, 0)
        path.drawTo(this.z, 0.5 * this.height)
        path.drawTo(-1 * this.z, 0.5 * this.height)
        path.drawTo(-1 * this.width + this.z, 0)
        path.drawTo(0, -1 * this.height)
        path.roundCorners(this.roundedCornerRadius)
        path.close()
        return path.path
    }

    get contentBoundingBoxRight(): BoundingBox {
        return {
            x: 0,
            y: 0,
            width: this.width - this.z,
            height: this.height
        }
    }
    static getDimsWithoutContentRight(height: number, width: number, angle: number): { width: number, height: number } {
        return {
            width: 0.5 * height / Math.tan(angle * (Math.PI / 180)),
            height: 0
        }
    }
    static getAutoPreference(layoutType: TileLayoutType): ShapeDirection {
        if (layoutType == TileLayoutType.vertical)
            return ShapeDirection.right
        return ShapeDirection.down
    }
}

export class Hexagon extends Shape {
    private z: number;;
    constructor(height: number, width: number, direction: ShapeDirection, angle: number, roundedCornerRadius: number) {
        super(height, width, direction, roundedCornerRadius)
        this.z = 0.5 * this.height / Math.tan(angle * (Math.PI / 180))
    }

    get shapePathRight(): [string, ...number[]][] {
        let path = new Path()
        path.moveTo(this.z, 0)
        path.drawTo(this.width - 2 * this.z, 0)
        path.drawTo(this.z, 0.5 * this.height)
        path.drawTo(-1 * this.z, 0.5 * this.height)
        path.drawTo(-1 * this.width + 2 * this.z, 0)
        path.drawTo(-1 * this.z, -0.5 * this.height)
        path.drawTo(this.z, -0.5 * this.height)
        path.roundCorners(this.roundedCornerRadius)
        path.close()
        return path.path
    }

    get contentBoundingBoxRight(): BoundingBox {
        return {
            x: this.z,
            y: 0,
            width: this.width - 2 * this.z,
            height: this.height
        }
    }
    static getDimsWithoutContentRight(height: number, width: number, angle: number): { width: number, height: number } {
        return {
            width: height / Math.tan(angle * (Math.PI / 180)),
            height: 0
        }
    }
    static getAutoPreference(layoutType: TileLayoutType): ShapeDirection {
        if (layoutType == TileLayoutType.vertical)
            return ShapeDirection.right
        return ShapeDirection.down
    }
}

export class Ellipse extends Shape {
    constructor(height: number, width: number, direction: ShapeDirection) {
        super(height, width, direction)
    }

    get shapePathRight(): [string, ...number[]][] {
        let rx = 0.5 * this.width
        let ry = 0.5 * this.height
        let path = new Path()
        path.moveTo(0, ry)
        path.arcTo(rx, ry, 0, 1, 0, 2 * rx, 0)
        path.arcTo(rx, ry, 0, 1, 0, -2 * rx, 0)
        path.close()
        return path.path
    }

    get shapePath(): string {
        return [].concat.apply([], this.shapePathRight).join(" ")
    }

    get contentBoundingBox(): BoundingBox {
        return super.contentBoundingBoxRight
    }

    static getHorizontalNoContentRight(height: number, angle: number): number {
        return height / Math.tan(angle * (Math.PI / 180))
    }
}

export class Tab_CutCorners extends Shape {
    private length: number;
    constructor(height: number, width: number, direction: ShapeDirection, length: number, roundedCornerRadius: number) {
        super(height, width, direction, roundedCornerRadius)
        this.length = length
    }

    get shapePathRight(): [string, ...number[]][] {
        let path = new Path()
        path.moveTo(0, this.length)
        path.drawTo(this.length, -1 * this.length)
        path.drawTo(this.width - this.length, 0)
        path.drawTo(0, this.height)
        path.drawTo(-1 * this.width + this.length, 0)
        path.drawTo(-1 * this.length, -1 * this.length)
        path.drawTo(0, -1*this.height + 2*this.length)
        path.roundCorners(this.roundedCornerRadius)
        path.close()
        return path.path
    }
    // get strokePathRight(): [string, ...number[]][]{
    //     let path = new Path()
    //     path.moveTo(0, this.length)
    //     path.drawTo(this.length, -1 * this.length)
    //     path.drawTo(this.width - this.length, 0)
    //     path.drawTo(0, this.height)
    //     path.drawTo(-1 * this.width + this.length, 0)
    //     path.drawTo(-1 * this.length, -1 * this.length)
    //     path.drawTo(0, -1*this.height + 2*this.length)
    //     path.roundCorners(this.roundedCornerRadius)
    //     path.close()
    //     return path.path
    // }


    static getAutoPreference(layoutType: TileLayoutType): ShapeDirection {
        if (layoutType == TileLayoutType.vertical)
            return ShapeDirection.right
        return ShapeDirection.down
    }
}

export class Tab_CutCorner extends Shape {
    private length: number;
    constructor(height: number, width: number, direction: ShapeDirection, length: number, roundedCornerRadius: number) {
        super(height, width, direction, roundedCornerRadius)
        this.length = length
    }

    get shapePathRight(): [string, ...number[]][] {
        let path = new Path()
        path.moveTo(this.length, 0)
        path.drawTo(this.width - this.length, 0)
        path.drawTo(0, this.height)
        path.drawTo(-1 * this.width, 0)
        path.drawTo(0, -1 * this.height + this.length)
        path.close()
        return path.path
    }


    static getAutoPreference(layoutType: TileLayoutType): ShapeDirection {
        if (layoutType == TileLayoutType.vertical)
            return ShapeDirection.right
        return ShapeDirection.down
    }
}

export class Tab_RoundedCorners extends Shape {
    private length: number;
    constructor(height: number, width: number, direction: ShapeDirection, roundedCornerRadius: number) {
        super(height, width, direction, roundedCornerRadius)
        this.length = 20
    }

    get shapePathRight(): [string, ...number[]][] {
        let path = new Path()
        path.moveTo(0, this.length)
        path.arcTo(this.length, this.length, 0, 0, 1, this.length, -1 * this.length)
        path.drawTo(this.width - this.length, 0)
        path.drawTo(0, this.height)
        path.drawTo(-1 * this.width + this.length, 0)
        path.arcTo(this.length, this.length, 0, 0, 1, -1 * this.length, -1 * this.length)
        path.close()
        return path.path
    }


    static getAutoPreference(layoutType: TileLayoutType): ShapeDirection {
        if (layoutType == TileLayoutType.vertical)
            return ShapeDirection.right
        return ShapeDirection.down
    }
}

export class Pill extends Shape {
    constructor(height: number, width: number, direction: ShapeDirection, roundedCornerRadius: number) {
        super(height, width, direction, roundedCornerRadius)
    }

    get shapePathRight(): [string, ...number[]][] {
        let path = new Path()
        path.moveTo(0, this.width / 2)
        path.arcTo(this.width / 2, this.width / 2, 0, 0, 1, this.width, 0)
        path.drawTo(0, this.height - this.width)
        path.arcTo(this.width / 2, this.width / 2, 0, 0, 1, -1 * this.width, 0)
        path.close()
        return path.path
    }

    get contentBoundingBoxRight(): BoundingBox {
        return {
            x: 0,
            y: this.width / 2,
            width: this.width,
            height: this.height - this.width
        }
    }

    static getDimsWithoutContentRight(height: number, width: number,): { width: number, height: number } {
        return {
            width: 0,
            height: width
        }
    }

    static getAutoPreference(layoutType: TileLayoutType): ShapeDirection {
        if (layoutType == TileLayoutType.vertical)
            return ShapeDirection.right
        return ShapeDirection.down
    }
}

export class Triangle extends Shape {
    constructor(height: number, width: number, direction: ShapeDirection, roundedCornerRadius: number) {
        super(height, width, direction, roundedCornerRadius)
    }

    get shapePathRight(): [string, ...number[]][] {
        let path = new Path()
        path.moveTo(0, 0)
        path.drawTo(this.width, this.height / 2)
        path.drawTo(-1 * this.width, this.height / 2)
        path.drawTo(0, -1 * this.height)
        path.roundCorners(this.roundedCornerRadius)
        path.close()
        return path.path
    }
    static getAutoPreference(layoutType: TileLayoutType): ShapeDirection {
        if (layoutType == TileLayoutType.vertical)
            return ShapeDirection.right
        return ShapeDirection.up
    }
}

export class Arrow extends Shape {
    private z: number;
    private arrowThickness: number;
    constructor(height: number, width: number, direction: ShapeDirection, angle: number, arrowThicknessPercentage: number, roundedCornerRadius: number) {
        super(height, width, direction, roundedCornerRadius)
        this.z = 0.5 * this.height / Math.tan(angle * (Math.PI / 180))
        this.arrowThickness = arrowThicknessPercentage / 100 * height;
    }

    get shapePathRight(): [string, ...number[]][] {
        let path = new Path()
        path.moveTo(0, (this.height - this.arrowThickness) / 2)
        path.drawTo(this.width - this.z, 0)
        path.drawTo(0, -1 * (this.height - this.arrowThickness) / 2)
        path.drawTo(this.z, 0.5 * this.height)
        path.drawTo(-1 * this.z, 0.5 * this.height)
        path.drawTo(0, -1 * (this.height - this.arrowThickness) / 2)
        path.drawTo(-1 * this.width + this.z, 0)
        path.drawTo(0, -1 * this.arrowThickness)
        path.roundCorners(this.roundedCornerRadius)
        path.close()
        return path.path
    }

    get contentBoundingBoxRight(): BoundingBox {
        return {
            x: 0,
            y: (this.height - this.arrowThickness) / 2,
            width: this.width - this.z,
            height: this.arrowThickness
        }
    }

    static getDimsWithoutContentRight(height: number, width: number, angle: number, rodThickness: number): { width: number, height: number } {
        return {
            width: 0.5 * height / Math.tan(angle * (Math.PI / 180)),
            height: height - rodThickness
        }
    }
    static getAutoPreference(layoutType: TileLayoutType): ShapeDirection {
        if (layoutType == TileLayoutType.vertical)
            return ShapeDirection.down
        return ShapeDirection.right
    }
}

class Path {
    public path: [string, ...number[]][] = [];
    constructor(path?: [string, ...number[]][]) {
        if (path)
            this.path = path
    }
    public moveTo(x, y): void {
        this.path.push(["m", x, y])
    }
    public drawTo(x, y): void {
        this.path.push(["l", x, y])
    }
    public arcTo(rx, ry, rotation, arc, sweep, eX, eY) {
        this.path.push(["a", rx, ry, rotation, arc, sweep, eX, eY])
    }

    public roundCorners(roundedCornerRadius): void {
        let oldPath = this.path
        oldPath.push(oldPath[1])
        let newPath: [string, ...number[]][] = []
        for (let i = 0; i < oldPath.length - 1; i++) {
            let cubicCurve: [string, ...number[]] = null
            if (oldPath[i][0] == 'l' && oldPath[i + 1] && oldPath[i + 1][0] == 'l') {
                let xDir1: number = Math.sign(oldPath[i][1])
                let yDir1: number = Math.sign(oldPath[i][2])
                let xDir2: number = Math.sign(oldPath[i + 1][1])
                let yDir2: number = Math.sign(oldPath[i + 1][2])

                let l1xRatio = Math.abs(oldPath[i][1]) / (Math.abs(oldPath[i][1]) + Math.abs(oldPath[i][2]))
                let l1yRatio = 1 - l1xRatio
                let l2xRatio = Math.abs(oldPath[i + 1][1]) / (Math.abs(oldPath[i + 1][1]) + Math.abs(oldPath[i + 1][2]))
                let l2yRatio = 1 - l2xRatio

                let dx1 = roundedCornerRadius * xDir1 * l1xRatio
                let dy1 = roundedCornerRadius * yDir1 * l1yRatio
                let dx2 = roundedCornerRadius * xDir2 * l2xRatio
                let dy2 = roundedCornerRadius * yDir2 * l2yRatio

                let dx = dx1 + dx2
                let dy = dy1 + dy2

                oldPath[i][1] -= dx1
                oldPath[i][2] -= dy1
                oldPath[i + 1][1] -= dx2
                oldPath[i + 1][2] -= dy2


                cubicCurve = ['c', dx1 / 2, dy1 / 2, dx - dx2 / 2, dy - dy2 / 2, dx, dy]
                if (i == oldPath.length - 2) {
                    newPath[0][1] += dx2
                    newPath[0][2] += dy2
                }

            }
            cubicCurve ? newPath.push(oldPath[i], cubicCurve) : newPath.push(oldPath[i])
        }


        this.path = newPath
    }
    public close(): void {
        this.path.push(["Z"])
    }
    public removeClose(): void {
        if (this.path[-1][0] == 'Z')
            this.path.pop()
    }
}