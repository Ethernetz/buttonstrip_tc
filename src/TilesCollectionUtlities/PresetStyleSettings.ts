import * as TileCollectionFormatSettings from "../TilesCollection/FormatSettings"

export class Preset {
    public static baseColor: string;
}


export class DefaultPreset {
    public tileFill: DefaultTileFillSettings = new DefaultTileFillSettings();
    public tileStroke: DefaultTileStrokeSettings = new DefaultTileStrokeSettings();
    public text: DefaultTextSettings = new DefaultTextSettings();
    public effect: DefaultEffectSettings = new DefaultEffectSettings();
}

export class DefaultTileFillSettings extends TileCollectionFormatSettings.TileFillSettings {
    public colorA: string = "";
    public colorS: string = Preset.baseColor;
    public colorU: string = Preset.baseColor;
    public colorH: string = Preset.baseColor;
    public colorN: string = Preset.baseColor;
}

export class DefaultTileStrokeSettings extends TileCollectionFormatSettings.TileStrokeSettings {
    public strokeA: string = "";
    public strokeS: string =  Preset.baseColor;
    public strokeU: string =  Preset.baseColor;
    public strokeH: string =  Preset.baseColor;
    public strokeN: string = Preset.baseColor;

    public strokeWidthA: number = null;
    public strokeWidthS: number = 0;
    public strokeWidthU: number = 0;
    public strokeWidthH: number = 0;
    public strokeWidthN: number = 0;
}


export class DefaultTextSettings extends TileCollectionFormatSettings.TileStrokeSettings{
    public colorA: string = "";
    public colorS: string = isLightShaded(Preset.baseColor) ? "#262222" : "#fff";
    public colorU: string = isLightShaded(Preset.baseColor) ? "#262222" : "#fff";
    public colorH: string = isLightShaded(Preset.baseColor) ? "#262222" : "#fff";
    public colorN: string = isLightShaded(Preset.baseColor) ? "#262222" : "#fff";
}
export class DefaultEffectSettings extends TileCollectionFormatSettings.EffectSettings{
    public shadowColorA: string = "";
    public shadowColorS: string = "#000";
    public shadowColorU: string = "#000";
    public shadowColorH: string = "#000";
    public shadowColorN: string = "#000";

    public shadowTransparencyA: number = null;
    public shadowTransparencyS: number = 0;
    public shadowTransparencyU: number = 0;
    public shadowTransparencyH: number = 0;
    public shadowTransparencyN: number = 0;


    public shadowDistanceA: number = null;
    public shadowDistanceS: number = 2;
    public shadowDistanceU: number = 2;
    public shadowDistanceH: number = 2;
    public shadowDistanceN: number = 2;

    public shadowStrengthA: number = null;
    public shadowStrengthS: number = 4;
    public shadowStrengthU: number = 4;
    public shadowStrengthH: number = 4;
    public shadowStrengthN: number = 4;
}


export class DarkerPreset {
    public tileFill: DarkerTileFillSettings = new DarkerTileFillSettings();
    public text: DarkerTextSettings = new DarkerTextSettings();
}
export class DarkerTileFillSettings{
    public colorA: string = "";
    public colorS: string = shadeHexColor(Preset.baseColor, -0.30);
    public colorU: string = Preset.baseColor;
    public colorH: string = shadeHexColor(Preset.baseColor, -0.15);
    public colorN: string = isLightShaded(Preset.baseColor) ? shadeHexColor(Preset.baseColor, -0.55) : shadeHexColor(Preset.baseColor, 0.55);
}
export class DarkerTextSettings {
    public colorA: string = "";
    public colorS: string = isLightShaded(Preset.baseColor) ? "#262222" : "#fff";
    public colorU: string = isLightShaded(Preset.baseColor) ? "#262222" : "#fff";
    public colorH: string = isLightShaded(Preset.baseColor) ? "#262222" : "#fff";
    public colorN: string = isLightShaded(Preset.baseColor) ? "#262222" : "#fff";
}

export class LighterPreset {
    public tileFill: LighterTileFillSettings = new LighterTileFillSettings();
    public text: LighterTextSettings = new LighterTextSettings();
}
export class LighterTileFillSettings {
    public colorA: string = "";
    public colorS: string = shadeHexColor(Preset.baseColor, 0.30);
    public colorU: string = Preset.baseColor;
    public colorH: string = shadeHexColor(Preset.baseColor, 0.15);
    public colorN: string = shadeHexColor(Preset.baseColor, -0.55);
}
export class LighterTextSettings {
    public colorA: string = "";
    public colorS: string = isLightShaded(Preset.baseColor) ? "#262222" : "#fff";
    public colorU: string = isLightShaded(Preset.baseColor) ? "#262222" : "#fff";
    public colorH: string = isLightShaded(Preset.baseColor) ? "#262222" : "#fff";
    public colorN: string = isLightShaded(Preset.baseColor) ? "#262222" : shadeHexColor(Preset.baseColor, 0.15);
}

export class FilledPreset {
    public tileFill: FilledTileFillSettings = new FilledTileFillSettings();
    public tileStroke: FilledTileStrokeSettings = new FilledTileStrokeSettings();
    public text: FilledTextSettings = new FilledTextSettings();
}
export class FilledTileFillSettings {
    public colorA: string = "";
    public colorS: string = Preset.baseColor;
    public colorU: string = "#fff";
    public colorH: string = shadeHexColor(Preset.baseColor, 0.15);
    public colorN: string = "#fff";
}
export class FilledTileStrokeSettings {
    public strokeA: string = "";
    public strokeS: string = shadeHexColor(Preset.baseColor, 0.15);
    public strokeU: string = shadeHexColor(Preset.baseColor, 0.15);
    public strokeH: string = shadeHexColor(Preset.baseColor, 0.15);
    public strokeN: string = isLightShaded(Preset.baseColor) ? shadeHexColor(Preset.baseColor, -0.65) : shadeHexColor(Preset.baseColor, 0.65);

    public strokeWidthA: number = null;
    public strokeWidthS: number = 0;
    public strokeWidthU: number = 2;
    public strokeWidthH: number = 0;
    public strokeWidthN: number = 2;
}
export class FilledTextSettings {
    public colorA: string = "";
    public colorS: string = isLightShaded(Preset.baseColor) ? "#262222" : "#fff";
    public colorU: string = Preset.baseColor;
    public colorH: string = isLightShaded(Preset.baseColor) ? "#262222" : "#fff";
    public colorN: string = isLightShaded(Preset.baseColor) ? shadeHexColor(Preset.baseColor, -0.65) : shadeHexColor(Preset.baseColor, 0.65);
}

export class PoppedPreset {
    effect: PoppedEffectSettings = new PoppedEffectSettings();
}
export class PoppedEffectSettings {
    public shadowColorA: string = "";
    public shadowColorS: string = "#000";
    public shadowColorU: string = "#000";
    public shadowColorH: string = "#000";
    // public shadowColorN: string = "#000";

    public shadowTransparencyA: number = null;
    public shadowTransparencyS: number = 60;
    public shadowTransparencyU: number = 60;
    public shadowTransparencyH: number = 60;
    // public shadowTransparencyN: number = null;


    public shadowDistanceA: number = null;
    public shadowDistanceS: number = 2;
    public shadowDistanceU: number = 1;
    public shadowDistanceH: number = 1;
    // public shadowDistanceN: number = null;

    public shadowStrengthA: number = null;
    public shadowStrengthS: number = 4;
    public shadowStrengthU: number = 1;
    public shadowStrengthH: number = 2;
    // public shadowStrengthN: number = 4;

}


export class PressedPreset {
    effect: PressedEffectSettings = new PressedEffectSettings();
}
export class PressedEffectSettings {
    public shadowColorA: string = "";
    public shadowColorS: string = "#000";
    public shadowColorU: string = "#000";
    public shadowColorH: string = "#000";
    // public shadowColorN: string = "#000";

    public shadowTransparencyA: number = null;
    public shadowTransparencyS: number = 60;
    public shadowTransparencyU: number = 60;
    public shadowTransparencyH: number = 60;
    // public shadowTransparencyN: number = null;


    public shadowDistanceA: number = null;
    public shadowDistanceS: number = 1;
    public shadowDistanceU: number = 2;
    public shadowDistanceH: number = 2;
    // public shadowDistanceN: number = null;

    public shadowStrengthA: number = null;
    public shadowStrengthS: number = 1;
    public shadowStrengthU: number = 4;
    public shadowStrengthH: number = 2;
    // public shadowStrengthN: number = 4;
}

export class GlowPreset {
    effect: GlowEffectSettings = new GlowEffectSettings();
}
export class GlowEffectSettings {
    public glowColorA: string = "";
    public glowColorS: string = shadeHexColor(Preset.baseColor, 0.50);
    public glowColorU: string = shadeHexColor(Preset.baseColor, 0.50);
    public glowColorH: string = shadeHexColor(Preset.baseColor, 0.50);
    // public glowColorN: string = Preset.baseColor;
  
    public glowTransparencyA: number = null
    public glowTransparencyS: number = 0
    public glowTransparencyU: number = 0
    public glowTransparencyH: number = 50
    // public glowTransparencyN: number = 0

    public glowStrengthA: number = null
    public glowStrengthS: number = 5
    public glowStrengthU: number = 0
    public glowStrengthH: number = 2
    // public glowStrengthN: number = 2
}


export class OutlinedPreset {
    public tileFill: OutlinedTileFillSettings = new OutlinedTileFillSettings();
    public tileStroke: OutlinedTileStrokeSettings = new OutlinedTileStrokeSettings();
}

export class OutlinedTileFillSettings{
    public colorA: string = "";
    public colorS: string = Preset.baseColor;
    public colorU: string = Preset.baseColor;
    public colorH: string = Preset.baseColor;
    public colorN: string = isLightShaded(Preset.baseColor) ? shadeHexColor(Preset.baseColor, -0.55) : shadeHexColor(Preset.baseColor, 0.55);
}
export class OutlinedTileStrokeSettings{
    public strokeA: string = "";
    public strokeS: string = shadeHexColor(Preset.baseColor, -0.25);
    public strokeU: string = shadeHexColor(Preset.baseColor, -0.25);
    public strokeH: string = shadeHexColor(Preset.baseColor, -0.25);
    public strokeN: string = shadeHexColor(Preset.baseColor, -0.25);

    public strokeWidthA: number = null;
    public strokeWidthS: number = 5;
    public strokeWidthU: number = 1;
    public strokeWidthH: number = 3;
    public strokeWidthN: number = 0;
}


function shadeHexColor(hex: string, percent: number): string {
    var f = parseInt(hex.slice(1), 16), t = percent < 0 ? 0 : 255, p = percent < 0 ? percent * -1 : percent, R = f >> 16, G = f >> 8 & 0x00FF, B = f & 0x0000FF;
    return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
}

function isLightShaded(hex: string): boolean {
    let hexToRbg = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    let rgb = {
        r: parseInt(hexToRbg[1], 16),
        g: parseInt(hexToRbg[2], 16),
        b: parseInt(hexToRbg[3], 16)
    }
    return (rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114) > 186 
}