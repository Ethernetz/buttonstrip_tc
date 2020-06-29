import { Visual } from "./visual";
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import ISelectionId = powerbi.extensibility.ISelectionId;


import { TilesCollection } from "./TilesCollection/TilesCollection";
import { Tile } from "./TilesCollection/Tile";
import powerbi from "powerbi-visuals-api";
import { TileData } from "./TilesCollection/TileData";
import * as d3 from "d3";
import { Shape } from "./TilesCollection/shapes";
import { Handle } from "./interfaces";
import { select } from "d3";

// import { sizeTextContainer, styleText, makeTextTransparent } from './d3calls'

export class GenericsCollection extends TilesCollection {
    visual: Visual
    options: VisualUpdateOptions
    tilesData = <GenericData[]>this.tilesData

    public createTile(i): Tile {
        return new Generic(this, i, this.tilesData, this.formatSettings)
    }


}

export class Generic extends Tile {
    collection = <GenericsCollection>this.collection
    tilesData = <GenericData[]>this.tilesData
    visual: Visual = this.collection.visual


    onTileClick() {
        this.visual.selectionManagerUnbound.select(this.i, this.visual.visualSettings.content.multiselect) //FIXED
        this.visual.update(this.collection.options)
    }

    onTileMouseover() {
        this.visual.hoveredIndex = this.i
        let vs = this.collection.visual.visualSettings
        if(vs.tile.hoverStyling || vs.text.hoverStyling || vs.icon.hoverStyling || vs.effects.hoverStyling)
            this.visual.update(this.collection.options)
    }
    onTileMouseout() {
        this.visual.hoveredIndex = null
        let vs = this.collection.visual.visualSettings
        if(vs.tile.hoverStyling || vs.text.hoverStyling || vs.icon.hoverStyling || vs.effects.hoverStyling)
            this.visual.update(this.collection.options)
    }
}

export class GenericData extends TileData {
    selectionId?: ISelectionId
}

