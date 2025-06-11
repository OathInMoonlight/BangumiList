mainTableInfo = {
    keys: ["id", "databaseName", "databasePath"],
    dataType:{
        id: "INTEGER",
        databaseName: "TEXT",
        databasePath: "TEXT"
    },
    sortMap: {
        id: "id",
        databaseName: "databaseName",
        databasePath: "databasePath"
    },
    text: {
        id: { "zh": "序号", "ja": "番号", "en": "ID" },
        databaseName: { "zh": "数据库名", "ja": "データベース名", "en": "Database Name" },
        databasePath: { "zh": "数据库路径", "ja": "データベースパス", "en": "Database Path" }
    },
    align: {
        id: "center",
        databaseName: "center",
        databasePath: "start"
    },
    width: {
        id: "tight",
        databaseName: "flex",
        databasePath: "flex"
    },
    dataDisplay: {
        id: "text",
        databaseName: "text",
        databasePath: "text"
    },
    group: {
        id: "none",
        databaseName: "alphabet",
        databasePath: "none"
    },
    shownColumns: {
        id: true,
        databaseName: true,
        databasePath: false
    }
}

module.exports = mainTableInfo