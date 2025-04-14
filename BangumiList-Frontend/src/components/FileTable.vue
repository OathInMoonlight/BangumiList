<template>
    <v-data-table items-per-page="-1" hide-default-footer fixed-header :no-data-text="$lang.text.noData"
        :headers="fileTableHeaders">
    </v-data-table>
</template>

<script setup>
import { computed } from "vue"
import { useLang } from "@/plugins/useGlobal.js"
const lang = useLang()
const fileTableHeaders = computed(() => [
    { title: lang.text["id"], key: "id", align: "center", width: lang.currentLang==="en"?lang.text.id.length*8+50:lang.text.id.length*16+50 },
    { title: lang.text.fileName, key: "fileName", align: "center", width: 256 },
    { title: lang.text.enableGrid, key: "enableGrid", align: "center", width: lang.currentLang==="en"?lang.text.enableGrid.length*8+50:lang.text.enableGrid.length*16+50 },
    { title: lang.text.enableDoubleTable, key: "enableDoubleTable", align: "center", width: lang.currentLang==="en"?lang.text.enableDoubleTable.length*8+50:lang.text.enableDoubleTable.length*16+50 },
    { title: lang.text.enableTimeStamp, key: "enableTimeStamp", align: "center", width: lang.currentLang==="en"?lang.text.enableTimeStamp.length*8+50:lang.text.enableTimeStamp.length*16+50 },
    { title: lang.text.filePath, key: "filePath", align: "start" }
])
</script>