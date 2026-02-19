type HSV = { h: number, s: number, v: number, a?: number; }
type RGB = { r: number, g: number, b: number, a?: number; }
type HSL = { h: number, s: number, l: number, a?: number; }
type Color = string | number | HSV | RGB | HSL

type ColumnDataType = "INTEGER PRIMARY KEY AUTOINCREMENT" |
    "BOOLEAN NOT NULL" | "INTEGER NOT NULL" | "TEXT NOT NULL"

interface BaseColumn {
    id: number,
    key: string,
    dataType: ColumnDataType
}

export type LanguageType = "zh" | "ja" | "en"
type TextType = { [ lang in LanguageType ]: string }
type TextAlignType = "start" | "center" | "end"
type WidthType = "tight" | "flex"
type DisplayType = "text" | "bool" | "tag"
type FrameColorType = { [ key: string ]: Color } | null
type GroupType = null | "alphabet" | string[]

export interface Column extends BaseColumn {
    sortMap: number,
    text: TextType,
    textAlign: TextAlignType,
    widthType: WidthType,
    displayType: DisplayType,
    frameColor: FrameColorType,
    groupType: GroupType,
    displayIndex: number
}

export type BaseTableInfo = BaseColumn[]
export type TableInfo = Column[]

export type TimeStampType = { enabled: boolean, firstStamp: number | null, secondStamp: number | null }

export interface DatabaseInfo {
    dbName: string,
    dbPath: string,
    gridView: boolean,
    doubleTable: boolean,
    timeStamp: TimeStampType,
    table1Info: TableInfo,
    table2Info: TableInfo
}

export interface TableDataRow {
    0: number | null,
    [ key: number ]: unknown
}

export interface MainDataRow extends TableDataRow {
    1: string,
    2: string
}

export type TableData = TableDataRow[]

export type Order = "asc" | "desc" | "-"

export type SortOrder = { column: number | null, order: Order }

export interface DatabaseData extends DatabaseInfo {
    tableData: TableData,
    sort1: SortOrder,
    groupSort1: SortOrder,
    sort2: SortOrder,
    groupSort2: SortOrder
}