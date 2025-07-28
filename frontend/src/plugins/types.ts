import type { MainDataRow, DatabaseInfo, DatabaseData } from "@/plugins/transportTypes"

type LanguageType = "zh" | "ja" | "en"

export interface Languages {
    currentLang: LanguageType,
    text: {
        [ key: string ]: {
            [ lang in LanguageType ]: string
        }
    }
}

export type CallbackFunction = (status: string, result?: unknown) => void

export interface DynamicDBData extends DatabaseData {
    loading: boolean,
    displayColumns: number[],
    filterText: string | null,
    selctedRow: number | null,

    getInfoRequest: ((callback: CallbackFunction) => void) | 
        ((mainDataRow: MainDataRow, callback: CallbackFunction) => void),
    getDataRequest: ((callback: CallbackFunction) => void) | 
        ((mainDataRow: MainDataRow, callback: CallbackFunction) => void),
    insertRequest: ((databaseInfo: DatabaseInfo, callback: CallbackFunction) => void) |
        ((mainDataRow: MainDataRow, databaseInfo: DatabaseInfo, callback: CallbackFunction) => void),
    importRequest: ((file: File, callback: CallbackFunction) => void) |
        ((mainDataRow: MainDataRow, file: File, callback: CallbackFunction) => void),
    exportRequest: ((fileName: string, callback: CallbackFunction) => void) |
        ((mainDataRow: MainDataRow, fileName: string, callback: CallbackFunction) => void),
    deleteRequest: ((ifDeleteFile: boolean, callback: CallbackFunction) => void) |
        ((mainDataRow: MainDataRow, ifDeleteFile: boolean, callback: CallbackFunction) => void),
    updateRequest: ((databaseInfo: DatabaseInfo, callback: CallbackFunction) => void) |
        ((mainDataRow: MainDataRow, databaseInfo: DatabaseInfo, callback: CallbackFunction) => void)
}

export interface Http {
    url: string,
    port: number,

    getData: (api: string, mainDataRow: MainDataRow | null,
        callback: CallbackFunction) => void,
    postData: (api: string, mainDataRow: MainDataRow | null,
        data: unknown, callback: CallbackFunction) => void,
    getFile: (api: string, mainDataRow: MainDataRow | null,
        callback: CallbackFunction) => void,
    postFile: (api: string, mainDataRow: MainDataRow | null,
        file: File, callback: CallbackFunction) => void
}