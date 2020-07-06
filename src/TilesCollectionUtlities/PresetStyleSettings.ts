export class Preset {
    public static baseColor: string;
}


export class DefaultPreset {
    public tile: DefaultTileSettings = new DefaultTileSettings();
    public text: DefaultTextSettings = new DefaultTextSettings();
    public effects: DefaultEffectSettings = new DefaultEffectSettings();
}

export class DefaultTileSettings {
    public colorA: string = "";
    public colorS: string = Preset.baseColor;
    public colorU: string = Preset.baseColor;
    public colorH: string = Preset.baseColor;
    // public colorN: string = "#9400D3";

    public strokeA: string = "";
    public strokeS: string =  Preset.baseColor;
    public strokeU: string =  Preset.baseColor;
    public strokeH: string =  Preset.baseColor;
    // public strokeN: string = shadeHexColor(Preset.baseColor, 0.15);

    public strokeWidthA: number = null;
    public strokeWidthS: number = 0;
    public strokeWidthU: number = 0;
    public strokeWidthH: number = 0;
    // public strokeWidthN: number = 0;
}
export class DefaultTextSettings {
    public colorA: string = "";
    public colorS: string = bgHexToBinaryTextColor(Preset.baseColor);
    public colorU: string = bgHexToBinaryTextColor(Preset.baseColor);
    public colorH: string = bgHexToBinaryTextColor(Preset.baseColor);
}
export class DefaultEffectSettings {
    public shadowColorA: string = "";
    public shadowColorS: string = "#000";
    public shadowColorU: string = "#000";
    public shadowColorH: string = "#000";
    // public shadowColorN: string = "#000";

    public shadowTransparencyA: number = null;
    public shadowTransparencyS: number = 0;
    public shadowTransparencyU: number = 0;
    public shadowTransparencyH: number = 0;
    // public shadowTransparencyN: number = null;


    public shadowDistanceA: number = null;
    public shadowDistanceS: number = 2;
    public shadowDistanceU: number = 2;
    public shadowDistanceH: number = 2;
    // public shadowDistanceN: number = null;

    public shadowStrengthA: number = null;
    public shadowStrengthS: number = 4;
    public shadowStrengthU: number = 4;
    public shadowStrengthH: number = 4;
    // public shadowStrengthN: number = 4;
}


export class DarkerPreset {
    public tile: DarkerTileSettings = new DarkerTileSettings();
    public text: DarkerTextSettings = new DarkerTextSettings();
}
export class DarkerTileSettings {
    public colorA: string = "";
    public colorS: string = shadeHexColor(Preset.baseColor, -0.30);
    public colorU: string = Preset.baseColor;
    public colorH: string = shadeHexColor(Preset.baseColor, -0.15);
    // public colorN: string = "#9400D3";
}
export class DarkerTextSettings {
    public colorA: string = "";
    public colorS: string = bgHexToBinaryTextColor(Preset.baseColor);
    public colorU: string = bgHexToBinaryTextColor(Preset.baseColor);
    public colorH: string = bgHexToBinaryTextColor(Preset.baseColor);
    // public colorN: string = "#fff";
}

export class LighterPreset {
    public tile: LighterTileSettings = new LighterTileSettings();
    public text: LighterTextSettings = new LighterTextSettings();
}
export class LighterTileSettings {
    public colorA: string = "";
    public colorS: string = shadeHexColor(Preset.baseColor, 0.30);
    public colorU: string = Preset.baseColor;
    public colorH: string = shadeHexColor(Preset.baseColor, 0.15);
    // public colorN: string = "#9400D3";
}
export class LighterTextSettings {
    public colorA: string = "";
    public colorS: string = bgHexToBinaryTextColor(Preset.baseColor);
    public colorU: string = bgHexToBinaryTextColor(Preset.baseColor);
    public colorH: string = bgHexToBinaryTextColor(Preset.baseColor);
    // public colorN: string = "#fff";
}

export class FilledPreset {
    public tile: FilledTileSettings = new FilledTileSettings();
    public text: FilledTextSettings = new FilledTextSettings();
}
export class FilledTileSettings {
    public colorA: string = "";
    public colorS: string = Preset.baseColor;
    public colorU: string = "#fff";
    public colorH: string = shadeHexColor(Preset.baseColor, 0.15);
    // public colorN: string = "#9400D3";

    public strokeA: string = "";
    public strokeS: string = shadeHexColor(Preset.baseColor, 0.15);
    public strokeU: string = shadeHexColor(Preset.baseColor, 0.15);
    public strokeH: string = shadeHexColor(Preset.baseColor, 0.15);
    // public strokeN: string = shadeHexColor(Preset.baseColor, 0.15);

    public strokeWidthA: number = null;
    public strokeWidthS: number = 0;
    public strokeWidthU: number = 2;
    public strokeWidthH: number = 0;
    // public strokeWidthN: number = 0;
}
export class FilledTextSettings {
    public colorA: string = "";
    public colorS: string = bgHexToBinaryTextColor(Preset.baseColor);
    public colorU: string = Preset.baseColor;
    public colorH: string = bgHexToBinaryTextColor(Preset.baseColor);
    // public colorN: string = "#fff";
}

export class PoppedPreset {
    effects: PoppedEffectSettings = new PoppedEffectSettings();
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
    effects: PressedEffectSettings = new PressedEffectSettings();
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
    effects: GlowEffectSettings = new GlowEffectSettings();
}
export class GlowEffectSettings {
    public glowColorA: string = "";
    public glowColorS: string = shadeHexColor(Preset.baseColor, 0.50);
    public glowColorU: string = shadeHexColor(Preset.baseColor, 0.50);;
    public glowColorH: string = shadeHexColor(Preset.baseColor, 0.50);;
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



function shadeHexColor(hex: string, percent: number): string {
    var f = parseInt(hex.slice(1), 16), t = percent < 0 ? 0 : 255, p = percent < 0 ? percent * -1 : percent, R = f >> 16, G = f >> 8 & 0x00FF, B = f & 0x0000FF;
    return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
}

function bgHexToBinaryTextColor(hex: string): string {
    let hexToRbg = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    let rgb = {
        r: parseInt(hexToRbg[1], 16),
        g: parseInt(hexToRbg[2], 16),
        b: parseInt(hexToRbg[3], 16)
    }
    return (rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114) > 186 ? "#262222" : "#fff"
}