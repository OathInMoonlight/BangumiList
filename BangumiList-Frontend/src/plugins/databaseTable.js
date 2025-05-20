import global from "@/plugins/global.js"

export default {
    gridView: false,
    doubleTable: false,
    timeStamp: false,

    keys: ["id", "databaseName", "gridView", "doubleTable", "timeStamp", "databasePath"],
    values: {
        id: "ID",
        databaseName: "DATABASENAME",
        gridView: "ENABLEGRID",
        doubleTable: "ENABLEDOUBLETABLE",
        timeStamp: "ENABLETIMESTAMP",
        databasePath: "DATABASEPATH"
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
    computeWidth(key, currentLang) {
        if (key === this.keys[1]) {
            return 256
        }
        else if (key === this.keys[5]) {
            return -1
        }
        else {
            return currentLang === "en" ? this.text[key][currentLang].length * 8 + 30 : this.text[key][currentLang].length * 16 + 30
        }
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

    loading: false,
    shownColumns: {
        id: true,
        databaseName: true,
        gridView: true,
        doubleTable: true,
        timeStamp: true,
        databasePath: true
    },
    data: [],
    selectedRow: null,
    filterText: null,

    getReq() {
        this.loading = true
        global.comTool.getData("main/get", res => {
            if (res.length > 0) {
                this.data = res
            }
            this.loading = false
        })
    }
}