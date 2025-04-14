<template>
    <v-data-table items-per-page="-1" hide-default-footer fixed-header
        :no-data-text="$lang.text.noData[$lang.currentLang]" :headers="fileTableHeaders">
    </v-data-table>
</template>

<script setup>
import { computed } from "vue"
import fileList from "@/plugins/fileList"
import { useLang } from "@/plugins/useGlobal.js"
const lang = useLang()
const fileTableHeaders = computed(() => {
    var headers = []
    fileList.Keys.forEach(hkey => {
        headers.push({
            key: hkey, title: fileList.Text[hkey][lang.currentLang],
            align: fileList.Align[hkey], width: fileList.computeWidth(hkey, lang.currentLang)
        })
    })
    return headers
})
</script>