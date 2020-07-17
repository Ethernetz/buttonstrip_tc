import { FormatSettings } from './FormatSettings'
import { TileData } from './TileData'
import { Viewport } from './interfaces';
import { TileLayoutType, State, TileSizingType } from './enums';
import { getMatchingStateProperty, calculateWordDimensions } from './functions'
export class UniversalTileData{
    tilesData: TileData[]
    formatSettings: FormatSettings;
    constructor(tilesData: TileData[], formatSettings: FormatSettings) {
        this.tilesData = tilesData;
        this.formatSettings = formatSettings;
    }

    public scrollLeft: number = 0;
    public scrollTop: number = 0;

    public viewport: Viewport = {
        height: 0,
        width: 0
    };
    
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
    get numRows(): number {
        return Math.ceil(this.n / this.rowLength)
    }
    get rowLength(): number {
        switch (this.formatSettings.layout.tileLayout) {
            case (TileLayoutType.horizontal):
                return this.n
            case (TileLayoutType.vertical):
                return 1
            case (TileLayoutType.grid):
                return Math.max(1, this.formatSettings.layout.tilesPerRow)
        }
    }


    getMaxOfPropertyGroup(formatObj: any, propBase: string): number{
        return Math.max(
            getMatchingStateProperty(State.selected, formatObj, propBase),
            getMatchingStateProperty(State.unselected, formatObj, propBase),
            getMatchingStateProperty(State.hovered, formatObj, propBase),
            getMatchingStateProperty(State.disabled, formatObj, propBase),
        )
    }


    get maxTileStrokeWidth(): number{        
        return this.getMaxOfPropertyGroup(this.formatSettings.tile, 'strokeWidth')
    }

    get maxFontSize(): number{
        return this.getMaxOfPropertyGroup(this.formatSettings.text, 'fontSize')
    }
    get maxInlineTextHeight(): number {
        return Math.round(this.maxFontSize*4/3)
    }
    get minTileWidth(): number{
        return this.maxFontSize*5
    }


    get effectSpace(): number {
        return Math.max(this.shadowSpace, this.glowSpace, 2*this.maxTileStrokeWidth)
    }

    get shadow(): boolean {
        return this.formatSettings.effect.shadow
    }
    get shadowSpace(): number {
        return this.shadow ? 3 * (this.shadowMaxDistance + this.shadowMaxStrength) : 0
    }
    get shadowMaxDistance(): number {
        return this.getMaxOfPropertyGroup(this.formatSettings.effect, 'shadowDistance')
    }
    get shadowMaxStrength(): number {
        return this.getMaxOfPropertyGroup(this.formatSettings.effect, 'shadowStrength')
    }

    get glow(): boolean {
        return this.formatSettings.effect.glow
    }
    get glowSpace(): number {
        return this.formatSettings.effect.glow ? 5 * (this.glowMaxStrength) : 0
    }
    get glowMaxStrength(): number {
        return this.getMaxOfPropertyGroup(this.formatSettings.effect, 'glowStrength')
    }
}