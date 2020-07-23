import {ContentFormatType} from './enums'
export class TileData{
    text?: string = "Text"
    text2?: string
    iconURL?: string
    bgimgURL?: string
    bgimgAspectRatio?: number
    isSelected?: boolean
    isHovered?: boolean
    isDisabled?: boolean
    contentFormatType?: ContentFormatType
    changedState?: boolean
    isRendered?: boolean
    needsToBeRendered?: boolean
}