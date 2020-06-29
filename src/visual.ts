/*
*  Power BI Visual CLI
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
"use strict";

import "core-js/stable";
import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import ISelectionManager = powerbi.extensibility.ISelectionManager;
import ISelectionIdBuilder = powerbi.extensibility.ISelectionIdBuilder;
import DataView = powerbi.DataView;
import VisualObjectInstancesToPersist = powerbi.VisualObjectInstancesToPersist
import VisualObjectInstance = powerbi.VisualObjectInstance
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject


import { VisualSettings } from "./settings";
import VisualObjectInstanceEnumeration = powerbi.VisualObjectInstanceEnumeration;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;

import { valueFormatter } from "powerbi-visuals-utils-formattingutils"

import * as d3 from "d3";
// import { ProcessedVisualSettings } from "./processedvisualsettings";

import { propertyStateName} from './interfaces'
import { getPropertyStateNameArr, getObjectsToPersist, getCorrectPropertyStateName } from './functions'
import { SelectionManagerUnbound } from './SelectionManagerUnbound'

type Selection<T extends d3.BaseType> = d3.Selection<T, any, any, any>;

// import * as enums from "./enums"
import {TileSizingType, TileLayoutType, TileShape, IconPlacement, State} from './TilesCollection/enums'
import {ContentSource} from './enums'

import { select, merge } from "d3";


import {GenericsCollection} from './GenericsCollection'
import { ContentFormatType } from "./TilesCollection/enums";

export class Visual implements IVisual {
    private target: HTMLElement;
    public selectionManager: ISelectionManager;
    public selectionManagerUnbound: SelectionManagerUnbound
    private selectionManagerHover: ISelectionManager;
    private selectionIds: any = {};
    public host: IVisualHost;

    private visualSettings: VisualSettings;
    private selectionIdBuilder: ISelectionIdBuilder;

    private svg: Selection<SVGElement>;
    private container: Selection<SVGElement>;
    public hoveredIndex: number

    public shiftFired: boolean = false


    constructor(options: VisualConstructorOptions) {
        this.selectionIdBuilder = options.host.createSelectionIdBuilder();
        this.selectionManager = options.host.createSelectionManager();
        this.selectionManagerUnbound = new SelectionManagerUnbound()
        this.selectionManagerHover = options.host.createSelectionManager();
        this.host = options.host;
        this.svg = d3.select(options.element)
            .append('svg')
            .classed('navigator', true);

        // let defs = this.svg.append("defs");
        this.container = this.svg.append("g")
            .classed('container', true);
    }

    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
        const settings: VisualSettings = this.visualSettings || <VisualSettings>VisualSettings.getDefault();
        let settingsKeys = Object.keys(settings)
        for (let i = 0; i < settingsKeys.length; i++) {
            let settingKey: string = settingsKeys[i]
            let groupedKeyNamesArr: propertyStateName[] = getPropertyStateNameArr(Object.keys(settings[settingKey]))
            for (let j = 0; j < groupedKeyNamesArr.length; j++) {
                let groupedKeyNames: propertyStateName = groupedKeyNamesArr[j]
                switch (settings[settingKey].state) {
                    case State.all:
                        delete settings[settingKey][groupedKeyNames.selected]
                        delete settings[settingKey][groupedKeyNames.unselected]
                        delete settings[settingKey][groupedKeyNames.hover]
                        break
                    case State.selected:
                        delete settings[settingKey][groupedKeyNames.all]
                        delete settings[settingKey][groupedKeyNames.unselected]
                        delete settings[settingKey][groupedKeyNames.hover]
                        break
                    case State.unselected:
                        delete settings[settingKey][groupedKeyNames.all]
                        delete settings[settingKey][groupedKeyNames.selected]
                        delete settings[settingKey][groupedKeyNames.hover]
                        break
                    case State.hovered:
                        delete settings[settingKey][groupedKeyNames.all]
                        delete settings[settingKey][groupedKeyNames.selected]
                        delete settings[settingKey][groupedKeyNames.unselected]
                        break
                }
            }
        }
        let iconSettingsKeys: string[] = Object.keys(settings.icon)
        if (!settings.icon.icons)
            for (let i = 0; i < iconSettingsKeys.length; i++)
                if (iconSettingsKeys[i] != 'icons')
                    delete settings.icon[iconSettingsKeys[i]]
        let effectSettingsKeys: string[] = Object.keys(settings.effects)
        if (!settings.effects.shadow)
            for (let i = 0; i < effectSettingsKeys.length; i++)
                if (effectSettingsKeys[i].startsWith("shadow") && effectSettingsKeys[i] != "shadow")
                    delete settings.effects[effectSettingsKeys[i]]
        if (!settings.effects.glow)
            for (let i = 0; i < effectSettingsKeys.length; i++)
                if (effectSettingsKeys[i].startsWith("glow") && effectSettingsKeys[i] != "glow")
                    delete settings.effects[effectSettingsKeys[i]]

        switch (settings.content.source) {
            case ContentSource.databound:
                delete settings.content.n
                for (let i = 1; i < 11; i++) {
                    delete settings.content['text' + i]
                    delete settings.content['icon' + i]
                    delete settings.bgimg['img' + i]
                }
                
            case ContentSource.fixed:
                for (let i = 10; i > settings.content.n; i--) {
                    delete settings.content['text' + i]
                    delete settings.content['icon' + i]
                    delete settings.bgimg['img' + i]
                }
                if (!this.visualSettings.content.icons)
                    for (let i = 1; i < 11; i++)
                        delete settings.content['icon' + i]
                if (!this.visualSettings.bgimg.bgimgs)
                    for (let i = 1; i < 11; i++)
                        delete settings.bgimg['img' + i]
                break
        }
        let iconPlacement = settings.icon[getCorrectPropertyStateName(settings.icon.state, 'placement')] as IconPlacement
        if (iconPlacement == IconPlacement.left) {
            delete settings.icon[getCorrectPropertyStateName(settings.icon.state, "topMargin")]
            delete settings.icon[getCorrectPropertyStateName(settings.icon.state, "bottomMargin")]
        }
        if(!(settings.content.source != ContentSource.measures && settings.icon.icons && iconPlacement == IconPlacement.above))
            delete settings.text[getCorrectPropertyStateName(settings.text.state, "bmargin")]

        if (settings.layout.sizingMethod != TileSizingType.fixed) {
            delete settings.layout.tileWidth;
            delete settings.layout.tileHeight;
            delete settings.layout.tileAlignment;
        }
        if (settings.layout.tileLayout != TileLayoutType.grid) {
            delete settings.layout.rowLength
        }

        if (settings.layout.tileShape != TileShape.parallelogram) {
            delete settings.layout.parallelogramAngle
        }
        if (settings.layout.tileShape != TileShape.chevron) {
            delete settings.layout.chevronAngle
        }
        if (settings.layout.tileShape != TileShape.pentagon) {
            delete settings.layout.pentagonAngle
        }
        if (settings.layout.tileShape != TileShape.hexagon) {
            delete settings.layout.hexagonAngle
        }
        if (settings.layout.tileShape != TileShape.tab_cutCorners) {
            delete settings.layout.tab_cutCornersLength
        }
        if (settings.layout.tileShape != TileShape.tab_cutCorner) {
            delete settings.layout.tab_cutCornerLength
        }

        return VisualSettings.enumerateObjectInstances(settings, options);
    }

    public update(options: VisualUpdateOptions) {
        if (!(options && options.dataViews && options.dataViews[0]))
            return
        this.visualSettings = VisualSettings.parse(options.dataViews[0]) as VisualSettings

        
        let objects: powerbi.VisualObjectInstancesToPersist = getObjectsToPersist(this.visualSettings)
        if (objects.merge.length != 0)
            this.host.persistProperties(objects);
        

        this.svg
            .style('width', options.viewport.width)
            .style('height', options.viewport.height)


        let genericsCollection = new GenericsCollection()

        genericsCollection.formatSettings.tile = this.visualSettings.tile
        genericsCollection.formatSettings.text = this.visualSettings.text
        genericsCollection.formatSettings.icon = this.visualSettings.icon
        genericsCollection.formatSettings.layout = this.visualSettings.layout
        genericsCollection.formatSettings.effect = this.visualSettings.effects


        genericsCollection.container = this.container
        genericsCollection.viewport = {
            height: options.viewport.height,
            width:options.viewport.width,
        }
        genericsCollection.visual = this
        genericsCollection.options = options
        let dataView = options.dataViews[0]
        let categories: powerbi.DataViewCategoryColumn[] = dataView.categorical.categories;
        let selectionIdKeys: string[] = (this.selectionManager.getSelectionIds() as powerbi.visuals.ISelectionId[]).map(x => x.getKey()) as string[]
        
        
        // //DATA BOUND
        // for (let i = 0; i < categories[0].values.length; i++) {
        //     let pageValue: string = categories[0].values[i].toString();
        //     let iconURL: string =  categories[1] ? categories[1].values[i].toString() : null;
        //     let tileSelectionId = this.host.createSelectionIdBuilder()
        //                 .withCategory(categories[0], i)
        //                 .createSelectionId();
        //     genericsCollection.tilesData.push({
        //         text: pageValue,
        //         iconURL: iconURL, 
        //         contentFormatType: ContentFormatType.text,
        //         selectionId: tileSelectionId,
        //         get isSelected(): boolean{
        //             return this.selectionId &&
        //             selectionIdKeys &&
        //             selectionIdKeys.indexOf(this.selectionId.getKey() as string) > -1
        //         },
        //         isHovered: this.hoveredIndex == i
        //     });

        // }

        //FIXED TEXT
        for (let i = 0; i < this.visualSettings.content.n; i++) {
            genericsCollection.tilesData.push({
                text: this.visualSettings.content['text' + (i + 1)],
                iconURL: this.visualSettings.content.icons ? this.visualSettings.content['icon' + (i + 1)] : "", 
                bgimgURL: this.visualSettings.bgimg['img' + (i+1)],
                contentFormatType: ContentFormatType.text,
                isSelected: this.selectionManagerUnbound.getSelectionIndexes().indexOf(i) > -1,
                isHovered: this.hoveredIndex == i
            });

        }
        
        

        genericsCollection.render()
        
        // let objects: powerbi.VisualObjectInstancesToPersist = getObjectsToPersist(this.visualSettings)
        // if (objects.merge.length != 0)
        //     this.host.persistProperties(objects);
        /*switch (this.visualSettings.content.source) {
            case Content_Source.databound:
                for (let categoryIndex = 0; categoryIndex < categories[0].values.length; categoryIndex++) {
                    let pageValue: powerbi.PrimitiveValue = categories[0].values[categoryIndex];
                    let iconValue: powerbi.PrimitiveValue = categories[1] ? categories[1].values[categoryIndex] : null;
                    let categorySelectionId = this.host.createSelectionIdBuilder()
                        .withCategory(categories[0], categoryIndex)
                        .createSelectionId();
                    (<DatapointDatabound[]>this.datapoints).push({
                        value: pageValue,
                        iconValue: iconValue,
                        selectionId: categorySelectionId,
                    });
                }
                break
            case Content_Source.fixed:
                for (let i = 0; i < this.visualSettings.content.n; i++) {
                    (<DatapointFixed[]>this.datapoints).push({
                        value: this.visualSettings.content['text' + (i + 1)],
                        iconValue: this.visualSettings.content.icons ? this.visualSettings.content['icon' + (i + 1)] : "",
                    });
                }
                break
            case Content_Source.measures:
                let dps: DatapointMeasures[][] = [[]]
                for (let i = 0; i < measures.length; i++) {
                    let iValueFormatter = valueFormatter.create({ format: measures[i].source.format });
                    for(let j = 0; j < measures[i].values.length; j++){                        
                        if(categories){
                            let categorySelectionId = this.host.createSelectionIdBuilder()
                                .withCategory(categories[0], j)
                                .createSelectionId();
                            if(i == 0){
                                (<DatapointDatabound[]>this.datapoints)[j*(measures.length+1) + i] = {
                                    value: categories[0].values[j],
                                    iconValue: "",
                                    selectionId: categorySelectionId,
                                }
                            }

                            (<DatapointMeasures[]>this.datapoints)[j*(measures.length + 1) + i + 1] = {
                                value: measures[i].source.displayName,
                                measureValue:  iValueFormatter.format(measures[i].values[j])
                            }
                        } else {
                            (<DatapointMeasures[]>this.datapoints)[j*measures.length + i] = {
                                value: measures[i].source.displayName,
                                measureValue:  iValueFormatter.format(measures[i].values[j])
                            }
                        }
                    }                   
                }
                if(categories){
                    this.visualSettings.layout.buttonLayout = Tile_Layout.grid
                    this.visualSettings.layout.rowLength = measures.length + 1
                }
                break
        }

        let stateIds: stateIds = {
            hoveredIdKey: this.hoveredIdKey,
            selectionManagerUnbound: this.selectionManagerUnbound,
            hoveredIndexUnbound: this.hoveredIndexUnbound
        }

        let defs = this.svg.select("defs")
        defs.html("")
        defs.call(addHandles)
        let data: ProcessedVisualSettings[] = [];
        for (let i = 0; i < this.datapoints.length; i++) {
            data.push(new ProcessedVisualSettings(i, this.datapoints, this.visualSettings, this.selectionManager, stateIds, options))
            addFilters(defs, data[i])
        }


        this.container.selectAll(".frameContainer, .titleForeignObject, .cover").filter((d, i, nodes: Element[]) => {
            return !nodes[i].classList.contains(this.visualSettings.layout.buttonShape)
        }).remove()

        let framesContainer = this.container.selectAll('.frameContainer').data(data)
        framesContainer.exit().remove()
        framesContainer.enter().call(constructFrameFamily)
        framesContainer = this.container.selectAll('.frameContainer').data(data)
        framesContainer.select(".fill")
            .call(styleFrameFill)
        framesContainer.select(".stroke")
            .call(styleFrameStroke)

        let titleFOs = this.container.selectAll('.titleForeignObject').data(data)
        titleFOs.exit().remove()
        titleFOs.enter()
            .append('foreignObject')
            .attr("class", function (d) { return "titleForeignObject " + d.buttonShape })
            .call(constructTitleFamily)
        titleFOs = this.container.selectAll('.titleForeignObject').data(data)
            .call(styleTitleFO)
        titleFOs.select('.titleTable')
            .call(styleTitleTable)
        titleFOs.select(".titleTableCell")
            .call(styleTitleTableCell)
            .append(function (d) { return d.titleContent })
            .call(styleText)

        let covers = this.container.selectAll('.cover').data(data)
        covers.exit().remove()
        covers.enter().append('g')
            .attr("class", "cover " + this.visualSettings.layout.buttonShape)
            .append("path")
        covers = this.container.selectAll('.cover').data(data)
        covers.select("path")
            .attr("d", function (d) { return d.shapePath })
            .style("fill-opacity", function (d) { return 0 })
            .on('mouseover', (d, i) => {
                if (this.shiftFired)
                    return
                covers.select(".handle").remove()
                switch (this.visualSettings.content.source) {
                    case Content_Source.databound:
                        this.hoveredIdKey = d.selectionId.getKey()
                        break
                    case Content_Source.fixed:
                        this.hoveredIndexUnbound = i
                        break
                }
                this.update(options)
            })
            .on('mouseout', (d, i) => {
                if (this.shiftFired)
                    return
                covers.select(".handle").remove()
                switch (this.visualSettings.content.source) {
                    case Content_Source.databound:
                        this.hoveredIdKey = null
                        break
                    case Content_Source.fixed:
                        this.hoveredIndexUnbound = null
                        break
                }
                this.update(options)
            })
            .on('click', (d, i) => {
                if (this.shiftFired)
                    return
                switch (this.visualSettings.content.source) {
                    case Content_Source.databound:
                        this.selectionManager.select(d.selectionId, this.visualSettings.content.multiselect)
                        break
                    case Content_Source.fixed:
                        this.selectionManagerUnbound.select(i, this.visualSettings.content.multiselect)
                        break
                }
                this.update(options)
            })
        d3.select("body")
            .on("keydown", () => {
                if (d3.event.shiftKey && !this.shiftFired) {
                    if (ProcessedVisualSettings.textareaFocusedIndex != null)
                        return
                    this.shiftFired = true

                    let firstCover = covers.filter((d, i) => { return i == 0 })
                    let firstCoverData = firstCover.data()[0] as ProcessedVisualSettings
                    firstCover.data(firstCoverData.handles)
                        .append('use')
                        .attr("class", "handle")
                        .attr("href", (d) => {
                            return d.axis == "x" ?
                                "#handleHorizontal" :
                                "#handleVertical"
                        })
                        .attr("x", function (d) { return d.xPos })
                        .attr("y", function (d) { return d.yPos })
                        .call(dragHandle);


                    if (this.visualSettings.content.source != Content_Source.fixed)
                        return
                    covers.append('foreignObject')
                        .attr("class", function (d) { return "coverTitle " + d.buttonShape })
                        .call(constructTitleFamily)
                    let coverTitle = this.container.selectAll('.coverTitle').data(data)
                        .call(styleTitleFO)
                    coverTitle.select('.titleTable')
                        .call(styleTitleTable)
                    coverTitle.select(".titleTableCell")
                        .call(styleTitleTableCell)
                        .append(function (d) { return d.titleContent })
                        .select(".textContainer")
                        .call(sizeTextContainer)
                        .call(styleText)
                        .call(makeTextTransparent)

                    coverTitle.select(".textContainer")
                        .on("mouseenter", (d, i, n) => {
                            if (ProcessedVisualSettings.textareaFocusedIndex != null)
                                return

                            d3.select(n[i]).selectAll(".text")
                                .style("display", "none")
                            titleFOs
                                .filter((d) => { return d.i == i })
                                .selectAll(".text")
                                .style("opacity", "0")
                            d3.select(n[i])
                                .append("textarea")
                                .call(styleTextArea)
                                .on("focus", () => {
                                    ProcessedVisualSettings.textareaFocusedIndex = i
                                    coverTitle.filter((d) => { return !d.textareaIsFocused }).remove()
                                })
                                .on("focusout", () => {
                                    ProcessedVisualSettings.textareaFocusedIndex = null
                                    this.shiftFired = false
                                    covers.select(".coverTitle")
                                        .remove()
                                    this.update(options)
                                })
                                .on("input", (d, i, n) => {
                                    coverTitle.data(data)
                                        .filter((d) => { return d.textareaIsFocused })
                                        .each((d) => { d.text = n[i].value })
                                        .call(resizeCoverTitleElements)
                                    let object: powerbi.VisualObjectInstance = {
                                        objectName: 'content',
                                        selector: undefined,
                                        properties:
                                            {}
                                    }
                                    object.properties["text" + (ProcessedVisualSettings.textareaFocusedIndex + 1)] = n[i].value
                                    this.host.persistProperties({ merge: [object] })
                                })
                        })
                        .on("mouseleave", (d, i, n) => {
                            if (ProcessedVisualSettings.textareaFocusedIndex != null)
                                return
                            titleFOs
                                .filter((d) => { return d.i == i })
                                .selectAll(".text")
                                .style("opacity", d.textFillOpacity)
                            d3.select(n[i]).selectAll(".text")
                                .style("display", "inline")
                            d3.select(n[i]).select("textarea").remove()
                        })
                }
            })
            .on("keyup", () => {
                if (d3.event.keyCode == 16) {
                    covers.select(".handle").remove()
                    if (ProcessedVisualSettings.textareaFocusedIndex == null)
                        covers.select(".coverTitle").remove()
                    this.shiftFired = false
                    this.update(options)
                }
            })

        let dragHandle = d3.drag()
            .on("start", (d: Handle) => {
                d.handleFocused = true
            })
            .on("drag", (d: Handle, i, n) => {
                d.z = d3.event[d.axis]
                select(n[i])
                    .attr(d.axis, d3.event[d.axis])
                this.update(options)
            })
            .on("end", (d: Handle) => {
                let object: powerbi.VisualObjectInstance = {
                    objectName: 'layout',
                    selector: undefined,
                    properties:
                        {}
                }
                object.properties[d.propName] = d.disp
                d.handleFocused = false
                this.host.persistProperties({ merge: [object] })
            })*/
        }
    


    private static parseSettings(dataView: DataView): VisualSettings {
        return <VisualSettings>VisualSettings.parse(dataView);
    }
}