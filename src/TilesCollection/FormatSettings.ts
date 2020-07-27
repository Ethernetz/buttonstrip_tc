import {StatesUsed} from './interfaces'
import {HorizontalAlignmentType, TileSizingType, TileLayoutType, TileShape, Direction, IconPlacement, State, VerticalAlignmentType, GradientDirection} from './enums'

export class FormatSettings{
  public tileStroke: TileStrokeSettings = new TileStrokeSettings();
  public tileFill: TileFillSettings = new TileFillSettings();
  public text: TextSettings = new TextSettings();
  public shape: ShapeSettings = new ShapeSettings();
  public layout: LayoutSettings = new LayoutSettings();
  public contentAlignment: ContentAlignmentSettings = new ContentAlignmentSettings();
  public effect: EffectSettings = new EffectSettings();
  public icon: IconSettings = new IconSettings();
}

export interface TileCollectionStatedFormatObject{
  state: State,
  statesUsed: StatesUsed
}


export class TileStrokeSettings implements TileCollectionStatedFormatObject{
    public state: State = State.all
    public statesUsed: StatesUsed = {
      selected: true,
      unselected: true,
      hover: true,
      disabled: false
    }
    public hoverStyling: boolean = false
  
    public strokeD: string = "#000";
    public strokeA: string = "";
    public strokeS: string = null;
    public strokeU: string = null;
    public strokeH: string = null;
    public strokeN: string = null;
  
    public strokeWidthD: number = 0;
    public strokeWidthA: number = null;
    public strokeWidthS: number = null;
    public strokeWidthU: number = null;
    public strokeWidthH: number = null;
    public strokeWidthN: number = null;
  }
export class TileFillSettings implements TileCollectionStatedFormatObject{
    public state: State = State.all
    public statesUsed: StatesUsed = {
      selected: true,
      unselected: true,
      hover: true,
      disabled: false
    }
    public hoverStyling: boolean = false

    public colorD: string = "#262222" 
    public colorA: string = "";
    public colorS: string = null;
    public colorU: string = null;
    public colorH: string = null;
    public colorN: string = null;

    public transparencyD: number = 0;
    public transparencyA: number = null;
    public transparencyS: number = null;
    public transparencyU: number = null;
    public transparencyH: number = null; 
    public transparencyN: number = null; 
  }

  export class TextSettings implements TileCollectionStatedFormatObject{
    public show: boolean = true;
    public state: State = State.all
    public statesUsed: StatesUsed = {
      selected: true,
      unselected: true,
      hover: true,
      disabled: false
    }
    public hoverStyling: boolean = false

    public colorD: string = "#fff";
    public colorA: string = "";
    public colorS: string = null;
    public colorU: string = null;
    public colorH: string = null;
    public colorN: string = null;

    public fontSizeD: number = 14;
    public fontSizeA: number = null;
    public fontSizeS: number = null;
    public fontSizeU: number = null;
    public fontSizeH: number = null;
    public fontSizeN: number = null;

    public fontFamilyD: string = "wf_standard-font, helvetica, arial, sans-serif";
    public fontFamilyA: string = "";
    public fontFamilyS: string = null;
    public fontFamilyU: string = null;
    public fontFamilyH: string = null;
    public fontFamilyN: string = null;

    public transparencyD: number = 0;
    public transparencyA: number = null;
    public transparencyS: number = null;
    public transparencyU: number = null;
    public transparencyH: number = null;
    public transparencyN: number = null;
   

    public backgroundColorD: string = "#fff";
    public backgroundColorA: string = "";
    public backgroundColorS: string = null;
    public backgroundColorU: string = null;
    public backgroundColorH: string = null;
    public backgroundColorN: string = null;

    public backgroundTransparencyD: number = 100;
    public backgroundTransparencyA: number = null;
    public backgroundTransparencyS: number = null;
    public backgroundTransparencyU: number = null;
    public backgroundTransparencyH: number = null;
    public backgroundTransparencyN: number = null;
  }

  export class ShapeSettings{
    public tileShape: TileShape = TileShape.rectangle
    
    public parallelogramAngle: number = 80
    public chevronAngle: number = 60
    public pentagonAngle: number = 60
    public hexagonAngle: number = 60
    public tab_cutCornersLength: number = 20
    public tab_cutCornerLength: number = 20
  }

  export class LayoutSettings{
    public sizingMethod: TileSizingType = TileSizingType.uniform;
    public tileWidth: number = 150;
    public tileHeight: number = 75;
    public autoHeight: boolean = false;
    public tileAlignment: HorizontalAlignmentType = HorizontalAlignmentType.left
    public tileLayout: TileLayoutType = TileLayoutType.horizontal;
    public tilesPerRow: number = 2;
    public padding: number = 10;
  }

  export class ContentAlignmentSettings implements TileCollectionStatedFormatObject{
    public state: State = State.all
    public statesUsed: StatesUsed = {
      selected: true,
      unselected: true,
      hover: true,
      disabled: false
    }
    public hoverStyling: boolean = false

    public iconPlacementD: IconPlacement = IconPlacement.left;
    public iconPlacementA: IconPlacement = IconPlacement.left;
    public iconPlacementS: IconPlacement = null;
    public iconPlacementU: IconPlacement = null;
    public iconPlacementH: IconPlacement = null;
    public iconPlacementN: IconPlacement = null;

    public iconTextPaddingD: number = 20
    public iconTextPaddingA: number = null
    public iconTextPaddingS: number = null
    public iconTextPaddingU: number = null
    public iconTextPaddingH: number = null
    public iconTextPaddingN: number = null

  
    public horizontalAlignmentD: HorizontalAlignmentType = HorizontalAlignmentType.center;
    public horizontalAlignmentA: HorizontalAlignmentType = HorizontalAlignmentType.center;
    public horizontalAlignmentS: HorizontalAlignmentType = null;
    public horizontalAlignmentU: HorizontalAlignmentType = null;
    public horizontalAlignmentH: HorizontalAlignmentType = null;
    public horizontalAlignmentN: HorizontalAlignmentType = null;

    public verticalAlignmentD: VerticalAlignmentType = VerticalAlignmentType.middle;
    public verticalAlignmentA: VerticalAlignmentType = VerticalAlignmentType.middle;
    public verticalAlignmentS: VerticalAlignmentType = null;
    public verticalAlignmentU: VerticalAlignmentType = null;
    public verticalAlignmentH: VerticalAlignmentType = null;
    public verticalAlignmentN: VerticalAlignmentType = null;

    public leftMarginD: number = 0
    public leftMarginA: number = null
    public leftMarginS: number = null
    public leftMarginU: number = null
    public leftMarginH: number = null
    public leftMarginN: number = null

    public rightMarginD: number = 0
    public rightMarginA: number = null
    public rightMarginS: number = null
    public rightMarginU: number = null
    public rightMarginH: number = null
    public rightMarginN: number = null

    public topMarginD: number = 0
    public topMarginA: number = null
    public topMarginS: number = null;
    public topMarginU: number = null;
    public topMarginH: number = null;
    public topMarginN: number = null;

    public bottomMarginD: number = 0
    public bottomMarginA: number = null
    public bottomMarginS: number = null;
    public bottomMarginU: number = null;
    public bottomMarginH: number = null;
    public bottomMarginN: number = null;
    
  }

  export class EffectSettings implements TileCollectionStatedFormatObject{
    public state: State = State.all
    public statesUsed: StatesUsed = {
      selected: true,
      unselected: true,
      hover: true,
      disabled: false
    }
    public shapeRoundedCornerRadius: number = 0 
    public hoverStyling: boolean = false
  

    public gradient: boolean = false;
    
    public reverseGradient: boolean = false; 

    public gradientColorD: string = "#41A4FF"
    public gradientColorA: string = "";
    public gradientColorS: string = null;
    public gradientColorU: string = null;
    public gradientColorH: string = null;
    public gradientColorN: string = null;

    public gradientDirectionD: GradientDirection = GradientDirection.horizontal
    public gradientDirectionA: GradientDirection = null;
    public gradientDirectionS: GradientDirection = null;
    public gradientDirectionU: GradientDirection = null;
    public gradientDirectionH: GradientDirection = null;
    public gradientDirectionN: GradientDirection = null;



    public shadow: boolean = false;
  
    public shadowColorD: string = "#000"
    public shadowColorA: string = "";
    public shadowColorS: string = null;
    public shadowColorU: string = null;
    public shadowColorH: string = null;
    public shadowColorN: string = null;
    
    public shadowTransparencyD: number = 70
    public shadowTransparencyA: number = null;
    public shadowTransparencyS: number = null;
    public shadowTransparencyU: number = null;
    public shadowTransparencyH: number = null;
    public shadowTransparencyN: number = null;
  
    public shadowDirectionD: Direction = Direction.bottom_right
    public shadowDirectionA: Direction = null;
    public shadowDirectionS: Direction = null;
    public shadowDirectionU: Direction = null;
    public shadowDirectionH: Direction = null;
    public shadowDirectionN: Direction = null;

    public shadowDistanceD: number = 2
    public shadowDistanceA: number = null;
    public shadowDistanceS: number = null;
    public shadowDistanceU: number = null;
    public shadowDistanceH: number = null;
    public shadowDistanceN: number = null;
  
    public shadowStrengthD: number = 4
    public shadowStrengthA: number = null;
    public shadowStrengthS: number = null;
    public shadowStrengthU: number = null;
    public shadowStrengthH: number = null;
    public shadowStrengthN: number = null;
  
    public glow: boolean = false;
  
    public glowColorD: string = "#41A4FF"
    public glowColorA: string = "";
    public glowColorS: string = null;
    public glowColorU: string = null;
    public glowColorH: string = null;
    public glowColorN: string = null;
  
    public glowTransparencyD: number = 0
    public glowTransparencyA: number = null
    public glowTransparencyS: number = null 
    public glowTransparencyU: number = null
    public glowTransparencyH: number = null
    public glowTransparencyN: number = null
    
    public glowStrengthD: number = 2
    public glowStrengthA: number = null
    public glowStrengthS: number = null
    public glowStrengthU: number = null
    public glowStrengthH: number = null
    public glowStrengthN: number = null


  }

  export class IconSettings implements TileCollectionStatedFormatObject{
    public show: boolean = false;
    public state: State = State.all
    public statesUsed: StatesUsed = {
      selected: true,
      unselected: true,
      hover: true,
      disabled: false
    }
    public hoverStyling: boolean = false
  
    public widthD: number = 40;
    public widthA: number = null;
    public widthS: number = null;
    public widthU: number = null;
    public widthH: number = null;
    public widthN: number = null;
  
    public transparencyD: number = 0;
    public transparencyA: number = null;
    public transparencyS: number = null;
    public transparencyU: number = null;
    public transparencyH: number = null;
    public transparencyN: number = null;
  }