import { Viewport, BoundingBox } from './interfaces'
import { FormatSettings } from './FormatSettings'
import { TileData } from './TileData'
import { UniversalTileData } from './UniversalTileData'
import { Tile } from './Tile'
import * as d3 from 'd3';

type Selection<T extends d3.BaseType> = d3.Selection<T, any, any, any>;
export class TilesCollection {
    formatSettings: FormatSettings = new FormatSettings();
    tilesData: TileData[] = [];
    viewport: Viewport;
    container: Selection<SVGElement>;
    svg: Selection<SVGElement>
    universalTileData: UniversalTileData;
    tiles: Tile[] = []
    visualElement: HTMLElement;
    maxBoundedTextHeight: number = 0


    public createTiles(tilesData: TileData[]): Tile[] {
        let tiles: Tile[] = []
        for (let i = 0; i < tilesData.length; i++)
            tiles.push(this.createTile(i))
        return tiles
    }


    public sameDataState(tdold: TileData, tdnew: TileData): boolean {
        // return JSON.stringify(tdold) === JSON.stringify(tdnew) //TODO is this better?
        return (tdold.isDisabled == tdnew.isDisabled)
            && (tdold.isSelected == tdnew.isSelected)
            && (tdold.isHovered == tdnew.isHovered)
    }

    public render(newTilesData: TileData[]): void {
        if (this.tilesData.length > 0){
            for (let i = 0; i < newTilesData.length; i++)
                newTilesData[i].sameState = this.tilesData[i] && this.sameDataState(this.tilesData[i], newTilesData[i])
            }
        else {
            for (let i = 0; i < newTilesData.length; i++)
                newTilesData[i].needsToBeRendered = true
            this.clear()
        }
        
        this.tilesData = newTilesData.map((d, i)=>{return {...this.tilesData[i], ...d}})

        this.universalTileData = this.createUniversalTileData()
        this.tiles = this.createTiles(this.tilesData)

        this.universalTileData.viewport.height = this.viewport.height - 0.1
        this.universalTileData.viewport.width = this.viewport.width - 0.1


        let lastTile = this.tiles[this.tiles.length - 1]
        let totalHeight = lastTile.tileYpos + lastTile.tileHeight + this.universalTileData.effectSpace / 2

        let rightmostTile = this.tiles[Math.min(this.tiles.length - 1, this.universalTileData.rowLength - 1)]
        let totalWidth = rightmostTile.tileWidth + rightmostTile.tileXpos + this.universalTileData.effectSpace / 2

        let horScroll = totalWidth > this.viewport.width
        let vertScroll = totalHeight > this.viewport.height

        if (this.visualElement) {
            if(vertScroll || horScroll){

                if (vertScroll && !horScroll) {
                    this.universalTileData.viewport.width -= 20
                    totalWidth -= 20
                } else if (horScroll && !vertScroll) {
                    this.universalTileData.viewport.height -= 20
                    totalHeight -= 20
                }

                this.visualElement.style.fontSize = "0px"
                this.visualElement.style.overflow = 'auto';
                this.visualElement.onscroll = () => {this.render(this.tilesData);}


                this.universalTileData.scrollLeft = this.visualElement.scrollLeft
                this.universalTileData.scrollTop = this.visualElement.scrollTop

                for (let i = 0; i < this.tiles.length; i++){
                    this.tilesData[i].needsToBeRendered = !this.tilesData[i].isRendered && this.tiles[i].inViewWindow
                }

                totalHeight = lastTile.tileYpos + lastTile.tileHeight + this.universalTileData.effectSpace / 2
                totalWidth = rightmostTile.tileWidth + rightmostTile.tileXpos + this.universalTileData.effectSpace / 2
            } else {
                this.visualElement.style.overflow = 'hidden'
                this.universalTileData.scrollLeft = 0
                this.universalTileData.scrollTop = 0
            }
        }

        this.svg
            .style('width', totalWidth)
            .style('height', totalHeight)

        let longestTextTiles: Tile[] = this.tiles.sort((a, b)=> b.text.length - a.text.length ).slice(0, 5)
        this.maxBoundedTextHeight = longestTextTiles.map((d)=> d.boundedTextHeight).sort((a, b)=> b - a)[0]

        this.draw()
    }

    public clear() {
        this.container.selectAll('.tileContainer').remove()
    }

    public draw() {
        let tileContainer = this.container.selectAll('.tileContainer')
        .data(this.tiles
            .filter((d)=>d.tileData.isRendered || d.tileData.needsToBeRendered),
            function(d) { return (<Tile>d).i.toString(); }
        )

        tileContainer.exit()
            .remove()
        let tileContainerEnter = tileContainer.enter()
            .append('g')
            .attr("class", "tileContainer")
            .attr("id", (d)=>{return d.text})

        tileContainer = tileContainer.merge(tileContainerEnter)
            
        let tileContainerFiltered = tileContainer
            .filter((d)=>{return (!d.tileData.sameState) || d.tileData.needsToBeRendered})
            .each((d)=>{
                d.tileData.needsToBeRendered = false
                d.tileData.isRendered = true
            })

        console.log(tileContainerFiltered.size())
        
        let tileEnter = tileContainerEnter
            .append('g')
            .attr("class", "tile")
        tileEnter
            .append('path')
            .attr("class", "fill")
        tileEnter
            .append('path')
            .attr("class", "stroke")

        let tile = tileContainerFiltered.select('.tile')
       

        tile.select(".fill")
            .attr("d", function (d) { return d.shapePath })
            .attr("fill", function (d) { return d.bgImgURL ? "url(#image" + d.i + ")" : d.tileFill })
            .style("fill-opacity", function (d) { return d.tileFillOpacity })
            .style("filter", function (d) { return "#filter" + d.i })
        tile.select(".stroke")
            .attr("d", function (d) { return d.shapeStrokePath })
            .style("fill", "none")
            .style("stroke", function (d) { return d.tileStroke })
            .style("stroke-width", function (d) { return d.tileStrokeWidth })


        let contentFOEnter = tileContainerEnter
            .append('foreignObject')
            .attr("class", "contentFO")
        contentFOEnter
            .append("xhtml:div")
            .attr("class", "contentTable")
            .append("xhtml:div")
            .attr("class", "contentTableCell")
            .append("xhtml:div")
            .attr("class", "contentContainer")

        let contentFO = tileContainerFiltered.select('.contentFO')
        contentFO
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



        let coverEnter = tileContainerEnter
            .append('g')
            .attr("class", "cover")

        coverEnter
            .append("path")
            .attr("class", "coverPath")

        let cover = tileContainerFiltered.select('.cover')
        cover.select('.coverPath')
            .attr("d", function (d) { return d.shapePath })
            .style("fill-opacity", 0)
            .on('mouseover', (d, i, n) => {
                d.onTileMouseover(d, i, n)
            })
            .on('mouseout', (d, i, n) => {
                d.onTileMouseout(d, i, n)
            })
            .on('click', (d, i, n) => {
                d.onTileClick(d, i, n)
            })





        let defsEnter = tileContainerEnter
            .append("defs")

        let filterEnter = defsEnter
            .append("filter")
            .attr("id", d => { return "filter" + d.i })
            .attr("class", "filter")

        let filter = tileContainerFiltered.select("filter")

        filter.html("")

        filter.filter(() => { return this.universalTileData.shadow })
            .append("feDropShadow")
            .attr("dx", d => { return d.shadowDirectionCoords.x * d.shadowDistance })
            .attr("dy", d => { return d.shadowDirectionCoords.y * d.shadowDistance })
            .attr("stdDeviation", d => { return d.shadowStrength })
            .attr("flood-color", d => { return d.shadowColor })
            .attr("flood-opacity", d => { return d.shadowTransparency })
            .attr("result", "dropshadow")

        filter.filter(() => { return this.universalTileData.glow })
            .append("feDropShadow")
            .attr("dx", 0)
            .attr("dy", 0)
            .attr("stdDeviation", d => { return d.glowStrength })
            .attr("flood-color", d => { return d.glowColor })
            .attr("flood-opacity", d => { return d.glowTransparency })
            .attr("result", "glow")


        let patternEnter = defsEnter
            .append("pattern")
            .attr("class", "backgroundImage")
            .append("image")
            .attr("class", (d) => { return "img" })
            .attr("id", d => { return "img" + d.i })

        let pattern = tileContainerFiltered.select("pattern")
            .filter((d) => { return d.bgImgURL != "" })
        pattern
            .attr("id", d => { return "image" + d.i })
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 1)
            .attr("height", 1)

        pattern.select('.img')
            .on('load', function (d, i, n) {
                let imgElement: Element = this as any //TODO make types more clear
                let dims = d.getBgImgDims(imgElement.getBoundingClientRect())
                d3.select(this)
                    .attr("width", dims.width)
                    .attr("height", dims.height)
            })
            .attr("xlink:href", d => { return d.bgImgURL })

        let feMerge = filter.append("feMerge")
        feMerge.append("feMergeNode").attr("in", "dropshadow")
        feMerge.append("feMergeNode").attr("in", "glow")


        // defs.append("g")
        //     .attr("id", "handleHorizontal")
        //     .attr("class", "handle")
        //     .append("path")
        //     .attr("d", "M 0 0 l 6 12 l -12 0 z")
        //     .attr("fill", "#FFD700")
        //     .style("stroke", "#252423")
        //     .style("stroke-width", 0.5)
        // defs.append("g")
        //     .attr("id", "handleVertical")
        //     .attr("class", "handle")
        //     .append("path")
        //     .attr("d", "M 0 0 l -12 6 l 0 -12 z")
        //     .attr("fill", "#FFD700")
        //     .style("stroke", "#252423")
        //     .style("stroke-width", 0.5)


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

    public createTile(i: number): Tile {
        return new Tile(this, i, this.tilesData, this.formatSettings)
    }
    public createUniversalTileData(): UniversalTileData {
        return new UniversalTileData(this.tilesData, this.formatSettings)
    }

    onShift() { }
    onShiftUp() { }
}