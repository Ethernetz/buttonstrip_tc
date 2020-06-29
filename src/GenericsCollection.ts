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

    // onShift() {

    //     let dragHandle = d3.drag()
    //         .on("start", (d: Handle) => {
    //             d.handleFocused = true
    //         })
    //         .on("drag", (d: Handle, i, n) => {
    //             d.z = d3.event[d.axis]
    //             select(n[i])
    //                 .attr(d.axis, d3.event[d.axis])
    //             this.visual.update(this.options)
    //         })
    //         .on("end", (d: Handle) => {
    //             let object: powerbi.VisualObjectInstance = {
    //                 objectName: 'layout',
    //                 selector: undefined,
    //                 properties:
    //                     {}
    //             }
    //             object.properties[d.propName] = d.disp
    //             d.handleFocused = false
    //             this.visual.host.persistProperties({ merge: [object] })
    //         })

    //     if (this.visual.shiftFired)
    //         return
    //     this.visual.shiftFired = true
    //     console.log("shift pressed!")
    //     let firstCover = d3.select('.cover').filter((d, i) => { return i == 0 })
    //     let firstCoverData = firstCover.data()[0] as Generic
    //     console.log(firstCoverData)
    //     firstCover.data(firstCoverData.handles)
    //         .append('use')
    //         .attr("class", "handle")
    //         .attr("href", (d) => {
    //             return d.axis == "x" ?
    //                 "#handleHorizontal" :
    //                 "#handleVertical"
    //         })
    //         .attr("x", function (d) { return d.xPos })
    //         .attr("y", function (d) { return d.yPos })
    //         .call(dragHandle);


    //     console.log("here..")
    //     d3.select('.cover').append('foreignObject').data(this.tiles)
    //         .attr("class", function (d) { return "coverTitle " + d.tileShape })
    //         .append("xhtml:div")
    //         .attr("class", "titleTable")
    //         .append("xhtml:div")
    //         .attr("class", "titleTableCell")
    //         .append("xhtml:div")
    //         .attr("class", "titleContainer")
    //     let coverTitle = this.container.selectAll('.coverTitle').data(this.tiles)
    //         .attr("height", function (d) { return d.contentFOHeight})
    //         .attr("width", function (d) { return d.contentFOWidth })
    //         .attr("x", function (d) { return d.contentFOXPos })
    //         .attr("y", function (d) { return d.contentFOYPos })
    //     coverTitle.select('.titleTable')
    //         .style("height", "100%")
    //         .style("width", "100%")
    //         .style("display", "table")
    //     coverTitle.select(".titleTableCell")
    //         .style("display", "table-cell")
    //         .style("vertical-align", "middle")
    //         .html("")
    //         .style("text-align", function (d) { return d.textAlign })
    //         .append(function (d) { return d.content })
    //         .select(".textContainer")
    //         .call(sizeTextContainer)
    //         .call(styleText)
    //         .call(makeTextTransparent)

    //     coverTitle.select(".textContainer")
    //         .on("mouseenter", (d, i, n) => {
    //             if (/*Tile.textareaFocusedIndex != null */ true)
    //                 return

    //             d3.select(n[i]).selectAll(".text")
    //                 .style("display", "none")
    //             // titleFOs
    //             //     .filter((d) => { return d.i == i })
    //             //     .selectAll(".text")
    //             //     .style("opacity", "0")
    //             // d3.select(n[i])
    //             //     .append("textarea")
    //             //     .call(styleTextArea)
    //             //     .on("focus", () => {
    //             //         ProcessedVisualSettings.textareaFocusedIndex = i
    //             //         coverTitle.filter((d) => { return !d.textareaIsFocused }).remove()
    //             //     })
    //             //     .on("focusout", () => {
    //             //         ProcessedVisualSettings.textareaFocusedIndex = null
    //             //         this.shiftFired = false
    //             //         covers.select(".coverTitle")
    //             //             .remove()
    //             //         this.update(options)
    //             //     })
    //             //     .on("input", (d, i, n) => {
    //             //         coverTitle.data(data)
    //             //             .filter((d) => { return d.textareaIsFocused })
    //             //             .each((d) => { d.text = n[i].value })
    //             //             .call(resizeCoverTitleElements)
    //             //         let object: powerbi.VisualObjectInstance = {
    //             //             objectName: 'content',
    //             //             selector: undefined,
    //             //             properties:
    //             //                 {}
    //             //         }
    //             //         object.properties["text" + (ProcessedVisualSettings.textareaFocusedIndex + 1)] = n[i].value
    //             //         this.host.persistProperties({ merge: [object] })
    //             //     })
    //         })
    // }

    onShiftUp() {
        this.visual.shiftFired = false
        d3.select(".handle").remove()
        this.visual.update(this.options)
    }

}

export class Generic extends Tile {
    collection = <GenericsCollection>this.collection
    tilesData = <GenericData[]>this.tilesData
    visual: Visual = this.collection.visual


    onTileClick() {
        // this.visual.selectionManager.select((<GenericeData>this.tileData).selectionId, false) //BOUND
        this.visual.selectionManagerUnbound.select(this.i) //FIXED
        this.visual.update(this.collection.options)
    }

    onTileMouseover() {
        this.visual.hoveredIndex = this.i
        // this.visual.update(this.collection.options)
    }
    onTileMouseout() {
        this.visual.hoveredIndex = null
        // this.visual.update(this.collection.options)
    }
}

export class GenericData extends TileData {
    selectionId?: ISelectionId
}

