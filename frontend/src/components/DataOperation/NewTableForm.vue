<template>
    <v-card class="pa-4 ga-4">
        <!-- 数据库名 -->
        <div class="d-flex flex-row align-center ga-4">
            <v-text-field v-model="tableForm.dbPath" variant="outlined" hide-details
                          :label="global.lang.getText('databaseName')" disabled />
            <v-text-field v-model="localDBName" variant="outlined" hide-details
                          :label="global.lang.getText('databasePath')" />
        </div>
        <!-- 数据库选项 -->
        <div class="d-flex flex-row align-center ga-4">
            <v-switch v-model="tableForm.gridView" :color="global.view.primaryColor"
                      :label="global.lang.getText('gridView')" hide-details />
            <v-switch v-model="tableForm.doubleTable" :color="global.view.primaryColor"
                      :label="global.lang.getText('doubleTable')" hide-details />
            <v-switch v-model="tableForm.timeStamp.enabled" :color="global.view.primaryColor"
                      :label="global.lang.getText('timeStamp')" hide-details />
        </div>
    </v-card>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue"
import global from "@/plugins/global"
import NewColumn from "@/components/DataOperation/NewColumn.vue"
import type { DatabaseInfo } from "@/plugins/transportTypes"

const tableForm = defineModel<DatabaseInfo>({ default: {
    dbName: "",
    dbPath: "/databases/",
    gridView: false,
    doubleTable: false,
    timeStamp: { enabled: false, firstStamp: null, secondStamp: null },
    table1Info: [],
    table2Info: []
} })
const localDBName = ref("")
watch(localDBName, (newDBName) => {
    tableForm.value.dbName = newDBName
    const lastSlashIndex = tableForm.value.dbPath.lastIndexOf("/")
    tableForm.value.dbPath = (lastSlashIndex >= 0 ?
        tableForm.value.dbPath.substring(0, lastSlashIndex + 1) : "") + newDBName + ".db"
})
</script>