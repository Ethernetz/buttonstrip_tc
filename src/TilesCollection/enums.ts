export enum State {
    all = "all",
    selected = "selected",
    unselected = "unselected",
    hovered = "hovered",
    disabled = "disabled"
}

export enum ContentFormatType {
    empty = "empty",
    text = "text",
    icon = "icon",
    text_icon = "text_icon",
    text_text2 = "text_text2"
}

export enum HorizontalAlignmentType {
    center = "center",
    left = "left",
    right = "right"
}

export enum VerticalAlignmentType {
    middle = "middle",
    top = "top",
    bottom = "bottom"
}

export enum TileSizingType {
    uniform = "uniform",
    fixed = "fixed",
    dynamic = "dynamic"
}

export enum TileLayoutType {
    horizontal = "horizontal",
    vertical = "vertical",
    grid = "grid"
}

export enum TileShape {
    rectangle = "rectangle",
    parallelogram = "parallelogram",
    chevron = "chevron",
    ellipse = "ellipse",
    pentagon = "pentagon",
    hexagon = "hexagon",
    tab_roundedCorners = "tab_roundedCorners",
    tab_cutCorners = "tab_cutCorners",
    tab_cutCorner = "tab_cutCorner"
}

export enum Direction {
    bottom_right = "bottom_right",
    bottom = "bottom",
    bottom_left = "bottom_left",
    left = "left",
    center = "center",
    top_left = "top_left",
    top = "top",
    top_right = "top_right",
    right = "right",
    custom = "custom"
}

export enum GradientDirection {
    horizontal = "horizontal",
    vertical = "vertical",
    diagonal1 = "diagonal1",
    diagonal2 = "diagonal2",
    radial = "radial",
    custom = "custom"
}

export enum IconPlacement{
    left = "left",
    above = "above",
    below = "below"
}

export enum PresetStyle{
    none = "none",
    darker = "darker",
    lighter = "lighter",
    filled = "filled",
    popped = "popped",
    pressed = "pressed",
    glow = "glow",
    outlined = "outlined"
}