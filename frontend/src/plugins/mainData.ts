import type { DynamicDBData } from "@/plugins/types"

const mainData: DynamicDBData = {
    dbName: "main",
    dbPath: "main.db",
    gridView: false,
    doubleTable: false,
    timeStamp: { enabled: false, firstStamp: null, secondStamp: null },
    table1Info: [],
    table2Info: [],

    tableData: [],
    sort1: { column: null, order: "-" },
    groupSort1: { column: null, order: "-" },
    sort2: { column: null, order: "-" },
    groupSort2: { column: null, order: "-" },

    loading: true,
    displayColumns1: [],
    displayColumns2: [],
    selctedRow1: null,
    selctedRow2: null,
    selectedChildTable: null
}

export default mainData