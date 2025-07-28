interface BaseColumn {
    id: number,
    key: string,
    dataType: string
}

interface Column extends BaseColumn {
    sortMap: string,
    text: { "zh": string, "ja": string, "en": string } | string,
    textAlign: string,
    widthType: string,
    displayType: string,
    groupType: string,
    displayIndex: number
}

export interface BaseTableInfo { [ index: number ]: BaseColumn }

interface TableInfo { [ index: number ]: Column }

export interface DatabaseInfo {
    dbName: string,
    dbPath: string,
    gridView: boolean,
    doubleTable: boolean,
    timeStamp: boolean,
    firstStamp: string | null,
    secondStamp: string | null,
    table1Info: TableInfo,
    table2Info: TableInfo
}

export interface TableDataRow {
    id: number | null,
    [ key: string ]: unknown
}

export interface MainDataRow extends TableDataRow {
    databaseName: string,
    databasePath: string
}

export interface TableData { [ id: number ]: TableDataRow }

export interface DatabaseData extends DatabaseInfo {
    table1Data: TableData,
    table2Data: TableData
}