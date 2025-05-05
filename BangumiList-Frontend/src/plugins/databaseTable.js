import global from "@/plugins/global.js"

export default {
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
        enableGrid: { "zh": "启用网格视图", "ja": "グリッドビュー有効化", "en": "Enable Grid View" },
        doubleTable: { "zh": "双层表", "ja": "二重テーブル", "en": "Double Table" },
        enableDoubleTable: { "zh": "启用双层表", "ja": "二重テーブル有効化", "en": "Enable Double Table" },
        timeStamp: { "zh": "时间戳", "ja": "タイムスタンプ", "en": "Time Stamp" },
        enableTimeStamp: { "zh": "启用时间戳", "ja": "タイムスタンプ有効化", "en": "Enable Time Stamp" },
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

    updateReq() {
        this.loading = true
        global.comTool.getData("updateDatabase", rdata => {
            if (rdata.length > 0) {
                this.data = rdata
            }
            this.loading = false
        })
    }
}