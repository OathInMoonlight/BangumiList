type DataType = "bool" | "tag" | "number" | "text" | "paragraph"
export type LanguageType = "zh" | "ja" | "en"
type TitleType = { [ lang in LanguageType ]: string }
type GroupType = null | "alphabet" | string[]
type TagColorType = { [ key: string ]: string } | null

export interface Column {
    id: number,
    dataType: DataType,
    title: TitleType,
    sortMap: number,
    groupType: GroupType,
    ifDisplay: boolean,
    displayLang: LanguageType | null,
    tagColor: TagColorType
}

interface DataRow {
    0: number,
    [ key: number ]: unknown
}

type SortOrder = { column: number | null, order: "asc" | "desc" | "-" }

export interface DatabaseData {
    dbPath: string,
    gridView: boolean,
    dualTable: boolean,
    table1Info: Column[],
    table2Info: Column[],
    tableData: DataRow[],
    sort1: SortOrder,
    sort2: SortOrder
    groupSort1: SortOrder
    groupSort2: SortOrder
}