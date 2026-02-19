import type { BaseTableInfo, DatabaseInfo } from "./types.js"

export const dbInfoTableInfo: BaseTableInfo = [
    { id: 0, key: "gridView", dataType: "BOOLEAN NOT NULL" },
    { id: 1, key: "doubleTable", dataType: "BOOLEAN NOT NULL" },
    { id: 2, key: "timeStamp", dataType: "TEXT NOT NULL" },
    { id: 3, key: "sort1", dataType: "TEXT NOT NULL" },
    { id: 4, key: "groupSort1", dataType: "TEXT NOT NULL" },
    { id: 5, key: "sort2", dataType: "TEXT NOT NULL" },
    { id: 6, key: "groupSort2", dataType: "TEXT NOT NULL" }
]

export const defaultSort = { column: -1, order: "-" }

export const infoTableInfo: BaseTableInfo = [
    { id: 0, key: "id", dataType: "INTEGER PRIMARY KEY AUTOINCREMENT" },
    { id: 1, key: "key", dataType: "TEXT NOT NULL" },
    { id: 2, key: "dataType", dataType: "TEXT NOT NULL" },
    { id: 3, key: "sortMap", dataType: "INTEGER NOT NULL" },
    { id: 4, key: "text", dataType: "TEXT NOT NULL" },
    { id: 5, key: "textAlign", dataType: "TEXT NOT NULL" },
    { id: 6, key: "widthType", dataType: "TEXT NOT NULL" },
    { id: 7, key: "displayType", dataType: "TEXT NOT NULL" },
    { id: 8, key: "frameColor", dataType: "TEXT NOT NULL" },
    { id: 9, key: "groupType", dataType: "TEXT NOT NULL" },
    { id: 10, key: "displayIndex", dataType: "INTEGER NOT NULL" }
]

export const mainInfo: DatabaseInfo = {
    dbName: "main",
    dbPath: "main.db",
    gridView: false,
    doubleTable: false,
    timeStamp: { enabled: false, firstStamp: null, secondStamp: null },
    table1Info: [
        {
            id: 0,
            key: "id",
            dataType: "INTEGER PRIMARY KEY AUTOINCREMENT",
            sortMap: 0,
            text: { "zh": "序号", "ja": "番号", "en": "ID" },
            textAlign: "center",
            widthType: "tight",
            displayType: "text",
            frameColor: null,
            groupType: null,
            displayIndex: 0
        },
        {
            id: 1,
            key: "databaseName",
            dataType: "TEXT NOT NULL",
            sortMap: 1,
            text: { "zh": "数据库名称", "ja": "データベース名", "en": "Database Name" },
            textAlign: "center",
            widthType: "flex",
            displayType: "text",
            frameColor: null,
            groupType: "alphabet",
            displayIndex: 1
        },
        {
            id: 2,
            key: "databasePath",
            dataType: "TEXT NOT NULL",
            sortMap: 2,
            text: { "zh": "数据库路径", "ja": "データベースパス", "en": "Database Path" },
            textAlign: "start",
            widthType: "flex",
            displayType: "text",
            frameColor: null,
            groupType: null,
            displayIndex: 2
        }
    ],
    table2Info: []
}