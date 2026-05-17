export type DataType = "bool" | "tag" | "number" | "text" | "paragraph"
export type LanguageType = "zh" | "ja" | "en"
type TitleType = { [ lang in LanguageType ]: string }
type GroupType = "none" | "alphabet" | unknown[]
export type ValuePresetType = { [ key: string ]: { title?: TitleType, color?: string, icon?: string } } | "none"

export interface Column {
    id: number,
    dataType: DataType,
    title: TitleType,
    sortMap: number,
    groupType: GroupType,
    ifDisplay: boolean,
    displayLang: LanguageType | "none",
    valuePreset: ValuePresetType
}

export type InputColumn = Omit<Column, "dataType" | "groupType" | "valuePreset"> & { dataType: DataType | null, groupType: string, valuePreset: string }

export interface DataRow {
    0: number,
    [ key: number ]: unknown
}

type SortOrder = { column: number | null, order: "asc" | "desc" | "-" }

export interface DatabaseData {
    path: string,
    gridView: boolean,
    dualTable: boolean,
    table1Label: number | null,
    table2Label: number | null,
    table1Title: number[],
    table2Title: number[],
    table1Info: Column[],
    table2Info: Column[],
    tableData: DataRow[],
    sort1: SortOrder,
    sort2: SortOrder,
    groupSort1: SortOrder,
    groupSort2: SortOrder
}