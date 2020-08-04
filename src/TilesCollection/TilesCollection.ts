import { Viewport, BoundingBox } from './interfaces'
import { FormatSettings } from './FormatSettings'
import { TileData } from './TileData'
import { UniversalTileData } from './UniversalTileData'
import { Tile } from './Tile'
import * as d3 from 'd3';
import { ContentFormatType, GradientDirection } from './enums'

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

    public onDataChange(newTilesData: TileData[]){
        let bgimgAspectRatios: { [URL: string]: number} = {};
        for(let i = 0; i < this.tilesData.length; i++)
            if(this.tilesData[i].bgimgURL && this.tilesData[i].bgimgAspectRatio)
                bgimgAspectRatios[(this.tilesData[i].bgimgURL)] = this.tilesData[i].bgimgAspectRatio
        
        this.tilesData = newTilesData

        for(let i = 0; i < this.tilesData.length; i++)
            if(this.tilesData[i].bgimgURL && bgimgAspectRatios[this.tilesData[i].bgimgURL] != null)
                this.tilesData[i].bgimgAspectRatio = bgimgAspectRatios[this.tilesData[i].bgimgURL]

        console.log("data changed")


        this.universalTileData = this.createUniversalTileData()
        this.tiles = this.createTiles(this.tilesData)
        this.setWindow()
        this.setTextBounds()
        this.setMaxIconHeight(()=>{this.clear(); this.draw()})
    }

    public setTextBounds(){
        this.universalTileData.maxBoundedTextHeight = this.getMaxBoundedTextHeight()
    }

    public setMaxIconHeight(callback?: ()=> any): void{
        let asyncI = 0;
        let asyncCount = this.tiles.length;
        let maxIconHeight: number = 0
        let readImageDimensions = ()=>{
            if(asyncI >= asyncCount){
                this.universalTileData.maxIconHeight = maxIconHeight
                callback()
                return
            }
            if(!this.tiles[asyncI].iconURL){
                asyncI++
                readImageDimensions();
                return
            }

            var img = new Image();
            img.onload = (event) => {
                let loadedImg = event.currentTarget as HTMLImageElement
                maxIconHeight = loadedImg ? Math.max((loadedImg.height/loadedImg.width) * this.universalTileData.maxIconWidth, maxIconHeight) : maxIconHeight
                asyncI++;
                readImageDimensions();
            }
            img.src = this.tiles[asyncI].iconURL;
        }
        readImageDimensions();
    }

    public onStateChange(newTilesData: TileData[]): void {
        if (this.tilesData.length > 0)
            for (let i = 0; i < newTilesData.length; i++)
                newTilesData[i].changedState = !this.tilesData[i] || !this.isSameDataState(this.tilesData[i], newTilesData[i])
        else 
            this.onDataChange(newTilesData)

        this.tilesData = newTilesData.map((d, i)=>{return {...this.tilesData[i], ...d}})
        this.tiles = this.createTiles(this.tilesData)

        this.setTextBounds()
        this.draw()
    }

    public onResize(){
        this.clear()
        this.setWindow()
        this.setTextBounds()
        this.draw()
    }

    public onScroll(){
        this.universalTileData.scrollLeft = this.visualElement.scrollLeft
        this.universalTileData.scrollTop = this.visualElement.scrollTop
        this.setNeedsToBeRendered()
        this.draw()
    }

    public setWindow(){
        
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
                if (vertScroll && !horScroll)
                    this.universalTileData.viewport.width -= 20
                if (horScroll && !vertScroll)
                    this.universalTileData.viewport.height -= 20
                

                this.visualElement.style.fontSize = "0px"
                this.visualElement.style.overflow = 'auto';
                this.visualElement.onscroll = () => {this.onScroll();}


                this.universalTileData.scrollLeft = this.visualElement.scrollLeft
                this.universalTileData.scrollTop = this.visualElement.scrollTop

                totalHeight = lastTile.tileYpos + lastTile.tileHeight + this.universalTileData.effectSpace / 2
                totalWidth = rightmostTile.tileWidth + rightmostTile.tileXpos + this.universalTileData.effectSpace / 2
            } else {
                this.visualElement.style.overflow = 'hidden'
                this.universalTileData.scrollLeft = 0
                this.universalTileData.scrollTop = 0
            }
        }
        this.universalTileData.createUniversalShape()
        this.setNeedsToBeRendered()

        this.svg
            .style('width', totalWidth)
            .style('height', totalHeight)
    }

    

    public draw() {
        console.log("drawing")
        console.log(this.tiles[0].shapePath)
        let tileContainer = this.container.selectAll('.tileContainer')
        .data(this.tiles
            .filter((d)=>d.tileData.isRendered || d.tileData.needsToBeRendered),
            function(d) { return (<Tile>d).i.toString() }
        )

        tileContainer.exit()
            .remove()
        let tileContainerEnter = tileContainer.enter()
            .each((d)=>{d.tileData.needsToBeRendered = true; console.log("entering");})
            .append('g')
            .attr("class", "tileContainer")
            .attr("id", (d)=>{return d.text})

        tileContainer = tileContainer.merge(tileContainerEnter)
            
        let tileContainerFiltered = tileContainer
            .filter((d)=>{return d.tileData.changedState || d.tileData.needsToBeRendered})
            .each((d)=>{
                d.tileData.changedState = false
                d.tileData.needsToBeRendered = false
                d.tileData.isRendered = true
            })

        console.log("changing", tileContainerFiltered.size())
        
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
            .attr("fill", function (d) { return d.bgImgURL ? "url(#image" + d.i + ")" : d.tileHasGradient ? "url(#gradient" + d.i + ")" :  d.tileFill })
            .style("fill-opacity", function (d) { return d.tileFillOpacity })
            .attr("filter", function (d) { return "url(#filter" + d.i + ")"})
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
            .style("vertical-align", function (d) { return d.contentVerticalAlignment })
            .html("")
            .style("text-align", function (d) { return d.contentHorizontalAlignment })
            .append(function (d) { return d.contentContainer })

        contentFO.select('.textContainer')
            .style("opacity", function (d) { return d.textOpacity })
            .style("font-size", function (d) { return d.fontSize + "pt" })
            .style("font-family", function (d) { return d.fontFamily })
            .style("color", function (d) { return d.textColor })
            .style("background", function(d) {return d.textBackgroundOpacity > 0 ? d.textBackground : "rgba(0,0,0,0)"})
            // .style("text-align", function (d) { return d.contentHorizontalAlignment })

        contentFO.select('.text2Container')
            .style("opacity", function (d) { return d.text2Opacity })
            .style("font-size", function (d) { return d.font2Size + "pt" })
            .style("font-family", function (d) { return d.font2Family })
            .style("color", function (d) { return d.text2Color })
            // .style("text-align", function (d) { return d.text2Align })



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

        let dropshadowEnter = filterEnter.filter(() => this.universalTileData.shadow)
            .append("feDropShadow")
            .attr("class", "dropshadow")

        let glowEnter = filterEnter.filter(() => this.universalTileData.glow)
            .append("feDropShadow")
            .attr("class", "glow")


        let feMerge = filterEnter.append("feMerge")
            feMerge.append("feMergeNode").attr("in", "dropshadow")
            feMerge.append("feMergeNode").attr("in", "glow")


        let filter = tileContainerFiltered.select("filter")

        let dropshadow = filter.select(".dropshadow")
        dropshadow
            .attr("dx", d => { return d.shadowDirectionCoords.x * d.shadowDistance })
            .attr("dy", d => { return d.shadowDirectionCoords.y * d.shadowDistance })
            .attr("stdDeviation", d => { return d.shadowStrength })
            .attr("flood-color", d => { return d.shadowColor })
            .attr("flood-opacity", d => { return d.shadowTransparency })
            .attr("result", "dropshadow")

        let glow = filter.select(".glow")
        glow
            .attr("dx", 0)
            .attr("dy", 0)
            .attr("stdDeviation", d => { return d.glowStrength })
            .attr("flood-color", d => {  return d.glowColor })
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
            .filter((d)=>{return d.tileData.bgimgAspectRatio != null})
            .attr("xlink:href", d => { return d.bgImgURL })
            .attr("width", (d)=>d.getBgImgDims(d.tileData.bgimgAspectRatio).width)
            .attr("height", (d)=>d.getBgImgDims(d.tileData.bgimgAspectRatio).height)

        pattern.select('.img')
            .filter((d)=>{return !d.tileData.bgimgAspectRatio})
            .on('load', function (d, i, n) {
                let imgElement: Element = this as any //TODO make types more clear
                let aspectRatio = imgElement.getBoundingClientRect().width/imgElement.getBoundingClientRect().height
                let dims = d.getBgImgDims(aspectRatio)
                d.tileData.bgimgAspectRatio = aspectRatio
                d3.select(this)
                    .attr("width", dims.width)
                    .attr("height", dims.height)
            })
            .attr("xlink:href", d => { return d.bgImgURL })


        let linearGradientEnter = defsEnter
            .filter((d)=>d.tileHasGradient)
            .filter((d)=>d.gradientDirection != GradientDirection.radial)
            .append("linearGradient")
            .attr("id", d => { return "gradient" + d.i })
            .attr("class", "gradient")

        let radialGradientEnter = defsEnter
            .filter((d)=>d.tileHasGradient)
            .filter((d)=>d.gradientDirection == GradientDirection.radial)
            .append("radialGradient")
            .attr("id", d => { return "gradient" + d.i })
            .attr("class", "gradient")


        let gradientEnter = defsEnter
            .select(".gradient")
            
        let gradientStop1Enter = gradientEnter
            .append("stop")
            .attr("class", "stop1")
            .attr("offset", "0%")
        
        let gradientStop2Enter = gradientEnter
            .append("stop")
            .attr("class", "stop2")
            .attr("offset", "100%")

        let linearGradient = tileContainerFiltered.select("linearGradient")
            .attr("x1", (d)=>d.gradientCoordinates.x1)
            .attr("x2", (d)=>d.gradientCoordinates.x2)
            .attr("y1", (d)=>d.gradientCoordinates.y1)
            .attr("y2", (d)=>d.gradientCoordinates.y2)



        let gradient = tileContainerFiltered.select(".gradient")
        let gradientStop1 = gradient
            .select(".stop1")
            .attr("stop-color", (d)=>d.reversGradientColors ? d.gradientColor : d.tileFill)
            
        let gradientStop2 = gradient
            .select(".stop2")
            .attr("stop-color", (d)=>d.reversGradientColors ? d.tileFill : d.gradientColor)
            


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
        return new UniversalTileData(this.tilesData, this.formatSettings, this)
    }
    public createTiles(tilesData: TileData[]): Tile[] {
        let tiles: Tile[] = []
        for (let i = 0; i < tilesData.length; i++)
            tiles.push(this.createTile(i))
        return tiles
    }

    public setNeedsToBeRendered(){
        for (let i = 0; i < this.tiles.length; i++){
            this.tilesData[i].needsToBeRendered = !this.tilesData[i].isRendered && this.tiles[i].inViewWindow
        }
    }

    public getMaxBoundedTextHeight(): number {
        let mutableTiles = [...this.tiles]
        let longestTextTiles: Tile[] = mutableTiles.slice().sort((a, b)=> b.text.length - a.text.length ).slice(0, 5)
        return longestTextTiles.map((d)=> d.maxIndividualBoundedTextHeight).sort((a, b)=> b - a)[0]
    }
    

    public isSameDataState(tdold: TileData, tdnew: TileData): boolean {
        // return JSON.stringify(tdold) === JSON.stringify(tdnew) //TODO is this better?
        return (tdold.isDisabled == tdnew.isDisabled)
            && (tdold.isSelected == tdnew.isSelected)
            && (tdold.isHovered == tdnew.isHovered)
    }


    public clear() {
        this.container.selectAll('.tileContainer').remove()
    }

    onShift() { }
    onShiftUp() { }
}