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
import {ContentSource} from './enums'
import { PresetStyle } from "./TilesCollection/enums";

export class TileSettings extends TileCollectionFormatSettings.TileSettings{
}

export class TextSettings extends TileCollectionFormatSettings.TextSettings{
}

export class IconSettings extends TileCollectionFormatSettings.IconSettings{
}

export class LayoutSettings extends TileCollectionFormatSettings.LayoutSettings{
}

export class ContentAlignmentSettings extends TileCollectionFormatSettings.ContentAlignmentSettings{
}

export class EffectSettings extends TileCollectionFormatSettings.EffectSettings{
}

export class ContentSettings{
  public multiselect: boolean = false
  public source: ContentSource = ContentSource.fixed

  public n: number = 5
  public icons: boolean = false
  public text1: string = "Button 1"
  public icon1: string = ""
  public text2: string = "Button 2"
  public icon2: string = ""
  public text3: string = "Button 3"
  public icon3: string = ""
  public text4: string = "Button 4"
  public icon4: string = ""
  public text5: string = "Button 5"
  public icon5: string = ""
  public text6: string = "Button 6"
  public icon6: string = ""
  public text7: string = "Button 7"
  public icon7: string = ""
  public text8: string = "Button 8"
  public icon8: string = ""
  public text9: string = "Button 9"
  public icon9: string = ""
  public text10: string = "Button 10"
  public icon10: string = ""
}

export class BgImgSettings{
  public show: boolean = false
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

export class PresetStyleSettings{
  public color: string = "#41A4FF"
  public preset: PresetStyle = PresetStyle.none
}



export class VisualSettings extends DataViewObjectsParser {
  public tile: TileSettings = new TileSettings();
  public text: TextSettings = new TextSettings();
  public icon: IconSettings = new IconSettings();
  public layout: LayoutSettings = new LayoutSettings();
  public contentAlignment: ContentAlignmentSettings = new ContentAlignmentSettings();
  public effect: EffectSettings = new EffectSettings();
  public content: ContentSettings = new ContentSettings();
  public bgimg: BgImgSettings = new BgImgSettings();
  public presetStyle: PresetStyleSettings = new PresetStyleSettings()
}