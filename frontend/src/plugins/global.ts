import type { TableInfo, TableData } from "./transportTypes"
import type { Languages, DynamicDBData, Http } from "@/plugins/types"
import type { Ref, ComputedRef } from "vue"
import { ref, reactive, computed } from "vue"
import languages from "@/plugins/languages"
import mainData from "@/plugins/mainData"
import userData from "@/plugins/userData"
import http from "@/plugins/http"

type Size = "small" | "default" | "large"

interface VisionOptions {
    globalZoom: number,
    primaryColor: string,
    contentsType: "grid" | "table",
    gridSize: Size,
    filterText: string | null
}

interface ColumnIndexMap {
    id: number,
    key: number,
    cover: number,
    secondTable: number
}

interface Global {
    lang: Languages,
    view: VisionOptions,

    isMain: Ref<boolean, boolean>,
    mainData: DynamicDBData,
    userData: DynamicDBData,
    currentData: ComputedRef<DynamicDBData>,
    colIdMap: ComputedRef<ColumnIndexMap>,

    isChildTable: Ref<boolean, boolean>,
    currentTableInfo: ComputedRef<TableInfo>,
    currentTable: ComputedRef<TableData>,

    trans: Http
}

const global: Global = {
    lang: reactive(languages),
    view: reactive({
        globalZoom: 1,
        primaryColor: "blue",
        contentsType: "table",
        gridSize: "default",
        filterText: null
    }),

    isMain: ref(true),
    mainData: reactive(mainData),
    userData: reactive(userData),
    currentData: computed(() => global.isMain.value ? global.mainData : global.userData),
    colIdMap: computed(() => {
        return {
            id: 0,
            key: 1,
            cover: global.currentData.value.gridView ? 2 : 1,
            secondTable: (global.currentData.value.gridView ? 2 : 1) +
                (global.currentData.value.doubleTable ? 1 : 0)
        }
    }),

    isChildTable: ref(false),
    currentTableInfo: computed(() => !global.isChildTable.value ?
        global.currentData.value.table1Info : global.currentData.value.table2Info),
    currentTable: computed(() => !global.isChildTable.value ?
        global.currentData.value.tableData : global.currentData.value.selectedChildTable as TableData),

    trans: reactive(http)
}

export default global