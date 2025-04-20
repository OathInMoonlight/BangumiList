<template>
    <v-data-table items-per-page="-1" hide-default-footer fixed-header :loading="$tableData.loading"
        :loading-text="$lang.text.loading[$lang.currentLang]" :no-data-text="$lang.text.noData[$lang.currentLang]"
        :headers="databaseTableHeaders" :items="$tableData.data" />
</template>

<script setup>
import { ref, computed } from "vue"
import { useLang, useTableData, useHttp } from "@/plugins/useGlobal.js"

const lang = useLang()
const tableData = useTableData()
const http = useHttp()
const databaseTableHeaders = computed(() => {
    var headers = []
    tableData.keys.forEach(hkey => {
        headers.push({
            key: hkey, value: tableData.values[hkey], title: tableData.text[hkey][lang.currentLang],
            align: tableData.align[hkey], width: tableData.computeWidth(hkey, lang.currentLang)
        })
    })
    return headers
})
tableData.loading = true
http.getData("update", rdata => {
    if (rdata.length > 0) {
        tableData.data = rdata
    }
    tableData.loading = false
})
</script>