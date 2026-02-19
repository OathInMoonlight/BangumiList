import type { LanguageType, MainDataRow, DatabaseInfo, DatabaseData, TableData } from "@/plugins/transportTypes"

export interface Languages {
    langList: { title: string, value: LanguageType }[],
    currentLang: LanguageType,
    text: {
        [ key: string ]: {
            [ lang in LanguageType ]: string
        }
    },
    getText: (key: string) => string,
    getTextLength: (text: { [ lang in LanguageType ]: string }) => number
}

type TransportPromise = Promise<{ status: string, result?: unknown }>

export interface DynamicDBData extends DatabaseData {
    loading: boolean,
    displayColumns1: number[],
    displayColumns2: number[],
    selctedRow1: number | null,
    selctedRow2: number | null,
    selectedChildTable: TableData | null,

    // getInfoRequest: ((mainDataRow?: MainDataRow) => TransportPromise),
    // getDataRequest: ((mainDataRow?: MainDataRow) => TransportPromise),
    // insertRequest: ((databaseInfo: DatabaseInfo) => TransportPromise) |
    //     ((mainDataRow: MainDataRow, databaseInfo: DatabaseInfo) => TransportPromise),
    // importRequest: ((file: File) => TransportPromise) |
    //     ((mainDataRow: MainDataRow, file: File) => TransportPromise),
    // exportRequest: ((fileName: string) => TransportPromise) |
    //     ((mainDataRow: MainDataRow, fileName: string) => TransportPromise),
    // deleteRequest: ((ifDeleteFile: boolean) => TransportPromise) |
    //     ((mainDataRow: MainDataRow, ifDeleteFile: boolean) => TransportPromise),
    // updateRequest: ((databaseInfo: DatabaseInfo) => TransportPromise) |
    //     ((mainDataRow: MainDataRow, databaseInfo: DatabaseInfo) => TransportPromise)
}

export interface Http {
    url: string,
    port: number,

    getData: (api: string, mainDataRow: MainDataRow | null) => TransportPromise,
    postData: (api: string, mainDataRow: MainDataRow | null, data: unknown) => TransportPromise,
    getFile: (api: string, mainDataRow: MainDataRow | null) => TransportPromise,
    postFile: (api: string, file: File) => TransportPromise
}