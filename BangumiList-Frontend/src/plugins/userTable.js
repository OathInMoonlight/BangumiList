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

    getInfoReq(callback) {
        global.comTool.getData("user/info/get", res => {
            if(res.status !== "Success"){
                callback()
                return
            }
            this.gridView = res.data.settings.gridView
            this.doubleTable = res.data.settings.doubleTable
            this.timeStamp = res.data.settings.timeStamp
            this.firstTimeStamp = res.data.settings.firstTimeStamp
            this.secondTimeStamp = res.data.settings.secondTimeStamp
            const rows = res.data.rows
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
        })
    },
    getReq(callback) {
        this.loading = true
        global.comTool.getData("user/get", res => {
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