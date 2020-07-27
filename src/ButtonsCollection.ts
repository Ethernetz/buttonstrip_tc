import { Visual } from "./visual";
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import ISelectionId = powerbi.extensibility.ISelectionId;


import { TilesCollection } from "./TilesCollection/TilesCollection";
import { Tile } from "./TilesCollection/Tile";
import powerbi from "powerbi-visuals-api";
import { TileData } from "./TilesCollection/TileData";
import { ContentSource } from "./enums";

export class ButtonsCollection extends TilesCollection {
    visual: Visual
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
            this.visual.selectionManager.select((<ButtonData>this.tileData).selectionId) 
        else
            this.visual.selectionManagerUnbound.select(this.i)
        this.collection.onStateChange(this.visual.createButtonData()) 
    }

    onTileMouseover() {
        this.visual.hoveredIndex = this.i
        this.collection.onStateChange(this.visual.createButtonData()) 
    }
    onTileMouseout() {
        this.visual.hoveredIndex = null
        this.collection.onStateChange(this.visual.createButtonData()) 
    }
}

export class ButtonData extends TileData {
    selectionId?: ISelectionId
}

