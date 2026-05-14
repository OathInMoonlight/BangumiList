<template>
    <n-card embedded style="height: calc(100% - 114px)" content-style="padding: 12px">
        <n-data-table :columns="tableColumn" :data="tableData" :bordered="false" :single-line="false" :row-props="rowProps" :pagination="pagination" :scroll-x="scrollX" flex-height style="height: 100%">
            <template #empty>
                <n-empty :description="global.lang.getText('noData')"/>
            </template>
        </n-data-table>
    </n-card>
</template>

<script setup lang="ts">
import type { DataRow } from "../types/dataTypes"
import { NCard, NDataTable, NEmpty, NFlex } from "naive-ui"
import { computed, h, reactive } from "vue"
import Tag from "./Tag.vue"
import Bool from "./Bool.vue"
import SortButton from "./SortButton.vue"
import global from "../plugins/global"
import languageTool from "../plugins/languageTool"
import searchAndSort from "../plugins/searchAndSort"

const currentTableInfoPointer = computed(() => global.isChildTable ? global.databaseData!.table2Info : global.databaseData!.table1Info)

const pageSizes = computed(() => [10, 25, 50, 100].map(pageSize => ({ label: `${pageSize} ${global.lang.getText("pageSize")}`, value: pageSize })))
const pagination = reactive({
  page: 1,
  pageSlot: 11,
  size: "large" as "large",
  pageSize: 25,
  showSizePicker: true,
  pageSizes: pageSizes,
  onChange: (page: number) => {
    pagination.page = page
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
  }
})
const columnWidths = computed(() => {
    const widths: { [ key: number ]: number} = {}
    for(const column of currentTableInfoPointer.value) {
        if(column.ifDisplay && (column.displayLang === "none" || column.displayLang === global.lang.currentLang)) {
            let maxWidth = 0
            if(column.dataType !== "bool") {
                const valueList = [column.title[global.lang.currentLang]]
                const rows = global.isChildTable ? JSON.parse(global.databaseData!.tableData[global.selectedRow.primary as number][global.databaseData!.gridView ? 2 : 1] as string) : global.databaseData!.tableData
                const base = (pagination.page - 1) * pagination.pageSize
                for(let i = base; i < base + pagination.pageSize && i < rows.length; i++) {
                    valueList.push(rows[i][column.id])
                }
                if(column.dataType === "number") {
                    maxWidth = Math.max(...valueList.map(value => String(value).length)) * 8 + 54
                } else {
                    maxWidth = Math.max(...valueList.map(value => languageTool.getTextLength(value))) * 8 + 54
                }
            }
            switch(column.dataType) {
                case "bool":
                    widths[column.id] = Math.min(Math.max(languageTool.getTextLength(column.title[global.lang.currentLang]) * 8 + 54, 56), 512)
                    break
                case "tag":
                    widths[column.id] = Math.min(maxWidth + 14, 512)
                    break
                case "number":
                    widths[column.id] = Math.min(Math.max(languageTool.getTextLength(column.title[global.lang.currentLang]) * 8 + 54, maxWidth), 512)
                    break
                default:
                    widths[column.id] = Math.min(maxWidth, 512)
            }
        }
    }
    return widths
})
const scrollX = computed(() => Object.values(columnWidths.value).reduce((accumulator, currentValue) => accumulator + currentValue, 0))
const tableColumn = computed(() => {
    const columns = []
    for(const column of currentTableInfoPointer.value) {
        if(column.ifDisplay && (column.displayLang === "none" || column.displayLang === global.lang.currentLang)) {
            columns.push({
                key: column.id,
                title: () => h(NFlex, { justify: "center", align: "center" }, () => [
                    h("p", { style: { "margin": 0 } }, [column.title[global.lang.currentLang]]),
                    h(SortButton, { columnId: column.id })
                ]),
                align: column.dataType === "paragraph" ? "left" : "center" as "left" | "center",
                titleAlign: "center" as "center",
                width: columnWidths.value[column.id],
                render: (row: DataRow) => {
                    switch(column.dataType) {
                        case "bool":
                            return h(Bool, { value: String(row[column.id]), valuePreset: column.valuePreset })
                        case "tag":
                            return h(Tag, { value: row[column.id] as string, valuePreset: column.valuePreset })
                        case "paragraph":
                            return h("p", { style: { "margin": 0, "word-wrap": "break-word", "white-space": "pre-line" } }, [row[column.id] as string])
                        default:
                            return h("p", { style: { "margin": 0 } }, [String(row[column.id])])
                    }
                }
            })
        }
    }
    return columns
})
const tableData = computed(() => global.isChildTable ? searchAndSort.childSorted : searchAndSort.primarySorted)

function rowProps(row: DataRow) {
    return {
        style: 'cursor: pointer;',
        onClick: () => {
            if(global.isChildTable) {
                global.selectedRow.child = row[0] - 1
                global.page = "row"
            } else {
                global.selectedRow.primary = row[0] - 1
                if(global.databaseData!.dualTable) {
                    global.isChildTable = true
                } else {
                    global.page = "row"
                }
            }
        }
    }
}
</script>