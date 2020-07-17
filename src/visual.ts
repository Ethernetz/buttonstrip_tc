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
import DataViewPropertyValue = powerbi.DataViewPropertyValue
import VisualObjectInstance = powerbi.VisualObjectInstance
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject


import { VisualSettings } from "./settings";
import VisualObjectInstanceEnumeration = powerbi.VisualObjectInstanceEnumeration;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;

import { valueFormatter } from "powerbi-visuals-utils-formattingutils"

import * as d3 from "d3";
// import { ProcessedVisualSettings } from "./processedvisualsettings";

import { PropertyGroupKeys } from './TilesCollection/interfaces'
import { getPropertyStateNameArr, getObjectsToPersist } from './TilesCollectionUtlities/functions'
import { getCorrectPropertyStateName } from './TilesCollection/functions'
import { SelectionManagerUnbound } from './SelectionManagerUnbound'

type Selection<T extends d3.BaseType> = d3.Selection<T, any, any, any>;

// import * as enums from "./enums"
import { TileSizingType, TileLayoutType, TileShape, IconPlacement, State, PresetStyle } from './TilesCollection/enums'
import { ContentSource } from './enums'

import { select, merge } from "d3";


import { ButtonsCollection, ButtonData } from './ButtonsCollection'
import { ContentFormatType } from "./TilesCollection/enums";

export class Visual implements IVisual {
    private target: HTMLElement;
    public selectionManager: ISelectionManager;
    public selectionManagerUnbound: SelectionManagerUnbound
    private selectionManagerHover: ISelectionManager;
    private selectionIds: any = {};
    public host: IVisualHost;

    public visualSettings: VisualSettings;
    private selectionIdBuilder: ISelectionIdBuilder;

    private svg: Selection<SVGElement>;
    private container: Selection<SVGElement>;
    public hoveredIndex: number

    public shiftFired: boolean = false
    public currentPresetStyle: PresetStyle = PresetStyle.none
    public currentPresetBaseColor: string = ""

    public visualElement: HTMLElement;
    public selectionIdKeys: string[] = []


    constructor(options: VisualConstructorOptions) {
        this.selectionIdBuilder = options.host.createSelectionIdBuilder();
        this.selectionManager = options.host.createSelectionManager();
        this.selectionManagerUnbound = new SelectionManagerUnbound()
        this.host = options.host;
        this.visualElement = options.element

        this.svg = d3.select(options.element)
            .append('svg')
            .classed('buttonstrip', true);

        this.container = this.svg.append("g")
            .classed('container', true);
    }

    public getEnumeratedStateProperties(propertyGroup: any, prefix?: string): { [propertyName: string]: DataViewPropertyValue } {
        let properties: { [propertyName: string]: DataViewPropertyValue } = {}
        let groupedKeyNamesArr: PropertyGroupKeys[] = getPropertyStateNameArr(Object.keys(propertyGroup))
        if (groupedKeyNamesArr.length > 0 && propertyGroup["state"]) {
            let state: State = propertyGroup["state"]
            for (let i = 0; i < groupedKeyNamesArr.length; i++) {
                let groupedKeyNames = groupedKeyNamesArr[i]
                if (prefix && !groupedKeyNames.default.startsWith(prefix))
                    continue
                switch (state) {
                    case State.all:
                        properties[groupedKeyNames.all] = propertyGroup[groupedKeyNames.all]
                        break
                    case State.selected:
                        properties[groupedKeyNames.selected] = propertyGroup[groupedKeyNames.selected]
                        break
                    case State.unselected:
                        properties[groupedKeyNames.unselected] = propertyGroup[groupedKeyNames.unselected]
                        break
                    case State.hovered:
                        properties[groupedKeyNames.hover] = propertyGroup[groupedKeyNames.hover]
                        break
                    case State.disabled:
                        properties[groupedKeyNames.disabled] = propertyGroup[groupedKeyNames.disabled]
                        break
                }
            }
        }

        return properties
    }

    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
        let objectName = options.objectName;
        let objectEnumeration: VisualObjectInstance[] = [];

        let properties: { [propertyName: string]: DataViewPropertyValue } = {}


        const settings: VisualSettings = this.visualSettings || <VisualSettings>VisualSettings.getDefault();
        switch (objectName) {
            case "tile":
                properties.state = settings.tile.state
                properties.hoverStyling = settings.tile.hoverStyling
                properties = {...properties, ...this.getEnumeratedStateProperties(settings.tile) }
                break
            case "text": {
                properties.state = settings.text.state
                properties.hoverStyling = settings.text.hoverStyling
                let iconPlacement = settings.icon[getCorrectPropertyStateName(settings.text.state, 'placement')] as IconPlacement
                let filtered = Object.keys(settings.text)
                    .filter(key => !(settings.icon.icons && iconPlacement != IconPlacement.above && key == "bmarginA"))
                    .reduce((obj, key) => {
                        obj[key] = settings.text[key]
                        return obj;
                    }, {})

                properties = {...properties, ...this.getEnumeratedStateProperties(filtered) }
                break
            }
            case "icon":{
                properties.icons = settings.icon.icons
                let excludeWhenLeft = ["topMarginA", "bottomMarginA"]

                if (settings.icon.icons) {
                    let iconPlacement = settings.icon[getCorrectPropertyStateName(settings.icon.state, 'placement')] as IconPlacement
                    properties.state = settings.icon.state
                    properties.hoverStyling = settings.icon.hoverStyling
                    let filtered = Object.keys(settings.icon)
                        .filter(key => !(iconPlacement && excludeWhenLeft.indexOf(key) > -1))
                        .reduce((obj, key) => {
                            obj[key] = settings.icon[key]
                            return obj;
                        }, {})


                    properties = { ...properties, ...this.getEnumeratedStateProperties(filtered) }
                }
                break}
            case "layout": {
                let excludeWhenNotFixed = ["tileWidth", "tileHeight", "tileAlignment"]

                let filtered = Object.keys(settings.layout)
                    .filter(key => !(key.endsWith("Angle") || key.endsWith("Length"))
                        || key == settings.layout.tileShape + "Angle"
                        || key == settings.layout.tileShape + "Length")
                    .filter(key => !(settings.layout.sizingMethod != TileSizingType.fixed && excludeWhenNotFixed.indexOf(key) > -1))
                    .filter(key => !(settings.layout.tileLayout != TileLayoutType.grid && key == "tilesPerRow"))
                    .reduce((obj, key) => {
                        obj[key] = settings.layout[key]
                        return obj;
                    }, {})

                properties = { ...properties, ...filtered }
                break
            }
            case "effect":
                properties.state = settings.effect.state
                properties.hoverStyling = settings.effect.hoverStyling
                properties.shadow = settings.effect.shadow
                if (settings.effect.shadow)
                    properties = { ...properties, ...this.getEnumeratedStateProperties(settings.effect, "shadow") }
                properties.glow = settings.effect.glow
                if (settings.effect.glow)
                    properties = { ...properties, ...this.getEnumeratedStateProperties(settings.effect, "glow") }
                break
            case "content":
                properties = { ...properties, ...settings.content }
                break
            case "bgimg":
                properties.bgimgs = settings.bgimg.bgimgs
                if (settings.bgimg.bgimgs)
                    properties = { ...properties, ...this.getEnumeratedStateProperties(settings.bgimg) }
                break
            case "presetStyle":
                properties = { ...properties, ...settings.presetStyle }
                break
        }

        objectEnumeration.push({
            objectName: objectName,
            properties: properties,
            selector: null
        })

        return objectEnumeration
    }

    public options: VisualUpdateOptions;

    public update(options: VisualUpdateOptions) {
        console.log("updating")
        if (!(options
            && options.dataViews
            && options.dataViews[0]
            && options.dataViews[0].categorical
            && options.dataViews[0].categorical.categories
        ))
            return
        this.options = options
        this.visualSettings = VisualSettings.parse(options.dataViews[0]) as VisualSettings

        let objects: powerbi.VisualObjectInstancesToPersist = getObjectsToPersist(this.visualSettings,
            this.visualSettings.presetStyle.preset,
            this.visualSettings.presetStyle.preset != this.currentPresetStyle || this.visualSettings.presetStyle.color != this.currentPresetBaseColor)
        this.currentPresetStyle = this.visualSettings.presetStyle.preset
        this.currentPresetBaseColor = this.visualSettings.presetStyle.color
        if (objects.merge.length != 0)
            this.host.persistProperties(objects);




        let buttonsCollection = new ButtonsCollection()

        buttonsCollection.formatSettings.tile = this.visualSettings.tile
        buttonsCollection.formatSettings.text = this.visualSettings.text
        buttonsCollection.formatSettings.icon = this.visualSettings.icon
        buttonsCollection.formatSettings.layout = this.visualSettings.layout
        buttonsCollection.formatSettings.effect = this.visualSettings.effect


        buttonsCollection.svg = this.svg
        buttonsCollection.container = this.container
        buttonsCollection.viewport = {
            height: options.viewport.height,
            width: options.viewport.width,
        }
        buttonsCollection.visual = this
        buttonsCollection.options = options
        buttonsCollection.visualElement = this.visualElement

        buttonsCollection.render(this.createButtonData())
    }

    public createButtonData(): ButtonData[] {

        let buttonData: ButtonData[] = []

        if (this.visualSettings.content.source == ContentSource.databound) {
            
            let dataView = this.options.dataViews[0]
            let allCategories: powerbi.DataViewCategoryColumn[] = dataView.categorical.categories;
            let textCategory = allCategories[0]
            let iconURLCategory = allCategories[1]
            let bgimgURLCategory = allCategories[2]

            let selectionIdKeys: string[] = (this.selectionManager.getSelectionIds() as powerbi.visuals.ISelectionId[]).map(x => x.getKey()) as string[]
            if (selectionIdKeys.indexOf(undefined) == -1)
                this.selectionIdKeys = selectionIdKeys


            for (let i = 0; i < textCategory.values.length; i++) {
                
                let text: string =  textCategory ? textCategory.values[i].toString() : "Unknown";
                let iconURL: string = iconURLCategory ? iconURLCategory.values[i].toString() : "";
                let bgImgURL: string = bgimgURLCategory ? bgimgURLCategory.values[i].toString() : ""; //TODO what happens when BGimg but no icon? 
                let tileSelectionId = this.host.createSelectionIdBuilder()
                    .withCategory(textCategory, i)
                    .createSelectionId();
                buttonData.push({
                    text: text,
                    iconURL: this.visualSettings.icon.icons ? iconURL : "",
                    bgimgURL: this.visualSettings.bgimg.bgimgs ? bgImgURL : "",
                    contentFormatType: this.visualSettings.icon.icons ? ContentFormatType.text_icon : ContentFormatType.text,
                    selectionId: tileSelectionId,
                    isHovered: this.hoveredIndex == i,
                    isSelected: this.selectionIdKeys.indexOf(tileSelectionId.getKey() as string) > -1
                });
            }
        } else {
            for (let i = 0; i < this.visualSettings.content.n; i++) {
                buttonData.push({
                    text: this.visualSettings.content['text' + (i + 1)],
                    iconURL: this.visualSettings.content.icons ? this.visualSettings.content['icon' + (i + 1)] : "",
                    bgimgURL: this.visualSettings.bgimg.bgimgs ? this.visualSettings.bgimg['img' + (i + 1)] : "",
                    contentFormatType: this.visualSettings.icon.icons ? ContentFormatType.text_icon : ContentFormatType.text,
                    isSelected: this.selectionManagerUnbound.getSelectionIndexes().indexOf(i) > -1,
                    isHovered: this.hoveredIndex == i
                });
            }
        }

        return buttonData
    }



    private static parseSettings(dataView: DataView): VisualSettings {
        return <VisualSettings>VisualSettings.parse(dataView);
    }
}