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
    width: {},
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

    getInfoReq() {
        global.isTableReady = false
        global.comTool.getData("main/info/get", res => {
            console.log(res)
            for (let row of res) {
                const key = row["KEYS"]
                this.keys.push(key)
                this.values[key] = key.toUpperCase()
                this.sortMap[key] = row["SORTMAP"]
                this.text[key] = JSON.parse(row["TEXT"])
                this.align[key] = row["ALIGN"]
                this.width[key] = row["WIDTH"] == "tight" ?
                    (global.lang.currentLang === "en" ? this.text[key][global.lang.currentLang].length * 8 + 30 : this.text[key][global.lang.currentLang].length * 16 + 30)
                    : (row["WIDTH"] == "fixed" ? 256 : -1)
                this.dataDisplay[key] = row["DATADISPLAY"]
                this.group[key] = row["GROUP"]
                this.shownColumns[key] = row["SHOWNCOLUMNS"] == 1 ? true : false
            }
            global.isTableReady = true
        })
    },
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