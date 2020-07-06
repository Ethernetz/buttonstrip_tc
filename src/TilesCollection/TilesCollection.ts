import { Viewport, BoundingBox } from './interfaces'
import { FormatSettings } from './FormatSettings'
import { TileData } from './TileData'
import { Tile } from './Tile'
import * as d3 from 'd3';

type Selection<T extends d3.BaseType> = d3.Selection<T, any, any, any>;
export class TilesCollection {
    formatSettings: FormatSettings = new FormatSettings();
    tilesData: TileData[] = [];
    viewport: Viewport;
    container: Selection<SVGElement>;
    svg: Selection<SVGElement>
    tiles: Tile[] = []

    maxBoundedTextHeight: number = 0
    maxInlineTextHeight: number = 0
    minTileWidth: number = 0
    public render(): void {
        this.formatSettings.viewport = this.viewport

        for (let i = 0; i < this.tilesData.length; i++) {
            this.createTile(i)
            this.tiles.push(this.createTile(i))
        }

        for (let i = 0; i < this.tiles.length; i++) {
            this.maxBoundedTextHeight = Math.max(this.maxBoundedTextHeight, this.tiles[i].boundedTextHeight)
        }

        let maxFontSize = Math.max(this.formatSettings.text.fontSizeS, this.formatSettings.text.fontSizeU, this.formatSettings.text.fontSizeH, this.formatSettings.text.fontSizeN)
        this.maxInlineTextHeight = Math.round(maxFontSize * 4 / 3)
        this.minTileWidth = maxFontSize * 5

        let totalHeight = this.tiles[this.tiles.length - 1].tileYpos + this.tiles[this.tiles.length - 1].tileHeight + this.tiles[0].effectSpace/2
        let farRightTileIndex = Math.min(this.tiles.length - 1, this.tiles[0].rowLength - 1)
        let totalWidth = this.tiles[farRightTileIndex].tileWidth + this.tiles[farRightTileIndex].tileXpos + this.tiles[0].effectSpace/2

        let horScroll = totalWidth > this.viewport.width
        let vertScroll = totalHeight > this.viewport.height

        if (vertScroll && !horScroll) {
            this.viewport.width -= 20
            totalWidth -= 20
        } else if (horScroll && !vertScroll) {
            this.viewport.height -= 20
            totalHeight -= 20
        }

        this.svg
            .style('width', totalWidth)
            .style('height', totalHeight)


        this.container.selectAll("defs").remove();
        this.container.append("defs")
        let defs = this.container.selectAll("defs")
        let filters = defs
            .selectAll("filter").data(this.tiles)
            .enter()
            .append("filter")
            .attr("id", d => { return "filter" + d.i })

        filters.filter(d => { return d.shadow })
            .append("feDropShadow")
            .attr("dx", d => { return d.shadowDirectionCoords.x * d.shadowDistance })
            .attr("dy", d => { return d.shadowDirectionCoords.y * d.shadowDistance })
            .attr("stdDeviation", d => { return d.shadowStrength })
            .attr("flood-color", d => { return d.shadowColor })
            .attr("flood-opacity", d => { return d.shadowTransparency })
            .attr("result", "dropshadow")

        filters.filter(d => { return d.glow })
            .append("feDropShadow")
            .attr("dx", 0)
            .attr("dy", 0)
            .attr("stdDeviation", d => { return d.glowStrength })
            .attr("flood-color", d => { return d.glowColor })
            .attr("flood-opacity", d => { return d.glowTransparency })
            .attr("result", "glow")

        defs.append("g")
            .attr("id", "handleHorizontal")
            .attr("class", "handle")
            .append("path")
            .attr("d", "M 0 0 l 6 12 l -12 0 z")
            .attr("fill", "#FFD700")
            .style("stroke", "#252423")
            .style("stroke-width", 0.5)
        defs.append("g")
            .attr("id", "handleVertical")
            .attr("class", "handle")
            .append("path")
            .attr("d", "M 0 0 l -12 6 l 0 -12 z")
            .attr("fill", "#FFD700")
            .style("stroke", "#252423")
            .style("stroke-width", 0.5)

        let patterns = defs
            .selectAll("pattern").data(this.tiles)
            .enter()
            .append("pattern")
            .attr("id", d => { return "image" + d.i })
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 1)
            .attr("height", 1)
            .append("image")
            .attr("class", (d) => { return "img" + d.i })
            .on('load', function (d) {
                let img: d3.Selection<d3.BaseType, unknown, HTMLElement, any> = d3.select('.img' + d.i)
                let imgElement: Element = img.node() as any //TODO make types more clear
                let dims = d.getBgImgDims(imgElement.getBoundingClientRect())
                img
                    .attr("width", dims.width)
                    .attr("height", dims.height)

                // d.setImageWidth() 
            })
            .attr("xlink:href", d => { return d.bgImgURL })

        let feMerge = filters.data(this.tiles).append("feMerge")
        feMerge.append("feMergeNode").attr("in", "dropshadow")
        feMerge.append("feMergeNode").attr("in", "glow")
        feMerge.append("feMergeNode").attr("in", "image")






        // Do I need this
        // this.container.selectAll(".tileContainer, .contentFO, .cover").filter((d, i, nodes: Element[]) => {
        //     return !nodes[i].classList.contains(this.formatSettings.layout.tileShape)
        // }).remove()

        let tileContainer = this.container.selectAll('.tileContainer').data(this.tiles)
        tileContainer.exit().remove()
        tileContainer = tileContainer.enter().append('g')
            .attr("class", function (d) { return "tileContainer " + d.tileShape })
        tileContainer.append('path').attr("class", "fill")
        tileContainer.append('path').attr("class", "stroke")


        tileContainer = this.container.selectAll('.tileContainer').data(this.tiles)
        tileContainer.select(".fill")
            .attr("d", function (d) { return d.shapePath })
            .attr("fill", function (d) { return d.bgImgURL ? d.bgimg : d.tileFill })
            .style("fill-opacity", function (d) { return d.tileFillOpacity })
            .style("filter", function (d) { return d.filter })
        tileContainer.select(".stroke")
            .attr("d", function (d) { return d.shapeStrokePath })
            .style("fill-opacity", 0)
            .style("stroke", function (d) { return d.tileStroke })
            .style("stroke-width", function (d) { return d.tileStrokeWidth })


        let contentFO = this.container.selectAll('.contentFO').data(this.tiles)
        contentFO.exit().remove()
        contentFO.enter()
            .append('foreignObject')
            .attr("class", function (d) { return "contentFO " + d.tileShape })
            .append("xhtml:div")
            .attr("class", "contentTable")
            .append("xhtml:div")
            .attr("class", "contentTableCell")
            .append("xhtml:div")
            .attr("class", "contentContainer")

        contentFO = this.container.selectAll('.contentFO').data(this.tiles)
            .attr("height", function (d) { return d.contentBoundingBoxHeight })
            .attr("width", function (d) { return d.contentBoundingBoxWidth })
            .attr("x", function (d) { return d.contentBoundingBoxXPos })
            .attr("y", function (d) { return d.contentBoundingBoxYPos })
        contentFO.select('.contentTable')
            .style("height", "100%")
            .style("width", "100%")
            .style("display", "table")
        contentFO.select(".contentTableCell")
            .style("display", "table-cell")
            .style("vertical-align", "middle")
            .html("")
            .style("text-align", function (d) { return d.textAlign })
            .append(function (d) { return d.content })


        contentFO.select('.textContainer')
            .style("opacity", function (d) { return d.textOpacity })
            .style("font-size", function (d) { return d.fontSize + "pt" })
            .style("font-family", function (d) { return d.fontFamily })
            .style("color", function (d) { return d.textColor })
            .style("text-align", function (d) { return d.textAlign })

        contentFO.select('.text2Container')
            .style("opacity", function (d) { return d.text2Opacity })
            .style("font-size", function (d) { return d.font2Size + "pt" })
            .style("font-family", function (d) { return d.font2Family })
            .style("color", function (d) { return d.text2Color })
            .style("text-align", function (d) { return d.text2Align })



        let covers = this.container.selectAll('.cover').data(this.tiles)
        covers.exit().remove()
        covers.enter().append('g')
            .attr("class", "cover " + this.formatSettings.layout.tileShape)
            .append("path")
        covers = this.container.selectAll('.cover').data(this.tiles)
        covers.select("path")
            .attr("d", function (d) { return d.shapePath })
            .style("fill-opacity", function (d) { return 0 })
            .on('mouseover', (d, i, n) => {
                d.onTileMouseover(d, i, n)
            })
            .on('mouseout', (d, i, n) => {
                d.onTileMouseout(d, i, n)
            })
            .on('click', (d, i, n) => {
                d.onTileClick(d, i, n)
            })


        d3.select("body")
            .on("keydown", () => {
                if (d3.event.shiftKey)
                    this.onShift()
            })
            .on("keyup", () => {
                if (d3.event.keyCode == 16)
                    this.onShiftUp()
            })

    }

    public createTile(i): Tile {
        new Tile(this, i, this.tilesData, this.formatSettings)
        return new Tile(this, i, this.tilesData, this.formatSettings)
    }
    onShift() { }
    onShiftUp() { }
}