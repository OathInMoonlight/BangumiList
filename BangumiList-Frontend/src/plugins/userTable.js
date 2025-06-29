import global from "@/plugins/global.js"

export default {
    gridView: false,
    doubleTable: false,
    timeStamp: false,
    firstTimeStamp: null,
    secondTimeStamp: null,

    keys: [],
    values: {},
    dataType: {},
    sortMap: {},
    text: {},
    align: {},
    width: {},
    dataDisplay: {},
    group: {},
    secondTable: {
        keys: [],
        values: {},
        dataType: {},
        sortMap: {},
        text: {},
        align: {},
        width: {},
        dataDisplay: {},
        group: {}
    },

    loading: true,
    shownColumns: {},
    data: [],
    selectedRow: null,
    filterText: null,

    getInfoReq(databaseName, callback) {
        global.comTool.getData("user/info/get", databaseName, res => {
            if(res.status !== "Success"){
                callback()
                return
            }
            this.gridView = res.data.settings.GRIDVIEW == 1 ? true : false
            this.doubleTable = res.data.settings.DOUBLETABLE == 1 ? true : false
            this.timeStamp = res.data.settings.TIMESTAMP == 1 ? true : false
            this.firstTimeStamp = res.data.settings.FIRSTTIMESTAMP
            this.secondTimeStamp = res.data.settings.SECONDTIMESTAMP
            const rows = res.data.rows
            this.keys = []
            for (let row of rows) {
                const key = row["KEYS"]
                this.keys.push(key)
                this.values[key] = key.toUpperCase()
                this.dataType[key] = row["DATATYPE"]
                this.sortMap[key] = row["SORTMAP"]
                this.text[key] = JSON.parse(row["TEXT"])
                this.align[key] = row["ALIGN"]
                this.width[key] = row["WIDTH"] == "tight" ?
                    (global.lang.currentLang === "en" ? this.text[key][global.lang.currentLang].length * 8 + 30 : this.text[key][global.lang.currentLang].length * 16 + 30)
                    : -1
                this.dataDisplay[key] = row["DATADISPLAY"]
                this.group[key] = row["GROUP"]
                this.shownColumns[key] = row["SHOWNCOLUMNS"] == 1 ? true : false
            }
            if(this.doubleTable) {
                const secondRows = res.data.rows2
                this.secondTable.keys = []
                for (let row of secondRows) {
                    const key = row["KEYS"]
                    this.secondTable.keys.push(key)
                    this.secondTable.values[key] = key.toUpperCase()
                    this.secondTable.dataType[key] = row["DATATYPE"]
                    this.secondTable.sortMap[key] = row["SORTMAP"]
                    this.secondTable.text[key] = JSON.parse(row["TEXT"])
                    this.secondTable.align[key] = row["ALIGN"]
                    this.secondTable.width[key] = row["WIDTH"] == "tight" ?
                        (global.lang.currentLang === "en" ? this.secondTable.text[key][global.lang.currentLang].length * 8 + 30 : this.secondTable.text[key][global.lang.currentLang].length * 16 + 30)
                        : -1
                    this.secondTable.dataDisplay[key] = row["DATADISPLAY"]
                    this.secondTable.group[key] = row["GROUP"]
                }
            }
            callback(res.status)
        })
    },
    getReq(databaseName, callback) {
        this.loading = true
        global.comTool.getData("user/get", databaseName, res => {
            if(res.status !== "Success"){
                callback()
                return
            }
            if (res.data.length > 0) {
                this.data = res.data
            }
            this.loading = false
        })
    }
}