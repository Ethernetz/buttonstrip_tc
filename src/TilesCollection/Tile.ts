import { Viewport } from './interfaces'
import { FormatSettings, TextSettings, ContentAlignmentSettings, LayoutSettings, TileSettings, EffectSettings, IconSettings } from './FormatSettings'
import { TileData } from './TileData'
import { State, TileSizingType, TileLayoutType, HorizontalAlignmentType, TileShape, Direction, ContentFormatType, IconPlacement, VerticalAlignmentType } from './enums'
import { getMatchingStateProperty, calculateWordDimensions } from './functions'
import { Shape, Rectangle, Parallelogram, Chevron, Ellipse, Pentagon, Hexagon, Tab_RoundedCorners, Tab_CutCorners, Tab_CutCorner, ChevronVertical, ParallelogramVertical } from "./shapes"
import { BaseType, thresholdScott } from 'd3'
import { TilesCollection } from './TilesCollection'
import { Handle } from './interfaces'
import * as d3 from 'd3'
import { UniversalTileData } from './UniversalTileData'
import { setLocaleOptions } from 'powerbi-visuals-utils-formattingutils/lib/src/valueFormatter'
export class Tile {
    collection: TilesCollection
    i: number;
    tilesData: TileData[]
    universalTileData: UniversalTileData
    formatSettings: FormatSettings;
    constructor(collection: TilesCollection, i: number, tilesData: TileData[], formatSettings: FormatSettings) {
        this.collection = collection
        this.i = i;
        this.tilesData = tilesData;
        this.universalTileData = this.collection.universalTileData;
        this.formatSettings = formatSettings;
    }
    //Format Settings


    get tilesInRow(): number {
        return (this.universalTileData.numRows - 1) * this.universalTileData.rowLength > this.i
            || this.universalTileData.n % this.universalTileData.rowLength == 0
            ? this.universalTileData.rowLength
            : this.universalTileData.n % this.universalTileData.rowLength
    }
    get rowNumber(): number {
        return Math.floor(this.i / this.universalTileData.rowLength)
    }
    get indexInRow(): number {
        return this.i % this.universalTileData.rowLength
    }
    get rowStartingIndex(): number {
        return this.rowNumber * this.universalTileData.rowLength
    }

    get text(): string {
        return this.tileData.text
    }
    get rowText(): string[] {
        return this.tilesData.slice(this.rowStartingIndex, this.rowStartingIndex + this.tilesInRow).map(function (td) { return td.text }) as string[]
    }

    get textSettings(): TextSettings {
        return this.formatSettings.text
    }

    get textColor(): string {
        return getMatchingStateProperty(this.currentState, this.textSettings, 'color')
    }
    get textOpacity(): number {
        return 1 - getMatchingStateProperty(this.currentState, this.textSettings, 'transparency') / 100
    }
    get fontSize(): number {
        return getMatchingStateProperty(this.currentState, this.textSettings, 'fontSize')
    }
    get fontFamily(): string {
        return getMatchingStateProperty(this.currentState, this.textSettings, 'fontFamily')
    }

    get contentAlignmentSettings(): ContentAlignmentSettings {
        return this.formatSettings.contentAlignment
    }

    get contentHorizontalAlignment(): HorizontalAlignmentType {
        return getMatchingStateProperty(this.currentState, this.contentAlignmentSettings, 'horizontalAlignment')
    }
    get contentVerticalAlignment(): VerticalAlignmentType {
        return getMatchingStateProperty(this.currentState, this.contentAlignmentSettings, 'verticalAlignment')
    }
    get contentMarginLeft(): number {
        return getMatchingStateProperty(this.currentState, this.contentAlignmentSettings, 'leftMargin')
    }
    get contentMarginRight(): number {
        return getMatchingStateProperty(this.currentState, this.contentAlignmentSettings, 'rightMargin')
    }
    get contentMarginTop(): number {
        return getMatchingStateProperty(this.currentState, this.contentAlignmentSettings, 'topMargin')
    }
    get contentMarginBottom(): number {
        return getMatchingStateProperty(this.currentState, this.contentAlignmentSettings, 'bottomMargin')
    }


    get totalContentHorizontalMargin(): number {
        return this.contentMarginLeft + this.contentMarginRight
    }
    get totalContentVerticalMargin(): number {
        return this.contentMarginTop + this.contentMarginBottom
    }


    get text2Color(): string {
        return getMatchingStateProperty(this.currentState, this.textSettings, 'color')
    }
    get text2Opacity(): number {
        return 1 - getMatchingStateProperty(this.currentState, this.textSettings, 'transparency') / 100
    }
    get font2Size(): number {
        return getMatchingStateProperty(this.currentState, this.textSettings, 'fontSize')
    }
    get font2Family(): string {
        return getMatchingStateProperty(this.currentState, this.textSettings, 'fontFamily')
    }


    get allTextWidth(): number {
        return calculateWordDimensions(this.rowText.join(""), this.fontFamily, this.fontSize + "pt").width
    }
    get widthSpaceForText(): number {
        return this.contentContainerWidth - this.totalContentHorizontalMargin
    }
    get widthSpaceForAllText(): number {
        return this.universalTileData.viewport.width - this.universalTileData.rowLength * this.totalContentHorizontalMargin - this.totalTileHPadding - this.universalTileData.effectSpace
    }
    get inlineTextWidth(): number {
        return calculateWordDimensions(this.text, this.fontFamily, this.fontSize + "pt").width
    }
    get boundedTextWidth(): number {
        return calculateWordDimensions(this.text as string, this.fontFamily, this.fontSize + "pt", this.textContainerWidthType, (this.maxHorizontalTextSpace) + 'px').width;
    }
    get maxIndividualBoundedTextHeight(): number {
        return calculateWordDimensions(this.text as string, this.fontFamily, this.maxFontSize + "pt", this.textContainerWidthType, (this.maxHorizontalTextSpace) + 'px').height;
    }

    get maxFontSize(): number{
        return this.universalTileData.maxFontSize
    }

    get maxBoundedTextHeight(): number {
        return this.universalTileData.maxBoundedTextHeight
    }

    get beforeInRowText(): string[] {
        return this.rowText.slice(0, this.indexInRow)
    }
    get beforeInRowTextWidth(): number {
        if (this.beforeInRowText.length == 0)
            return 0
        return calculateWordDimensions(this.beforeInRowText.join(""), this.fontFamily, this.fontSize + "pt").width
    }

    get textContainerWidthType(): string {
        return this.inlineTextWidth + this.totalContentHorizontalMargin >= Math.floor(this.maxHorizontalTextSpace)
            && this.contentFormatType == ContentFormatType.text_icon
            && (this.iconPlacement == IconPlacement.left)
            ? 'min-content' : 'auto'
    }

    get textContainerHeight(): number {
        return this.maxBoundedTextHeight
    }
    get contentContainerWidth(): number {
        return this.shape.contentBoundingBox.width
    }

    get text2(): string {
        return this.tileData.text2
    }

    get tileSettings(): TileSettings {
        return this.formatSettings.tile
    }

    get tileFill(): string {
        return getMatchingStateProperty(this.currentState, this.tileSettings, 'color')
    }
    get tileFillOpacity(): number {
        return 1 - getMatchingStateProperty(this.currentState, this.tileSettings, 'transparency') / 100
    }
    get tileStroke(): string {
        return getMatchingStateProperty(this.currentState, this.tileSettings, 'stroke')
    }
    get tileStrokeWidth(): number {
        return getMatchingStateProperty(this.currentState, this.tileSettings, 'strokeWidth')
    }

    get layoutSettings(): LayoutSettings{
        return this.formatSettings.layout
    }
    
    get tilePadding(): number {
        return this.layoutSettings.padding
    }
    get tileHPadding(): number {
        return this.tilePadding + this.alterHorizontalPadding
    }
    get totalTileHPadding(): number {
        return this.tileHPadding * (this.universalTileData.rowLength - 1)
    }
    get tileVPadding(): number {
        return this.tilePadding + this.alterVerticalPadding
    }
    get totalTileVPadding(): number {
        return this.tileVPadding * (this.universalTileData.numRows - 1)
    }
    get tileWidth(): number {
        switch (this.layoutSettings.sizingMethod) {
            case TileSizingType.uniform:
                return Math.max((this.universalTileData.containerWidth - this.totalTileHPadding) / this.universalTileData.rowLength, this.universalTileData.minTileWidth + this.totalContentHorizontalMargin + this.shapeExtraHSpace)
            case TileSizingType.fixed:
                return this.layoutSettings.tileWidth
            case TileSizingType.dynamic:
                if (this.indexInRow == this.universalTileData.rowLength - 1)
                    return this.universalTileData.containerWidth - this.tileXpos
                return this.inlineTextWidth + this.dynamicExtraWidthPerTile
        }
    }
    get dynamicExtraWidthPerTile(): number {
        let textSpaceRequired = this.allTextWidth + this.totalContentHorizontalMargin * this.universalTileData.rowLength + this.totalTileHPadding
        let spaceRemaining = Math.max(0, this.universalTileData.containerWidth - textSpaceRequired)
        return spaceRemaining / this.universalTileData.rowLength
    }
    get tileHeight(): number {
        if (this.layoutSettings.autoHeight)
            return this.universalTileData.maxInlineTextHeight + 10
        if (this.layoutSettings.sizingMethod == TileSizingType.fixed)
            return this.layoutSettings.tileHeight
        return Math.max((this.universalTileData.containerHeight - this.totalTileVPadding) / this.universalTileData.numRows, this.universalTileData.maxInlineTextHeight + this.totalContentVerticalMargin + this.shapeExtraVSpace)

    }

    get tileXpos(): number {
        switch (this.layoutSettings.sizingMethod) {
            case TileSizingType.fixed:
                let areaTaken = this.tilesInRow * this.tileWidth + (this.tilesInRow - 1) * this.tileHPadding
                let areaRemaining = this.universalTileData.containerWidth - areaTaken
                switch (this.layoutSettings.tileAlignment) {
                    case HorizontalAlignmentType.left:
                        return this.indexInRow * (this.tileWidth + this.tileHPadding) + this.universalTileData.effectSpace / 2
                    case HorizontalAlignmentType.right:
                        return areaRemaining + this.indexInRow * (this.tileWidth + this.tileHPadding) + this.universalTileData.effectSpace / 2
                    case HorizontalAlignmentType.center:
                        return areaRemaining / 2 + this.indexInRow * (this.tileWidth + this.tileHPadding) + this.universalTileData.effectSpace / 2

                }
            case TileSizingType.uniform:
                return this.indexInRow * (this.tileWidth + this.tileHPadding) + this.universalTileData.effectSpace / 2
            case TileSizingType.dynamic:
                return this.beforeInRowTextWidth + this.dynamicExtraWidthPerTile * this.indexInRow + this.universalTileData.effectSpace / 2 + this.indexInRow * (this.tileHPadding)
        }
    }
    get tileYpos(): number {
        return this.rowNumber * (this.tileHeight + this.tileVPadding) + this.universalTileData.effectSpace / 2
    }


    get tileShape(): TileShape {
        return this.layoutSettings.tileShape
    }
    get shape(): Shape {
        switch (this.tileShape) {
            case TileShape.rectangle:
                return new Rectangle(this.tileXpos, this.tileYpos, this.tileWidth, this.tileHeight, this.shapeRoundedCornerRadius)
            case TileShape.parallelogram:
                if (this.layoutSettings.tileLayout != TileLayoutType.vertical)
                    return new Parallelogram(this.tileXpos, this.tileYpos, this.tileWidth, this.tileHeight, this.layoutSettings.parallelogramAngle, this.shapeRoundedCornerRadius)
                else
                    return new ParallelogramVertical(this.tileXpos, this.tileYpos, this.tileWidth, this.tileHeight, this.layoutSettings.parallelogramAngle, this.shapeRoundedCornerRadius)
            case TileShape.chevron:
                if (this.layoutSettings.tileLayout != TileLayoutType.vertical)
                    return new Chevron(this.tileXpos, this.tileYpos, this.tileWidth, this.tileHeight, this.layoutSettings.chevronAngle, this.shapeRoundedCornerRadius)
                else
                    return new ChevronVertical(this.tileXpos, this.tileYpos, this.tileWidth, this.tileHeight, this.layoutSettings.chevronAngle, this.shapeRoundedCornerRadius)
            case TileShape.ellipse:
                return new Ellipse(this.tileXpos, this.tileYpos, this.tileWidth, this.tileHeight)
            case TileShape.pentagon:
                return new Pentagon(this.tileXpos, this.tileYpos, this.tileWidth, this.tileHeight, this.layoutSettings.pentagonAngle, this.shapeRoundedCornerRadius)
            case TileShape.hexagon:
                return new Hexagon(this.tileXpos, this.tileYpos, this.tileWidth, this.tileHeight, this.layoutSettings.hexagonAngle, this.shapeRoundedCornerRadius)
            case TileShape.tab_roundedCorners:
                return new Tab_RoundedCorners(this.tileXpos, this.tileYpos, this.tileWidth, this.tileHeight)
            case TileShape.tab_cutCorners:
                return new Tab_CutCorners(this.tileXpos, this.tileYpos, this.tileWidth, this.tileHeight, this.layoutSettings.tab_cutCornersLength)
            case TileShape.tab_cutCorner:
                return new Tab_CutCorner(this.tileXpos, this.tileYpos, this.tileWidth, this.tileHeight, this.layoutSettings.tab_cutCornerLength)
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
        if (this.layoutSettings.tileLayout == TileLayoutType.vertical)
            return 0
        switch (this.tileShape) {
            case TileShape.parallelogram:
                return Parallelogram.getAlterHPadding(this.tileHeight, this.layoutSettings.parallelogramAngle)
            case TileShape.chevron:
                return Chevron.getAlterHPadding(this.tileHeight, this.layoutSettings.chevronAngle)
            default:
                return 0
        }
    }
    get alterVerticalPadding(): number {
        if (this.layoutSettings.tileLayout != TileLayoutType.vertical)
            return 0
        switch (this.tileShape) {
            case TileShape.parallelogram:
                return ParallelogramVertical.getAlterVPadding(this.tileWidth, this.layoutSettings.parallelogramAngle)
            case TileShape.chevron:
                return ChevronVertical.getAlterVPadding(this.tileWidth, this.layoutSettings.chevronAngle)
            default:
                return 0
        }
    }

    get shapeExtraHSpace(): number {
        if (this.layoutSettings.tileLayout == TileLayoutType.vertical)
            return 0
        switch (this.tileShape) {
            case TileShape.parallelogram:
                return Parallelogram.getExtraHSpace(this.tileHeight, this.layoutSettings.parallelogramAngle)
            case TileShape.chevron:
                return Chevron.getExtraHSpace(this.tileHeight, this.layoutSettings.chevronAngle)
            case TileShape.pentagon:
                return Pentagon.getExtraHSpace(this.tileHeight, this.layoutSettings.pentagonAngle)
            case TileShape.hexagon:
                return Hexagon.getExtraHSpace(this.tileHeight, this.layoutSettings.hexagonAngle)
            default:
                return 0
        }
    }

    get shapeExtraVSpace(): number {
        if (this.layoutSettings.tileLayout != TileLayoutType.vertical)
            return 0
        switch (this.tileShape) {
            case TileShape.parallelogram:
                return ParallelogramVertical.getExtraVSpace(this.tileWidth, this.layoutSettings.parallelogramAngle)
            case TileShape.chevron:
                return ChevronVertical.getExtraVSpace(this.tileWidth, this.layoutSettings.chevronAngle)
            default:
                return 0
        }
    }

    get contentBoundingBoxHeight(): number {
        return this.shape.contentBoundingBox.height
    }
    get contentBoundingBoxWidth(): number {
        return this.shape.contentBoundingBox.width
    }

    get contentBoundingBoxXPos(): number {
        return this.shape.contentBoundingBox.x
    }

    get contentBoundingBoxYPos(): number {
        return this.shape.contentBoundingBox.y
    }


    get effectSettings(): EffectSettings {
        return this.formatSettings.effect
    }

    get shapeRoundedCornerRadius(): number {
        return this.effectSettings.shapeRoundedCornerRadius
    }

    get shadowColor(): string {
        return getMatchingStateProperty(this.currentState, this.effectSettings, 'shadowColor')
    }
    get shadowTransparency(): number {
        return 1 - getMatchingStateProperty(this.currentState, this.effectSettings, 'shadowTransparency') / 100
    }
    get shadowDistance(): number {
        return getMatchingStateProperty(this.currentState, this.effectSettings, 'shadowDistance')
    }
    get shadowStrength(): number {
        return getMatchingStateProperty(this.currentState, this.effectSettings, 'shadowStrength')
    }
    get shadowDirection(): Direction {
        return getMatchingStateProperty(this.currentState, this.effectSettings, 'shadowDirection')
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

    get glowColor(): string {
        return getMatchingStateProperty(this.currentState, this.effectSettings, 'glowColor')
    }
    get glowTransparency(): number {
        return 1 - getMatchingStateProperty(this.currentState, this.effectSettings, 'glowTransparency') / 100
    }
    get glowStrength(): number {
        return getMatchingStateProperty(this.currentState, this.effectSettings, 'glowStrength')
    }



    get iconURL(): string {
        return this.tileData.iconURL
    }
    get iconSettings(): IconSettings {
        return this.formatSettings.icon
    }

    get iconWidth(): number {
        return getMatchingStateProperty(this.currentState, this.iconSettings, 'width')
    }
    get iconPlacement(): IconPlacement {
        return getMatchingStateProperty(this.currentState, this.contentAlignmentSettings, 'iconPlacement')
    }
    get iconVerticalMaxHeight(): number {
        return this.contentBoundingBoxHeight - this.textContainerHeight - this.totalContentVerticalMargin - this.iconTextPadding
    }
    get iconHorizontalMaxHeight(): number {
        return this.contentBoundingBoxHeight - this.totalContentVerticalMargin
    }
    get iconOpacity(): number {
        return 1 - getMatchingStateProperty(this.currentState, this.iconSettings, 'transparency') / 100
    }
    get iconTextPadding(): number {
        return getMatchingStateProperty(this.currentState, this.contentAlignmentSettings, 'iconTextPadding')
    }


    get bgImgURL(): string {
        if (this.tileData.bgimgURL)
            return this.tileData.bgimgURL
        return ""
    }

    getBgImgDims(aspectRatio: number): { width: number; height: number } {
        let tileRatio = this.tileWidth / this.tileHeight
        let imgRatio = aspectRatio
        if (tileRatio > imgRatio)
            return {
                width: this.tileWidth,
                height: (1 / aspectRatio) * this.tileWidth
            }
        else
            return {
                width: aspectRatio * this.tileHeight,
                height: this.tileHeight
            }
    }


    //Tile data
    get tileData(): TileData {
        return this.tilesData[this.i];
    }

    get isSelected(): boolean {
        return this.tileData.isSelected;
    }
    get isHovered(): boolean {
        return this.tileData.isHovered;
    }
    get isDisabled(): boolean {
        return this.tileData.isDisabled;
    }
    get currentState(): State {
        if (this.isDisabled)
            return this.isHovered ? State.hovered : State.disabled
        else if (this.isSelected)
            return State.selected;
        else if (this.isHovered)
            return State.hovered;
        else
            return State.unselected;
    }

    get maxHorizontalTextSpace(): number {
        console.log(1)
        console.log(this.contentContainerWidth)
        console.log(2)
        let maxSpace = this.contentContainerWidth - this.totalContentHorizontalMargin
        if (this.contentFormatType == ContentFormatType.text_icon && this.iconPlacement == IconPlacement.left)
            maxSpace -= (this.iconWidth + this.iconTextPadding)
        return maxSpace
    }


    get textElement(): HTMLSpanElement {
        let text = document.createElement('span')
        text.className = 'text'
        text.style.width = this.boundedTextWidth + 'px'
        return text
    }


    get textContainer(): HTMLDivElement {
        let textContainer = document.createElement('div')
        textContainer.className = 'textContainer'
        textContainer.style.position = 'relative'
        textContainer.style.display = 'flex'
        textContainer.style.height = this.maxBoundedTextHeight + 'px'
        textContainer.style.maxHeight = this.contentBoundingBoxHeight + 'px'
        textContainer.style.maxWidth = this.maxHorizontalTextSpace + 'px'
        // textContainer.style.backgroundColor = 'red'

        let text = this.textElement
        text.textContent = this.text
        textContainer.append(text)
        textContainer = this.setTextContainerAlignments(textContainer)
        return textContainer
    }
    

    get icon(): HTMLImageElement {
        let icon = document.createElement('img') as HTMLImageElement
        icon.className = 'icon'
        icon.src = this.iconURL
        icon.height = this.universalTileData.maxIconHeight
        icon.style.objectFit = 'contain'
        icon.style.opacity = this.iconOpacity.toString()
        icon.style.width = this.iconWidth + 'px'
        icon.style.maxHeight = this.iconHorizontalMaxHeight + 'px'
        return icon
    }

    public setTextContainerAlignments(textContainer: HTMLDivElement): HTMLDivElement {
        switch (this.contentHorizontalAlignment) {
            case HorizontalAlignmentType.left:
                textContainer.style.justifyContent = 'flex-start'
                break;
            case HorizontalAlignmentType.center:
                textContainer.style.justifyContent = 'center'
                break;
            case HorizontalAlignmentType.right:
                textContainer.style.justifyContent = 'flex-end'
                break;
            default:
                textContainer.style.justifyContent = 'center';
        }

        switch (this.contentVerticalAlignment) {
            case VerticalAlignmentType.top:
                textContainer.style.alignItems = 'flex-end'
                break;
            case VerticalAlignmentType.middle:
                if (this.contentFormatType == ContentFormatType.text_icon) {
                    if (this.iconPlacement == IconPlacement.above)
                        textContainer.style.alignItems = 'flex-start'
                    else if (this.iconPlacement == IconPlacement.below)
                        textContainer.style.alignItems = 'flex-end'
                    else
                        textContainer.style.alignItems = 'center'
                } else {
                    // textContainer.style.alignItems = this.tileHeight > this.maxBoundedTextHeight ? 'center' : 'flex-start'
                    textContainer.style.alignItems = 'center'
                }
                break;
            case VerticalAlignmentType.bottom:
                textContainer.style.alignItems = 'flex-start'
                break;
            default:
                textContainer.style.alignItems = 'center';
        }
        return textContainer
    }

    get textContent(): HTMLDivElement {
        let content = document.createElement('div')
        content.append(this.textContainer)
        return content
    }

    get iconContent(): HTMLDivElement {
        let content = document.createElement('div')
        content.append(this.icon)
        return content
    }

    get textIconContent(): HTMLDivElement {
        let content = document.createElement('div')
        let textContainer = this.textContainer
        let icon = this.icon
        textContainer.style.verticalAlign = 'middle'
        if (this.iconPlacement == IconPlacement.left) {
            icon.style.marginRight = this.iconTextPadding + 'px'
            icon.style.display = 'inline-block'
            icon.style.verticalAlign = 'middle'
            textContainer.style.display = 'inline-flex'
            textContainer.style.alignItems = 'center'
            textContainer.style.width = this.textContainerWidthType
            content.append(icon, textContainer)
        } else if (this.iconPlacement == IconPlacement.above) {
            icon.style.marginBottom = this.iconTextPadding + 'px'
            icon.style.objectPosition = 'bottom'
            content.append(icon, textContainer)
        } else if (this.iconPlacement == IconPlacement.below) {
            icon.style.marginTop = this.iconTextPadding + 'px'
            icon.style.objectPosition = 'top'
            textContainer.style.alignItems = 'flex-end'
            content.append(textContainer, icon)
        }
        return content
    }

    get content(): HTMLDivElement {
        switch (this.contentFormatType) {
            case ContentFormatType.text:
                return this.textContent
            case ContentFormatType.icon:
                return this.iconContent
            case ContentFormatType.text_icon:
                return this.textIconContent
            default:
                return document.createElement('div');
        }
    }


    get contentContainer(): HTMLDivElement {
        let contentContainer = document.createElement('div')
        contentContainer.className = "contentContainer"
        contentContainer.style.marginTop = this.contentMarginTop + 'px'
        contentContainer.style.marginRight = this.contentMarginRight + 'px'
        contentContainer.style.marginBottom = this.contentMarginBottom + 'px'
        contentContainer.style.marginLeft = this.contentMarginLeft + 'px'
        contentContainer.append(this.content)
        return contentContainer
    }


    get contentFormatType(): ContentFormatType {
        return this.tileData.contentFormatType
    }


    get inHorizontalWindow(): boolean {
        return this.tileXpos + this.tileWidth > this.universalTileData.scrollLeft && this.tileXpos < this.universalTileData.scrollLeft + this.universalTileData.viewportWidth
    }
    get inVerticalWindow(): boolean {
        return this.tileYpos + this.tileHeight > this.universalTileData.scrollTop && this.tileYpos < this.universalTileData.scrollTop + this.universalTileData.viewportHeight
    }
    get inViewWindow(): boolean {
        return this.inVerticalWindow && this.inHorizontalWindow
    }




    //Events

    onTileMouseover(d?: Tile, i?: number, n?: BaseType[] | ArrayLike<BaseType>) { }
    onTileMouseout(d?: Tile, i?: number, n?: BaseType[] | ArrayLike<BaseType>) { }
    onTileClick(d?: Tile, i?: number, n?: BaseType[] | ArrayLike<BaseType>) { }

}