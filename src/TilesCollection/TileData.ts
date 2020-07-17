import {ContentFormatType} from './enums'
export class TileData{
    text?: string = "Text"
    text2?: string
    iconURL?: string
    bgimgURL?: string
    isSelected?: boolean
    isHovered?: boolean
    isDisabled?: boolean
    contentFormatType?: ContentFormatType
    sameState?: boolean
    isRendered?: boolean
    needsToBeRendered?: boolean
}