import {Viewport} from './interfaces'
import {AlignmentType, TileSizingType, TileLayoutType, TileShape, Direction, IconPlacement, State} from './enums'

export class FormatSettings{
  public tile: TileSettings = new TileSettings();
  public text: TextSettings = new TextSettings();
  public layout: LayoutSettings = new LayoutSettings();
  public effect: EffectSettings = new EffectSettings();
  public icon: IconSettings = new IconSettings();
  viewport: Viewport
}

export class TileSettings {
    public state: State = State.all
    public hoverStyling: boolean = false

    public colorA: string = "";
    public colorS: string = "#262222";
    public colorU: string = "#262222";
    public colorH: string = "#262222";
  
    public strokeA: string = "";
    public strokeS: string = "#000";
    public strokeU: string = "#000";
    public strokeH: string = "#000"
  
    public strokeWidthA: number = null;
    public strokeWidthS: number = 0;
    public strokeWidthU: number = 0;
    public strokeWidthH: number = 0;
  
    public transparencyA: number = null;
    public transparencyS: number = 0;
    public transparencyU: number = 0;
    public transparencyH: number = 0;
  }

  export class TextSettings{
    public state: State = State.all
    public hoverStyling: boolean = false

    public colorA: string = "";
    public colorS: string = "#fff";
    public colorU: string = "#fff";
    public colorH: string = "#fff";
  
    public alignmentA: AlignmentType = AlignmentType.center;
    public alignmentS: AlignmentType = AlignmentType.center;
    public alignmentU: AlignmentType = AlignmentType.center;
    public alignmentH: AlignmentType = AlignmentType.center;
  
    public fontSizeA: number = null;
    public fontSizeS: number = 14;
    public fontSizeU: number = 14;
    public fontSizeH: number = 14;
  
    public fontFamilyA: string = "";
    public fontFamilyS: string = "wf_standard-font, helvetica, arial, sans-serif";
    public fontFamilyU: string = "wf_standard-font, helvetica, arial, sans-serif";
    public fontFamilyH: string = "wf_standard-font, helvetica, arial, sans-serif";
  
    public hmarginA: number = null;
    public hmarginS: number = 0;
    public hmarginU: number = 0;
    public hmarginH: number = 0;
  
    public bmarginA: number = null;
    public bmarginS: number = 0;
    public bmarginU: number = 0;
    public bmarginH: number = 0;
    
    public transparencyA: number = null;
    public transparencyS: number = 0;
    public transparencyU: number = 0;
    public transparencyH: number = 0;
   
  }

  export class LayoutSettings{
    public tileShape: TileShape = TileShape.rectangle
    
    public parallelogramAngle: number = 80
    public chevronAngle: number = 60
    public pentagonAngle: number = 60
    public hexagonAngle: number = 60
    public tab_cutCornersLength: number = 20
    public tab_cutCornerLength: number = 20
  
    public sizingMethod: TileSizingType = TileSizingType.uniform;
    public tileWidth: number = 150;
    public tileHeight: number = 75;
    public tileAlignment: AlignmentType = AlignmentType.left
    public tileLayout: TileLayoutType = TileLayoutType.horizontal;
    public rowLength: number = 2;
    public padding: number = 10;
  }

  export class EffectSettings{
    public state: State = State.all
    public shapeRoundedCornerRadius: number = 0 
    public hoverStyling: boolean = false
  

    public shadow: boolean = false;
  
    public shadowColorA: string = ""
    public shadowColorS: string = "#000"
    public shadowColorU: string = "#000"
    // public shadowColorH: string = "#000"
    
    public shadowTransparencyA: number = null
    public shadowTransparencyS: number = 70
    public shadowTransparencyU: number = 70
    public shadowTransparencyH: number = 70
  
    public shadowDirectionA: Direction = null
    public shadowDirectionS: Direction = Direction.bottom_right
    public shadowDirectionU: Direction = Direction.bottom_right
    public shadowDirectionH: Direction = Direction.bottom_right
  
    public shadowDistanceA: number = null
    public shadowDistanceS: number = 2
    public shadowDistanceU: number = 2
    public shadowDistanceH: number = 2
  
    public shadowStrengthA: number = null
    public shadowStrengthS: number = 4
    public shadowStrengthU: number = 4
    public shadowStrengthH: number = 4
  
    public glow: boolean = false;
  
    public glowColorA: string = ""
    public glowColorS: string = "#3380FF"
    public glowColorU: string = "#3380FF"
    // public glowColorH: string = "#3380FF"
  
    public glowTransparencyA: number = null
    public glowTransparencyS: number = 0 
    public glowTransparencyU: number = 0
    public glowTransparencyH: number = 0
    
    public glowStrengthA: number = null
    public glowStrengthS: number = 2
    public glowStrengthU: number = 2
    public glowStrengthH: number = 2
  }

  export class IconSettings{
    public icons: boolean = false;
    public state: State = State.all
    public hoverStyling: boolean = false
  
    public placementA: IconPlacement = null;
    public placementS: IconPlacement = IconPlacement.left;
    public placementU: IconPlacement = IconPlacement.left;
    public placementH: IconPlacement = IconPlacement.left;
  
    public widthA: number = null;
    public widthS: number = 40;
    public widthU: number = 40;
    public widthH: number = 40;
  
    public hmarginA: number = null;
    public hmarginS: number = 10;
    public hmarginU: number = 10;
    public hmarginH: number = 10;
  
    public topMarginA: number = null;
    public topMarginS: number = 10;
    public topMarginU: number = 10;
    public topMarginH: number = 10;
  
    public bottomMarginA: number = null;
    public bottomMarginS: number = 10;
    public bottomMarginU: number = 10;
    public bottomMarginH: number = 10;
  
    public transparencyA: number = null;
    public transparencyS: number = 0;
    public transparencyU: number = 0;
    public transparencyH: number = 0;
  }