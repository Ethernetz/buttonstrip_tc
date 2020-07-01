import { Visual } from "./visual";
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import ISelectionId = powerbi.extensibility.ISelectionId;


import { TilesCollection } from "./TilesCollection/TilesCollection";
import { Tile } from "./TilesCollection/Tile";
import powerbi from "powerbi-visuals-api";
import { TileData } from "./TilesCollection/TileData";
import { ContentSource } from "./enums";

// import { sizeTextContainer, styleText, makeTextTransparent } from './d3calls'

export class ButtonsCollection extends TilesCollection {
    visual: Visual
    options: VisualUpdateOptions
    tilesData = <ButtonData[]>this.tilesData

    public createTile(i): Tile {
        return new Button(this, i, this.tilesData, this.formatSettings)
    }


}

export class Button extends Tile {
    collection = <ButtonsCollection>this.collection
    tilesData = <ButtonData[]>this.tilesData
    visual: Visual = this.collection.visual


    onTileClick() {
        if(this.visual.visualSettings.content.source == ContentSource.databound)
            this.visual.selectionManager.select((<ButtonData>this.tileData).selectionId, this.visual.visualSettings.content.multiselect) 
        else
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

export class ButtonData extends TileData {
    selectionId?: ISelectionId
}

