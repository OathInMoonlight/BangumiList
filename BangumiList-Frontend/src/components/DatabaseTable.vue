<template>
    <TableComponent :loading="$tableData.loading" :tableHeaders="databaseTableHeaders" :tableData="$tableData.data" @selectRow="selectRow"/>
</template>

<script setup>
import TableComponent from "@/components/TableComponent.vue"
import { computed } from "vue"
import { useLang, useTableData } from "@/plugins/useGlobal.js"

const lang = useLang()
const tableData = useTableData()
const databaseTableHeaders = computed(() => {
    var headers = []
    tableData.keys.forEach(hkey => {
        headers.push({
            key: hkey, value: tableData.values[hkey], text: tableData.text[hkey][lang.currentLang],
            align: tableData.align[hkey], width: tableData.computeWidth(hkey, lang.currentLang)
        })
    })
    return headers
})
tableData.updateReq()

var selectedRow = null
function selectRow(id) {
    selectedRow = id
    console.log("Selected row ID:", id)
}
</script>