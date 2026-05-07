<template>
    <n-data-table :columns="tableColumn" :data="tableData" :single-line="false" :row-props="rowProps" style="height: calc(100% - 108px)">
        <template #empty>
            <n-empty :description="global.lang.getText('noData')"/>
        </template>
    </n-data-table>
</template>

<script setup lang="ts">
import type { DataRow } from "../types/dataTypes"
import { NDataTable, NEmpty } from "naive-ui"
import { computed, toRaw } from "vue"
import global from "../plugins/global"

const currentTableInfoPointer = computed(() => global.isChildTable ? global.databaseData!.table2Info : global.databaseData!.table1Info)

const tableColumn = computed(() => {
    const columns = []
    for(const columnDef of currentTableInfoPointer.value) {
        columns.push({
            key: columnDef.id,
            title: columnDef.title[global.lang.currentLang]
        })
    }
    return columns
})
const tableData = computed(() => global.databaseData!.dualTable && global.isChildTable ?
    JSON.parse(toRaw(global.databaseData!.tableData[global.selectedRow.primary as number][global.databaseData!.gridView ? 2 : 1]) as string) as DataRow[] : global.databaseData!.tableData)

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