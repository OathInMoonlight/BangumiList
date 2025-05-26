mainTableInfo = {
    keys: ["id", "databaseName", "gridView", "doubleTable", "timeStamp", "databasePath"],
    dataType:{
        id: "INTEGER",
        databaseName: "TEXT",
        gridView: "BOOLEAN",
        doubleTable: "BOOLEAN",
        timeStamp: "BOOLEAN",
        databasePath: "TEXT"
    },
    sortMap: {
        id: "id",
        databaseName: "databaseName",
        gridView: "gridView",
        doubleTable: "doubleTable",
        timeStamp: "timeStamp",
        databasePath: "databasePath"
    },
    text: {
        id: { "zh": "序号", "ja": "番号", "en": "ID" },
        databaseName: { "zh": "数据库名", "ja": "データベース名", "en": "Database Name" },
        gridView: { "zh": "网格视图", "ja": "グリッドビュー", "en": "Grid View" },
        doubleTable: { "zh": "双层表", "ja": "二重テーブル", "en": "Double Table" },
        timeStamp: { "zh": "时间戳", "ja": "タイムスタンプ", "en": "Time Stamp" },
        databasePath: { "zh": "数据库路径", "ja": "データベースパス", "en": "Database Path" }
    },
    align: {
        id: "center",
        databaseName: "center",
        gridView: "center",
        doubleTable: "center",
        timeStamp: "center",
        databasePath: "start"
    },
    width: {
        id: "tight",
        databaseName: "flex",
        gridView: "tight",
        doubleTable: "tight",
        timeStamp: "tight",
        databasePath: "flex"
    },
    dataDisplay: {
        id: "text",
        databaseName: "text",
        gridView: "icon",
        doubleTable: "icon",
        timeStamp: "icon",
        databasePath: "text"
    },
    group: {
        id: "none",
        databaseName: "alphabet",
        gridView: "classification",
        doubleTable: "classification",
        timeStamp: "classification",
        databasePath: "none"
    },
    shownColumns: {
        id: true,
        databaseName: true,
        gridView: true,
        doubleTable: true,
        timeStamp: true,
        databasePath: false
    }
}

module.exports = mainTableInfo