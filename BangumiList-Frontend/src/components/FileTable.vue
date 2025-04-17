<template>
    <v-data-table items-per-page="-1" hide-default-footer fixed-header :loading="$tableData.loading"
        :no-data-text="$lang.text.noData[$lang.currentLang]" :headers="fileTableHeaders" />
</template>

<script setup>
import { computed } from "vue"
import { useLang, useTableData } from "@/plugins/useGlobal.js"

const lang = useLang()
const fileTable = useTableData()
const fileTableHeaders = computed(() => {
    var headers = []
    fileTable.Keys.forEach(hkey => {
        headers.push({
            key: hkey, title: fileTable.Text[hkey][lang.currentLang],
            align: fileTable.Align[hkey], width: fileTable.computeWidth(hkey, lang.currentLang)
        })
    })
    return headers
})
</script>