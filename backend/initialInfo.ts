import { BaseTableInfo, TableInfo } from "./types"

export const dbInfoTableInfo: BaseTableInfo = {
    0: { id:0, key: "gridView", dataType: "BOOLEAN NOT NULL" },
    1: { id:1, key: "doubleTable", dataType: "BOOLEAN NOT NULL" },
    2: { id:2, key: "timeStamp", dataType: "BOOLEAN NOT NULL" },
    3: { id:3, key: "firstStamp", dataType: "TEXT" },
    4: { id:4, key: "secondStamp", dataType: "TEXT" }
}

export const infoTableInfo: BaseTableInfo = {
    0: { id:0, key: "id", dataType: "INTEGER PRIMARY KEY AUTOINCREMENT" },
    1: { id:1, key: "key", dataType: "TEXT NOT NULL" },
    2: { id:2, key: "dataType", dataType: "TEXT NOT NULL" },
    3: { id:3, key: "sortMap", dataType: "TEXT NOT NULL" },
    4: { id:4, key: "text", dataType: "TEXT NOT NULL" },
    5: { id:5, key: "textAlign", dataType: "TEXT NOT NULL" },
    6: { id:6, key: "widthType", dataType: "TEXT NOT NULL" },
    7: { id:7, key: "displayType", dataType: "TEXT NOT NULL" },
    8: { id:8, key: "groupType", dataType: "TEXT NOT NULL" },
    9: { id:9, key: "displayIndex", dataType: "INTEGER NOT NULL" }
}

export const mainInfo: TableInfo = {
    0: {
        id: 0,
        key: "id",
        dataType: "INTEGER",
        sortMap: "id",
        text: { "zh": "序号", "ja": "番号", "en": "ID" },
        textAlign: "center",
        widthType: "tight",
        displayType: "text",
        groupType: "none",
        displayIndex: 0
    },
    1: {
        id: 1,
        key: "databaseName",
        dataType: "TEXT",
        sortMap: "databaseName",
        text: { "zh": "数据库名称", "ja": "データベース名", "en": "Database Name" },
        textAlign: "center",
        widthType: "flex",
        displayType: "text",
        groupType: "alphabet",
        displayIndex: 1
    },
    2: {
        id: 2,
        key: "databasePath",
        dataType: "TEXT",
        sortMap: "databasePath",
        text: { "zh": "数据库路径", "ja": "データベースパス", "en": "Database Path" },
        textAlign: "start",
        widthType: "flex",
        displayType: "text",
        groupType: "none",
        displayIndex: 2
    }
}