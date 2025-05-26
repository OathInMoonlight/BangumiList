import global from "@/plugins/global.js"

export default {
    gridView: false,
    doubleTable: false,
    timeStamp: false,

    keys: [],
    values: {},
    dataType: {},
    sortMap: {},
    text: {},
    align: {},
    width: {},
    dataDisplay: {},
    group: {},

    loading: true,
    shownColumns: {},
    data: [],
    selectedRow: null,
    filterText: null,

    getInfoReq() {
        global.comTool.getData("user/info/get", res => {
            for (let row of res) {
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
    getReq() {
        this.loading = true
        global.comTool.getData("user/get", res => {
            if (res.length > 0) {
                this.data = res
            }
            this.loading = false
        })
    }
}