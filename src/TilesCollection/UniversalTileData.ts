import { FormatSettings, LayoutSettings, TextSettings, IconSettings, TileStrokeSettings, EffectSettings, ContentAlignmentSettings, ShapeSettings } from './FormatSettings'
import { TileData } from './TileData'
import { Viewport } from './interfaces';
import { TileLayoutType, State, TileSizingType, TileShape, ShapeDirection } from './enums';
import { getMatchingStateProperty, calculateWordDimensions } from './functions'
import { TilesCollection } from './TilesCollection';
import {Shape, Rectangle, Pentagon, Hexagon, Parallelogram, Chevron, Oval, Tab_CutCorners, Tab_CutCorner, Tab_RoundedCorners, Pill, Arrow, Line, IsocTriangle, RightTriangle, Octagon, Trapezoid, Diamond, Speechbubble_Rectangle} from './shapes';
export class UniversalTileData {
    tilesData: TileData[]
    formatSettings: FormatSettings;
    collection: TilesCollection;
    constructor(tilesData: TileData[], formatSettings: FormatSettings, collection: TilesCollection) {
        this.tilesData = tilesData;
        this.formatSettings = formatSettings;
        this.collection = collection;

    }

    public scrollLeft: number = 0;
    public scrollTop: number = 0;
    public maxBoundedTextHeight: number;
    public maxIconHeight: number;

    public _universalShape: Shape;
    get universalShape(): Shape {
        return this._universalShape ? this._universalShape : this.createUniversalShape()
    }
    createUniversalShape(): Shape {
        console.log("creating universal")
        this._universalShape = this.layoutSettings.sizingMethod == TileSizingType.fixed ? this.fixedShape : this.uniformShape
        return this._universalShape
    }




    public viewport: Viewport = {
        height: 0,
        width: 0
    };

    get layoutSettings(): LayoutSettings {
        return this.formatSettings.layout
    }
    get textSettings(): TextSettings {
        return this.formatSettings.text
    }
    get iconSettings(): IconSettings {
        return this.formatSettings.icon
    }
    get tileStrokeSettings(): TileStrokeSettings {
        return this.formatSettings.tileStroke
    }
    get effectSettings(): EffectSettings {
        return this.formatSettings.effect
    }
    get contentAlignmentSettings(): ContentAlignmentSettings {
        return this.formatSettings.contentAlignment
    }
    get shapeSettings(): ShapeSettings {
        return this.formatSettings.shape
    }



    get viewportWidth(): number {
        return this.viewport.width
    }
    get viewportHeight(): number {
        return this.viewport.height
    }
    get containerWidth(): number {
        return this.viewportWidth
            - this.effectSpace
    }
    get containerHeight(): number {
        return this.viewportHeight - this.effectSpace
    }

    get n(): number {
        return this.tilesData.length
    }
    get numRows(): number {
        return Math.ceil(this.n / this.rowLength)
    }
    get rowLength(): number {
        switch (this.layoutSettings.tileLayout) {
            case (TileLayoutType.horizontal):
                return this.n
            case (TileLayoutType.vertical):
                return 1
            case (TileLayoutType.grid):
                return Math.max(1, this.layoutSettings.tilesPerRow)
        }
    }



    get totalRowHorizontalPadding() {
        return this.tileHorizontalPadding * (this.rowLength - 1)
    }
    get totalColumnVerticalPadding() {
        return this.tileVerticalPadding * (this.numRows - 1)
    }
    get totalRowHorizontalPaddingWithoutShape() {
        return this.tilePadding * (this.rowLength - 1)
    }
    get totalColumnVerticalPaddingWithoutShape() {
        return this.tilePadding * (this.numRows - 1)
    }

    get tilePadding(): number {
        return this.layoutSettings.padding
    }

    get tileHorizontalPadding(): number {
        return this.tilePadding + this.shapeAlterHorizontalPadding
    }
    get tileVerticalPadding(): number {
        return this.tilePadding + this.shapeAlterVerticalPadding
    }

    get maxContentHorizontalMargin(): number {
        return this.maxContentMarginLeft + this.maxContentMarginRight
    }
    get maxContentVerticalMargin(): number {
        return this.maxContentMarginLeft + this.maxContentMarginRight
    }

    get maxContentMarginLeft(): number {
        return this.getMaxOfPropertyGroup(this.contentAlignmentSettings, 'leftMargin')
    }
    get maxContentMarginRight(): number {
        return this.getMaxOfPropertyGroup(this.contentAlignmentSettings, 'rightMargin')
    }
    get maxContentMarginTop(): number {
        return this.getMaxOfPropertyGroup(this.contentAlignmentSettings, 'topMargin')
    }
    get maxContentMarginBottom(): number {
        return this.getMaxOfPropertyGroup(this.contentAlignmentSettings, 'bottomMargin')
    }



    get uniformTileWidth() {
        return Math.max((this.containerWidth - this.totalRowHorizontalPadding) / this.rowLength,
            this.minTileWidth + this.maxContentHorizontalMargin + this.shapeNoContentWidth)
    }
    get uniformTileWidthWithoutShape() {
        return Math.max((this.containerWidth - this.totalRowHorizontalPaddingWithoutShape) / this.rowLength,
            this.minTileWidth + this.maxContentHorizontalMargin)
    }
    get uniformTileHeight() {
        return Math.max((this.containerHeight - this.totalColumnVerticalPadding) / this.numRows,
            this.maxInlineTextHeight + this.maxContentVerticalMargin + this.shapeNoContentHeight)
    }
    get uniformTileHeightWithoutShape() {
        return Math.max((this.containerHeight - this.totalColumnVerticalPaddingWithoutShape) / this.numRows,
            this.maxInlineTextHeight + this.maxContentVerticalMargin)
    }

    get fixedTileWidth() {
        return this.layoutSettings.tileWidth
    }
    get fixedTileHeight() {
        return this.layoutSettings.tileHeight
    }

    get widthWithoutShape(){
        return this.layoutSettings.sizingMethod == TileSizingType.fixed ? this.fixedTileWidth : this.uniformTileWidthWithoutShape
    }
    get heightWithoutShape(){
        return this.layoutSettings.sizingMethod == TileSizingType.fixed ? this.fixedTileHeight : this.uniformTileHeightWithoutShape
    }



    get tileShape(): TileShape {
        return this.shapeSettings.tileShape
    }


    get roundedCornerRadius(): number {
        return this.shapeSettings.roundedCornerRadius
    }

    public createShape(width: number, height: number): Shape {
        let w;
        let h;
        if (this.shapeDirection == ShapeDirection.right || this.shapeDirection == ShapeDirection.left) {
            w = width
            h = height
        } else {
            w = height
            h = width
        }
        switch (this.tileShape) {

            case TileShape.rectangle:
                return new Rectangle(h, w, this.shapeDirection, this.roundedCornerRadius)
            case TileShape.line:
                return new Line(h, w, this.shapeDirection)
            case TileShape.parallelogram:
                return new Parallelogram(h, w, this.shapeDirection, this.shapeSettings.parallelogramAngle, this.roundedCornerRadius)
            case TileShape.chevron:
                return new Chevron(h, w, this.shapeDirection, this.shapeSettings.chevronAngle, this.roundedCornerRadius)
            case TileShape.oval:
                return new Oval(height, width, this.shapeDirection)
            case TileShape.pentagon:
                return new Pentagon(h, w, this.shapeDirection, this.shapeSettings.pentagonAngle, this.roundedCornerRadius)
            case TileShape.hexagon:
                return new Hexagon(h, w, this.shapeDirection, this.shapeSettings.hexagonAngle, this.roundedCornerRadius)
            case TileShape.octagon:
                return new Octagon(h, w, this.shapeDirection, this.roundedCornerRadius)
            case TileShape.diamond:
                return new Diamond(h, w, this.shapeDirection, this.roundedCornerRadius)
            case TileShape.trapezoid:
                return new Trapezoid(h, w, this.shapeDirection, this.shapeSettings.trapezoidAngle, this.roundedCornerRadius)
            case TileShape.pill:
                return new Pill(h, w, this.shapeDirection, this.roundedCornerRadius)
            case TileShape.isocTriangle:
                return new IsocTriangle(h, w, this.shapeDirection, this.roundedCornerRadius)
            case TileShape.rightTriangle:
                return new RightTriangle(h, w, this.shapeDirection, this.roundedCornerRadius)
            case TileShape.arrow:
                return new Arrow(h, w, this.shapeDirection, this.shapeSettings.arrowAngle, this.shapeSettings.arrowThicknessPercentage, this.roundedCornerRadius)
            case TileShape.speechbubble_rectangle:
                return new Speechbubble_Rectangle(h, w, this.shapeDirection, this.roundedCornerRadius)
            case TileShape.tab_cutCorner:
                return new Tab_CutCorner(h, w, this.shapeDirection, this.shapeSettings.tab_cutCornerLength, this.roundedCornerRadius)
            case TileShape.tab_cutCorners:
                return new Tab_CutCorners(h, w, this.shapeDirection, this.shapeSettings.tab_cutCornersLength, this.roundedCornerRadius)
            case TileShape.tab_roundedCorners:
                return new Tab_RoundedCorners(h, w, this.shapeDirection, this.roundedCornerRadius)
            default:
                return new Rectangle(h, w, this.shapeDirection, this.roundedCornerRadius)

        }
    }


    get uniformShape(): Shape {
        return this.createShape(this.uniformTileWidth, this.uniformTileHeight)
    }
    get fixedShape(): Shape {
        return this.createShape(this.fixedTileWidth, this.fixedTileHeight)
    }

    
    get shapeAlterHorizontalPadding(): number {
        return this.shapeClass.alterPadding ? -0.5*this.shapeNoContentWidth : 0
    }


    get shapeAlterVerticalPadding(): number {
        return this.shapeClass.alterPadding ? -0.5*this.shapeNoContentHeight : 0
    }

    get shapeClass(): typeof Shape{
        switch (this.tileShape) {
            case TileShape.rectangle:
                return Rectangle
            case TileShape.line:
                return Line
            case TileShape.parallelogram:
                return Parallelogram
            case TileShape.chevron:
                return Chevron
            case TileShape.oval:
                return Oval
            case TileShape.pentagon:
                return Pentagon
            case TileShape.hexagon:
                return Hexagon
            case TileShape.trapezoid:
                return Trapezoid
            case TileShape.octagon:
                return Octagon 
            case TileShape.diamond:
                return Diamond    
            case TileShape.pill:
                return Pill
            case TileShape.isocTriangle:
                return IsocTriangle
            case TileShape.rightTriangle:
                return RightTriangle
            case TileShape.arrow:
                return Arrow
            case TileShape.speechbubble_rectangle:
                return Speechbubble_Rectangle
            case TileShape.tab_cutCorner:
                return Tab_CutCorner
            case TileShape.tab_cutCorners:
                return Tab_CutCorners
            case TileShape.tab_roundedCorners:
                return Tab_RoundedCorners
            default:
                return Rectangle
        }
    }

    getShapeNoContentDims(width: number, height: number): {width: number, height: number} {
        switch (this.tileShape) {
            case TileShape.parallelogram:
                return Parallelogram.getDimsWithoutContent(this.shapeDirection, height, width, this.shapeSettings.parallelogramAngle)
            case TileShape.chevron:
                return Chevron.getDimsWithoutContent(this.shapeDirection, height, width, this.shapeSettings.chevronAngle)
            case TileShape.hexagon:
                return Hexagon.getDimsWithoutContent(this.shapeDirection, height, width, this.shapeSettings.hexagonAngle)
            case TileShape.octagon:
                return Octagon.getDimsWithoutContent(this.shapeDirection, height, width)
            case TileShape.pentagon:
                return Pentagon.getDimsWithoutContent(this.shapeDirection, height, width, this.shapeSettings.pentagonAngle)
            case TileShape.trapezoid:
                return Trapezoid.getDimsWithoutContent(this.shapeDirection, height, width, this.shapeSettings.trapezoidAngle)
            case TileShape.pill:
                return Pill.getDimsWithoutContent(this.shapeDirection, height, width)
            case TileShape.arrow:
                return Arrow.getDimsWithoutContent(this.shapeDirection, height, width, this.shapeSettings.arrowAngle, this.shapeSettings.arrowThicknessPercentage)
            case TileShape.speechbubble_rectangle:
                return Speechbubble_Rectangle.getDimsWithoutContent(this.shapeDirection, height, width)
            default:
                return Shape.getDimsWithoutContent(this.shapeDirection, height, width)
        }
    }

    get universalNoShapeDims():{height: number, width: number}{
        return this.layoutSettings.sizingMethod == TileSizingType.fixed ?
        {width: this.fixedTileWidth, height: this.fixedTileHeight}
        : {width: this.uniformTileWidthWithoutShape, height: this.uniformTileHeightWithoutShape}
    }

    get shapeNoContentHeight(): number {
        let w = this.universalNoShapeDims.width
        let h = this.universalNoShapeDims.height
        return this.getShapeNoContentDims(w, h).height
    }
    get shapeNoContentWidth(): number {
        let w = this.universalNoShapeDims.width
        let h = this.universalNoShapeDims.height
        return this.getShapeNoContentDims(w, h).width
    }

    get shapeDirection(): ShapeDirection {
        if (this.shapeSettings.direction == ShapeDirection.auto) 
            return this.shapeClass.getAutoPreference(this.layoutSettings.tileLayout)
        return this.shapeSettings.direction
    }





    getMaxOfPropertyGroup(formatObj: any, propBase: string): number {
        let max = Math.max(
            getMatchingStateProperty(State.selected, formatObj, propBase),
            getMatchingStateProperty(State.unselected, formatObj, propBase),
            getMatchingStateProperty(State.hovered, formatObj, propBase),
            getMatchingStateProperty(State.disabled, formatObj, propBase),
        )
        return max == undefined ? formatObj[propBase + 'D'] || 0 : max
    }


    get maxTileStrokeWidth(): number {
        return this.getMaxOfPropertyGroup(this.tileStrokeSettings, 'strokeWidth')
    }

    get maxFontSize(): number {
        return this.getMaxOfPropertyGroup(this.textSettings, 'fontSize')
    }
    get maxInlineTextHeight(): number {
        return Math.round(this.maxFontSize * 4 / 3)
    }
    get minTileWidth(): number {
        return  this.contentAlignmentSettings.rotationA == 0 ? this.maxFontSize * 5 : 0
    }

    get maxIconWidth(): number {
        return this.getMaxOfPropertyGroup(this.iconSettings, 'width')
    }


    get effectSpace(): number {
        return Math.max(this.shadowSpace, this.glowSpace, 2 * this.maxTileStrokeWidth)
    }

    get shadow(): boolean {
        return this.effectSettings.shadow
    }
    get shadowSpace(): number {
        return this.shadow ? 3 * (this.shadowMaxDistance + this.shadowMaxStrength) : 0
    }
    get shadowMaxDistance(): number {
        return this.getMaxOfPropertyGroup(this.effectSettings, 'shadowDistance')
    }
    get shadowMaxStrength(): number {
        return this.getMaxOfPropertyGroup(this.effectSettings, 'shadowStrength')
    }

    get glow(): boolean {
        return this.effectSettings.glow
    }
    get glowSpace(): number {
        return this.effectSettings.glow ? 5 * (this.glowMaxStrength) : 0
    }
    get glowMaxStrength(): number {
        return this.getMaxOfPropertyGroup(this.effectSettings, 'glowStrength')
    }
}