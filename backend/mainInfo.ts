interface TableInfo {
    [index: number]: {
        key: string,
        dataType: string,
        sortMap: string,
        text: { "zh": string, "ja": string, "en": string },
        textAlign: string,
        widthType: string,
        displayType: string,
        groupType: string,
        displayIndex: number
    }
}

const mainInfo: TableInfo = {
    0: {
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

export default mainInfo