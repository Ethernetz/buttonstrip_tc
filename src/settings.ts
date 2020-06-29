/*
 *  Power BI Visualizations
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

import { dataViewObjectsParser } from "powerbi-visuals-utils-dataviewutils";
import DataViewObjectsParser = dataViewObjectsParser.DataViewObjectsParser;
import * as TileCollectionFormatSettings from "./TilesCollection/FormatSettings"
import {AlignmentType, TileSizingType, TileLayoutType, TileShape, Direction, IconPlacement, State} from './TilesCollection/enums'
import {ContentSource} from './enums'

export class TileSettings extends TileCollectionFormatSettings.TileSettings{
}

export class TextSettings extends TileCollectionFormatSettings.TextSettings{
}

export class IconSettings extends TileCollectionFormatSettings.IconSettings{
}

export class LayoutSettings extends TileCollectionFormatSettings.LayoutSettings{
}

export class EffectSettings extends TileCollectionFormatSettings.EffectSettings{
}

export class ContentSettings{
  public multiselect: boolean = false
  public source: ContentSource = ContentSource.databound

  public n: number = 5
  public icons: boolean = false
  public text1: string = "Text"
  public icon1: string = ""
  public text2: string = "Text"
  public icon2: string = ""
  public text3: string = "Text"
  public icon3: string = ""
  public text4: string = "Text"
  public icon4: string = ""
  public text5: string = "Text"
  public icon5: string = ""
  public text6: string = "Text"
  public icon6: string = ""
  public text7: string = "Text"
  public icon7: string = ""
  public text8: string = "Text"
  public icon8: string = ""
  public text9: string = "Text"
  public icon9: string = ""
  public text10: string = "Text"
  public icon10: string = ""
}

export class BgImgSettings{
  public bgimgs: boolean = false
  public img1: string = ""
  public img2: string = ""
  public img3: string = ""
  public img4: string = ""
  public img5: string = ""
  public img6: string = ""
  public img7: string = ""
  public img8: string = ""
  public img9: string = ""
  public img10: string = ""
}

export class MeasuresSettings{
  public state : State = State.all;
  public hover: boolean = false

  public colorA: string = "";
  public colorS: string = "#252423";
  public colorU: string = "#252423";
  public colorH: string = "#252423";

  public alignmentA: AlignmentType = AlignmentType.center;
  public alignmentS: AlignmentType = AlignmentType.center;
  public alignmentU: AlignmentType = AlignmentType.center;
  public alignmentH: AlignmentType = AlignmentType.center;

  public fontSizeA: number = null;
  public fontSizeS: number = 45;
  public fontSizeU: number = 45;
  public fontSizeH: number = 45;

  public fontFamilyA: string = "";
  public fontFamilyS: string = "wf_standard-font, helvetica, arial, sans-serif";
  public fontFamilyU: string = "wf_standard-font, helvetica, arial, sans-serif";
  public fontFamilyH: string = "wf_standard-font, helvetica, arial, sans-serif";
  
  public vmarginA: number = null;
  public vmarginS: number = 0;
  public vmarginU: number = 0;
  public vmarginH: number = 0;
  
  public transparencyA: number = null;
  public transparencyS: number = 0;
  public transparencyU: number = 0;
  public transparencyH: number = 0;
}

export class VisualSettings extends DataViewObjectsParser {
  public tile: TileSettings = new TileSettings();
  public text: TextSettings = new TextSettings();
  public icon: IconSettings = new IconSettings();
  public layout: LayoutSettings = new LayoutSettings();
  public effects: EffectSettings = new EffectSettings();
  public content: ContentSettings = new ContentSettings();
  public bgimg: BgImgSettings = new BgImgSettings();
  public measures: MeasuresSettings = new MeasuresSettings();
}