import {Viewport} from './interfaces'
import {FormatSettings} from './FormatSettings'
import {TileData} from './TileData'
import {State, TileSizingType, TileLayoutType, AlignmentType, TileShape, Direction, ContentFormatType, IconPlacement} from './enums'
import {getMatchingStateProperty, calculateWordDimensions} from './functions'
import { Shape, Rectangle, Parallelogram, Chevron, Ellipse, Pentagon, Hexagon, Tab_RoundedCorners, Tab_CutCorners, Tab_CutCorner, ChevronVertical, ParallelogramVertical } from "./shapes"
import { BaseType } from 'd3'
import { TilesCollection } from './TilesCollection'
import { Handle } from '../interfaces'
import * as d3 from 'd3'
export class Tile {
    collection: TilesCollection
    i: number;
    tilesData: TileData[]
    formatSettings: FormatSettings;
    constructor(collection: TilesCollection,i:number, tilesData: TileData[], formatSettings: FormatSettings){
        this.collection = collection
        this.i = i;
        this.tilesData = tilesData;
        this.formatSettings = formatSettings;
    }
    //Format Settings

    get viewport(): Viewport{
        return this.formatSettings.viewport 
    }
    get viewportWidth(): number {
        return this.viewport.width
    }
    get viewportHeight(): number {
        return this.viewport.height
    }
    get containerWidth(): number {
        return this.viewportWidth - this.effectSpace
    }
    get containerHeight(): number {
        return this.viewportHeight - this.effectSpace
    }
    
    get n(): number {
        return this.tilesData.length
    }
    get rowLength(): number {
        switch (this.formatSettings.layout.tileLayout) {
            case (TileLayoutType.horizontal):
                return this.n
            case (TileLayoutType.vertical):
                return 1
            case (TileLayoutType.grid):
                return Math.max(1, this.formatSettings.layout.rowLength)
        }
    }
    get numRows(): number {
        return Math.ceil(this.n / this.rowLength)
    }
    get tilesInRow(): number {
        return (this.numRows - 1) * this.rowLength > this.i || this.n % this.rowLength == 0 ? this.rowLength : this.n % this.rowLength
    }
    get rowNumber(): number {
        return Math.floor(this.i / this.rowLength)
    }
    get indexInRow(): number {
        return this.i % this.rowLength
    }
    get rowStartingIndex(): number {
        return this.rowNumber * this.rowLength
    }

    get text(): string{
        return this.tileData.text
    }
    get rowText(): string[] {
        return this.tilesData.slice(this.rowStartingIndex, this.rowStartingIndex + this.tilesInRow).map(function (td) { return td.text }) as string[]
    }

    get textFill(): string {
        return getMatchingStateProperty(this.currentState,this.formatSettings.text, 'color')
    }
    get textFillOpacity(): number {
        return 1 -getMatchingStateProperty(this.currentState,this.formatSettings.text, 'transparency') / 100
    }
    get fontSize(): number {
        return getMatchingStateProperty(this.currentState,this.formatSettings.text, 'fontSize')
    }
    get fontFamily(): string {
        return getMatchingStateProperty(this.currentState,this.formatSettings.text, 'fontFamily')
    }
    get textAlign(): string {
        return getMatchingStateProperty(this.currentState,this.formatSettings.text, 'alignment')
    }
    get textHmargin(): number {
        return getMatchingStateProperty(this.currentState,this.formatSettings.text, 'hmargin')
    }
    get textBmargin(): number {
        return getMatchingStateProperty(this.currentState,this.formatSettings.text, 'bmargin')
    }
    
    // get widthSpaceForAllText(): number {
    //     let totalPadding = (this.tilesInRow - 1) * this.formatSettings.layout.padding;
    //     return this.viewportWidth - totalPadding - ProcessedVisualSettings.totalTextHmargin;
    // }
    get allTextWidth(): number {
        return calculateWordDimensions(this.rowText.join(""), this.fontFamily, this.fontSize + "pt").width
    }
    get widthSpaceForText(): number {
        return this.contentContainerWidth - 2 * this.textHmargin
    }
    get widthSpaceForAllText(): number {
        return this.viewport.width - this.rowLength*(2*this.textHmargin) - this.totalTileHPadding - this.effectSpace
    }
    get inlineTextWidth(): number {
        return calculateWordDimensions(this.text, this.fontFamily, this.fontSize + "pt").width
    }
    get boundedTextWidth(): number {
        return calculateWordDimensions(this.text as string, this.fontFamily, this.fontSize + "pt", this.textContainerWidthType, (this.maxInlineTextWidth) + 'px').width;
    }
    get boundedTextHeight(): number {
        return calculateWordDimensions(this.text as string, this.fontFamily, this.fontSize + "pt", this.textContainerWidthType, (this.maxInlineTextWidth) + 'px').height;
    }

    get beforeInRowText(): string[]{
        return this.rowText.slice(0, this.indexInRow)
    }
    get beforeInRowTextWidth(): number{
        if(this.beforeInRowText.length == 0)
            return 0
        return calculateWordDimensions(this.beforeInRowText.join(""), this.fontFamily, this.fontSize + "pt").width
    }

    get textContainerWidthType(): string {
        return this.inlineTextWidth + 2 * this.textHmargin >= Math.floor(this.maxInlineTextWidth) 
                && this.tileData.contentFormatType == ContentFormatType.text_icon
                && this.iconPlacement == IconPlacement.left
                ? 'min-content' : 'auto'
    }
    
    get textContainerHeight(): number {
        return this.boundedTextHeight + this.textBmargin
    }
    get contentContainerWidth(): number{
        return this.shape.contentFODims.width
    }
    get widthTakenByIcon(): number{
        return this.iconWidth + this.iconHmargin
    }
    get maxInlineTextWidth(): number {
        return this.widthSpaceForText - this.widthTakenByIcon
    }

    get tileFill(): string {
        return getMatchingStateProperty(this.currentState,this.formatSettings.tile, 'color')
    }
    get tileFillOpacity(): number {
        return 1 - getMatchingStateProperty(this.currentState, this.formatSettings.tile, 'transparency') / 100
    }
    get tileStroke(): string {
        return getMatchingStateProperty(this.currentState,this.formatSettings.tile, 'stroke')
    }
    get tileStrokeWidth(): number {
        return getMatchingStateProperty(this.currentState,this.formatSettings.tile, 'strokeWidth')
    }
    get tilePadding(): number {
        return this.formatSettings.layout.padding
    }
    get tileHPadding(): number {
        console.log("alterpadding is", this.alterHorizontalPadding)
        return this.tilePadding + this.alterHorizontalPadding
    }
    get totalTileHPadding(): number {
        return this.tileHPadding * (this.rowLength - 1)
    }
    get tileVPadding(): number {
        return this.tilePadding 
        // + this.alterVerticalPadding
    }
    get totalTileVPadding(): number {
        return this.tileVPadding * (this.numRows - 1)
    }
    get tileWidth(): number {
        switch (this.formatSettings.layout.sizingMethod) {
            case TileSizingType.uniform:
                return (this.containerWidth - this.totalTileHPadding) / (this.rowLength)
            case TileSizingType.fixed:
                return this.formatSettings.layout.tileWidth
            case TileSizingType.dynamic:
                if(this.indexInRow == this.rowLength-1)
                    return this.containerWidth - this.tileXpos
                return this.inlineTextWidth + this.dynamicExtraWidthPerTile
        }
    }
    get dynamicExtraWidthPerTile(): number{
        let textSpaceRequired = this.allTextWidth + this.textHmargin*2*this.rowLength + this.totalTileHPadding
        let spaceRemaining = Math.max(0, this.containerWidth - textSpaceRequired)
        return spaceRemaining/this.rowLength
    }
    get tileHeight(): number {
        if(this.formatSettings.layout.sizingMethod == TileSizingType.fixed)
            return this.formatSettings.layout.tileHeight
        return (this.containerHeight - this.totalTileVPadding) / this.numRows

    }

    get tileXpos(): number {
        switch (this.formatSettings.layout.sizingMethod) {
            case TileSizingType.fixed:
                let areaTaken = this.tilesInRow * this.tileWidth + (this.tilesInRow - 1) * this.tileHPadding
                let areaRemaining = this.containerWidth - areaTaken
                switch (this.formatSettings.layout.tileAlignment) {
                    case AlignmentType.left:
                        return this.indexInRow * (this.tileWidth + this.tileHPadding) + this.effectSpace / 2
                    case AlignmentType.right:
                        return areaRemaining + this.indexInRow * (this.tileWidth + this.tileHPadding) + this.effectSpace / 2
                    case AlignmentType.center:
                        return areaRemaining / 2 + this.indexInRow * (this.tileWidth + this.tileHPadding) + this.effectSpace / 2

                }
            case TileSizingType.uniform:
                return this.indexInRow * (this.tileWidth + this.tileHPadding) + this.effectSpace / 2
            case TileSizingType.dynamic:
                return this.beforeInRowTextWidth + this.dynamicExtraWidthPerTile*this.indexInRow + this.effectSpace/2 + this.indexInRow*(this.tileHPadding)
        }
    }
    get tileYpos(): number {
        return this.rowNumber * (this.tileHeight + this.tileVPadding) + this.effectSpace / 2
    }


    get tileShape(): TileShape {
        return this.formatSettings.layout.tileShape
    }
    get shape(): Shape {
        switch (this.tileShape) {
            case TileShape.rectangle:
                return new Rectangle(this.tileXpos, this.tileYpos, this.tileWidth, this.tileHeight, this.shapeRoundedCornerRadius)
            case TileShape.parallelogram:
                if (this.formatSettings.layout.tileLayout != TileLayoutType.vertical)
                    return new Parallelogram(this.tileXpos, this.tileYpos, this.tileWidth, this.tileHeight, this.formatSettings.layout.parallelogramAngle, this.shapeRoundedCornerRadius)
                else
                    return new ParallelogramVertical(this.tileXpos, this.tileYpos, this.tileWidth, this.tileHeight, this.formatSettings.layout.parallelogramAngle, this.shapeRoundedCornerRadius)
            case TileShape.chevron:
                if (this.formatSettings.layout.tileLayout != TileLayoutType.vertical)
                    return new Chevron(this.tileXpos, this.tileYpos, this.tileWidth, this.tileHeight, this.formatSettings.layout.chevronAngle, this.shapeRoundedCornerRadius)
                else
                    return new ChevronVertical(this.tileXpos, this.tileYpos, this.tileWidth, this.tileHeight, this.formatSettings.layout.chevronAngle, this.shapeRoundedCornerRadius)
            case TileShape.ellipse:
                return new Ellipse(this.tileXpos, this.tileYpos, this.tileWidth, this.tileHeight)
            case TileShape.pentagon:
                return new Pentagon(this.tileXpos, this.tileYpos, this.tileWidth, this.tileHeight, this.formatSettings.layout.pentagonAngle, this.shapeRoundedCornerRadius)
            case TileShape.hexagon:
                return new Hexagon(this.tileXpos, this.tileYpos, this.tileWidth, this.tileHeight, this.formatSettings.layout.hexagonAngle, this.shapeRoundedCornerRadius)
            case TileShape.tab_roundedCorners:
                return new Tab_RoundedCorners(this.tileXpos, this.tileYpos, this.tileWidth, this.tileHeight)
            case TileShape.tab_cutCorners:
                return new Tab_CutCorners(this.tileXpos, this.tileYpos, this.tileWidth, this.tileHeight, this.formatSettings.layout.tab_cutCornersLength)
            case TileShape.tab_cutCorner:
                return new Tab_CutCorner(this.tileXpos, this.tileYpos, this.tileWidth, this.tileHeight, this.formatSettings.layout.tab_cutCornerLength)
        }
    }
    get shapePath(): string {
        return this.shape.shapePath
    }
    get shapeStrokePath(): string {
        return this.shape.strokePath
    }
    get handles(): Handle[] {
            return this.shape.handles
        }
    get alterHorizontalPadding(): number {
        switch (this.tileShape) {
            case TileShape.parallelogram:
                if (this.formatSettings.layout.tileLayout != TileLayoutType.vertical)
                    return Parallelogram.getAlterHPadding(this.tileHeight, this.formatSettings.layout.parallelogramAngle)
            case TileShape.chevron:
                if (this.formatSettings.layout.tileLayout != TileLayoutType.vertical)
                    return Chevron.getAlterHPadding(this.tileHeight, this.formatSettings.layout.chevronAngle)
            default:
                return Shape.getAlterHPadding(this.tileHeight, 0)
        }
    }
    get alterVerticalPadding(): number {
        return this.shape.alterVPadding
    }
    get contentFOHeight(): number {
        return this.shape.contentFODims.height
    }
    get contentFOWidth(): number {
        return this.shape.contentFODims.width
    }

    get contentFOXPos(): number {
        return this.shape.contentFODims.xPos
    }

    get contentFOYPos(): number {
        return this.shape.contentFODims.yPos
    }
    



    get shapeRoundedCornerRadius(): number{
        return this.formatSettings.effect.shapeRoundedCornerRadius
    }

    get effectSpace(): number {
        return Math.max(this.shadowSpace, this.glowSpace, this.tileStrokeWidth)
    }
    get filter(): string {
        return "url(#filter" + this.i + ")"
    }
    get bgimg(): string {
        return "url(#image" + this.i + ")"
    }

    get shadow(): boolean{
        return this.formatSettings.effect.shadow
    }
    get shadowColor(): string {
        return getMatchingStateProperty(this.currentState,this.formatSettings.effect, 'shadowColor')
    }
    get shadowTransparency(): number {
        return 1 -getMatchingStateProperty(this.currentState,this.formatSettings.effect, 'shadowTransparency') / 100
    }
    get shadowDistance(): number {
        return getMatchingStateProperty(this.currentState,this.formatSettings.effect, 'shadowDistance')
    }
    get shadowMaxDistance(): number {
        return Math.max(this.formatSettings.effect.shadowDistanceS, this.formatSettings.effect.shadowDistanceU, this.formatSettings.effect.shadowDistanceH)
    }
    get shadowStrength(): number {
        return getMatchingStateProperty(this.currentState,this.formatSettings.effect, 'shadowStrength')
    }
    get shadowMaxStrength(): number {
        return Math.max(this.formatSettings.effect.shadowStrengthS, this.formatSettings.effect.shadowStrengthU, this.formatSettings.effect.shadowStrengthH)
    }
    get shadowDirection(): Direction {
        return getMatchingStateProperty(this.currentState,this.formatSettings.effect, 'shadowDirection')
    }
    get shadowDirectionCoords(): { x: number, y: number } {
        switch (this.shadowDirection) {
            case Direction.bottom_right: return { x: 1, y: 1 }
            case Direction.bottom: return { x: 0, y: 1 }
            case Direction.bottom_left: return { x: -1, y: 1 }
            case Direction.left: return { x: -1, y: 0 }
            case Direction.center: return { x: 0, y: 0 }
            case Direction.top_left: return { x: -1, y: -1 }
            case Direction.top: return { x: 0, y: -1 }
            case Direction.top_right: return { x: 1, y: -1 }
            case Direction.right: return { x: 1, y: 0 }
            case Direction.custom: return { x: 0, y: 0 }
        }
    }
    get shadowSpace(): number {
        return this.shadow ? 3 * (this.shadowMaxDistance + this.shadowMaxStrength) : 0
    }

    get glow(): boolean{
        return this.formatSettings.effect.glow
    }
    get glowColor(): string {
        return getMatchingStateProperty(this.currentState,this.formatSettings.effect, 'glowColor')
    }
    get glowTransparency(): number {
        return 1 -getMatchingStateProperty(this.currentState,this.formatSettings.effect, 'glowTransparency') / 100
    }
    get glowStrength(): number {
        return getMatchingStateProperty(this.currentState,this.formatSettings.effect, 'glowStrength')
    }
    get glowMaxStrength(): number {
        return Math.max(this.formatSettings.effect.glowStrengthS, this.formatSettings.effect.glowStrengthU, this.formatSettings.effect.glowStrengthH)
    }
    get glowSpace(): number {
        return this.formatSettings.effect.glow ? 3 * (this.glowMaxStrength) : 0
    }


    
    get iconURL(): string {
        return this.tileData.iconURL
    }
    get iconWidth(): number {
        return getMatchingStateProperty(this.currentState,this.formatSettings.icon, 'width')
    }
    get iconHmargin(): number {
        return getMatchingStateProperty(this.currentState,this.formatSettings.icon, 'hmargin')
    }
    get iconTopMargin(): number {
        return getMatchingStateProperty(this.currentState,this.formatSettings.icon, 'topMargin')
    }
    get iconBottomMargin(): number {
        return getMatchingStateProperty(this.currentState,this.formatSettings.icon, 'bottomMargin')
    }
    get spaceForIcon(): number {
        return this.contentFOWidth - this.iconHmargin
    }
    get iconPlacement(): IconPlacement {
        return getMatchingStateProperty(this.currentState,this.formatSettings.icon, 'placement')
    }
    get iconHeight(): number {
        return this.contentFOHeight - this.textContainerHeight - this.iconTopMargin - this.iconBottomMargin
    }
    get iconOpacity(): number {
        return 1 - getMatchingStateProperty(this.currentState,this.formatSettings.icon, 'transparency') / 100
    }

    get bgImgURL(): string {
        if(this.tileData.bgimgURL)
            return this.tileData.bgimgURL
        return ""
    }
    
    getBgImgDims(box: DOMRect): {width: number; height: number}{
        let tileRatio = this.tileWidth/this.tileHeight
        let imgRatio = box.width/box.height
        if(tileRatio > imgRatio)
            return {
                width: this.tileWidth,
                height: box.height*this.tileWidth/box.width
            }
        else
            return  {
                width: box.width*this.tileHeight/box.height,
                height: this.tileHeight
            }
    }


    //Tile data
    get tileData(): TileData{
        return this.tilesData[this.i];
    }

    get isSelected(): boolean{
        return this.tileData.isSelected;
    }
    get isHovered(): boolean{
        return this.tileData.isHovered;
    }
    get currentState(): State {
        if(this.isSelected)
            return State.selected;
        else if (this.isHovered)
            return State.hovered;
        else
            return State.unselected;
    }


    get textElement(): HTMLSpanElement {
        let text = document.createElement('span')
        text.className = 'text'
        text.style.width = this.boundedTextWidth + 'px'

        return text
    }

    get textElementByIcon(): HTMLSpanElement {
        let text = this.textElement
        if (this.iconPlacement != IconPlacement.left) {
            text.style.position = 'absolute'
            text.style.right = '0'
        }
        if (this.iconPlacement == IconPlacement.below) {
            text.style.bottom = '0'
        }
        return text
    }

    get textContainer(): HTMLDivElement {
        let textContainer = document.createElement('div')
        textContainer.className = 'textContainer'
        textContainer.style.position = 'relative'
        textContainer.style.paddingLeft = this.textHmargin + 'px'
        textContainer.style.paddingRight = this.textHmargin + 'px'
        return textContainer
    }

    get textByIconContainer(): HTMLDivElement{
        let textContainer = this.textContainer
        if (this.iconPlacement == IconPlacement.left) {
            textContainer.style.display = 'inline-block'
            textContainer.style.verticalAlign = 'middle'
            textContainer.style.width = this.textContainerWidthType
            textContainer.style.height = this.boundedTextHeight + 'px'
            textContainer.style.maxWidth = this.maxInlineTextWidth + 'px'
            textContainer.style.paddingLeft = 0 + 'px'
            textContainer.style.paddingRight = 0 + 'px'
        } else {
            textContainer.style.width = this.widthSpaceForText + 'px'
            textContainer.style.height = this.textContainerHeight + 'px'
        }
        return textContainer
    }
    

    get img(): HTMLDivElement {
        let img = document.createElement('div')
        img.className = 'icon'
        img.style.backgroundImage = "url(" + this.iconURL + ")"
        img.style.backgroundRepeat = 'no-repeat'
        img.style.opacity = this.iconOpacity.toString()
        if (this.iconPlacement == IconPlacement.left) {
            img.style.minWidth = this.iconWidth + 'px'
            img.style.height = this.iconWidth + 'px'
            img.style.display = 'inline-block'
            img.style.verticalAlign = 'middle'
            img.style.marginRight = this.iconHmargin + 'px'
            img.style.backgroundPosition = 'center center'
            img.style.backgroundSize = 'contain'
        } else {
            img.style.maxWidth = this.spaceForIcon + 'px'
            img.style.height = this.iconHeight + 'px'
            img.style.backgroundSize = Math.min(this.iconWidth, this.spaceForIcon) + 'px '
            img.style.margin = this.iconTopMargin + 'px ' + this.iconHmargin + 'px ' + this.iconBottomMargin + 'px '
            if (this.iconPlacement == IconPlacement.above) {
                img.style.backgroundPosition = 'center bottom'
            } else {
                img.style.backgroundPosition = 'center top'
                img.style.position = 'absolute'
                img.style.bottom = '0'
            }
        }
        return img
    }

    get contentTextIconFormat(): HTMLDivElement{
        let contentContainer = document.createElement('div')
        contentContainer.className = "contentContainer"
        
        let text = this.textElement
        text.textContent = this.text

        let textContainer = this.textByIconContainer
        textContainer.append(text)

        if(this.iconPlacement == IconPlacement.left){
            contentContainer.style.display = 'inline-block'
            contentContainer.append(this.img, textContainer)
            contentContainer.style.paddingLeft = this.textHmargin + 'px'
            contentContainer.style.paddingRight = this.textHmargin + 'px'
        } else {
            contentContainer.style.height = this.contentFOHeight + 'px'
            contentContainer.style.maxHeight = this.contentFOHeight + 'px'
            if (this.iconPlacement == IconPlacement.above)
                contentContainer.append(this.img, textContainer)
            else
                contentContainer.append(textContainer, this.img)
        }


        return contentContainer
    }

    get contentTextFormat(): HTMLDivElement{
        let contentContainer = document.createElement('div')
        contentContainer.className = "contentContainer"

        let text = this.textElement
        text.textContent = this.text

        let textContainer = this.textContainer
        textContainer.append(text)

        contentContainer.append(textContainer)


        return contentContainer
    }


    get content(): HTMLDivElement {
        switch(this.tileData.contentFormatType){
            case ContentFormatType.text_icon:
                return this.contentTextIconFormat
            default:
                return this.contentTextFormat
        }
    }


    //Events

    onTileMouseover(d?: Tile, i?: number, n?:BaseType[] | ArrayLike<BaseType>){}
    onTileMouseout(d?: Tile, i?: number, n?:BaseType[] | ArrayLike<BaseType>){}
    onTileClick(d?: Tile, i?: number, n?:BaseType[] | ArrayLike<BaseType>){} 
    
}