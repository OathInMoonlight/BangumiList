import type { DynamicDBData } from "@/plugins/types"

const userData: DynamicDBData = {
    dbName: "",
    dbPath: "",
    gridView: false,
    doubleTable: false,
    timeStamp: false,
    firstStamp: null,
    secondStamp: null,
    table1Info: {},
    table2Info: {},

    table1Data: {},
    table2Data: {},

    loading: true,
    displayColumns: [],
    filterText: null,
    selctedRow: null
}

export default userData