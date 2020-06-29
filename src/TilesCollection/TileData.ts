import {ContentFormatType} from './enums'
export class TileData{
    text?: string = "Text"
    textSecondary?: string
    iconURL?: string
    bgimgURL?: string
    isSelected?: boolean
    isHovered?: boolean
    contentFormatType?: ContentFormatType
}