<template>
    <v-toolbar density="comfortable">
        <div class="w-100 d-flex flex-row justify-space-between align-center">
            <!-- 左侧标题 -->
            <div class="d-flex align-center ml-4">
                <label v-if="!$isDatabase.value" class="text-h6">{{ $lang.text.databaseList[$lang.currentLang]
                    }}</label>
                <v-tooltip v-else :text="$lang.text.backToList[$lang.currentLang]">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" variant="outlined">{{ $isDatabase }}</v-btn>
                    </template>
                </v-tooltip>
            </div>
            <!-- 工具栏 -->
            <div class="d-flex align-center mr-2">
                <v-tooltip :text="$lang.text.plus[$lang.currentLang]">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" icon="mdi-plus" @click="addItemDialog = true" />
                    </template>
                </v-tooltip>
                <v-tooltip :text="$lang.text.import[$lang.currentLang]">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" icon="mdi-import" />
                    </template>
                </v-tooltip>
                <v-tooltip :text="$lang.text.export[$lang.currentLang]">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" icon="mdi-export" />
                    </template>
                </v-tooltip>
                <v-tooltip :text="$lang.text.delete[$lang.currentLang]">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" icon="mdi-delete" @click="deleteItemButton" />
                    </template>
                </v-tooltip>
                <v-tooltip :text="$lang.text.edit[$lang.currentLang]">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" icon="mdi-square-edit-outline" />
                    </template>
                </v-tooltip>
            </div>
        </div>
    </v-toolbar>

    <!-- 添加表单 -->
    <v-dialog persistent max-width="512" v-model="addItemDialog">
        <v-card>
            <div class="ma-4">
                <v-text-field variant="outlined" :label="$tableData.text.databaseName[$lang.currentLang]"
                    v-model="addDatabaseForm.databaseName" hide-details />
                <v-checkbox :color="$primaryColor.value" :label="$tableData.text.enableGrid[$lang.currentLang]"
                    v-model="addDatabaseForm.enableGrid" hide-details />
                <v-checkbox :color="$primaryColor.value" :label="$tableData.text.enableDoubleTable[$lang.currentLang]"
                    v-model="addDatabaseForm.enableDoubleTable" hide-details />
                <v-checkbox :color="$primaryColor.value" :label="$tableData.text.enableTimeStamp[$lang.currentLang]"
                    v-model="addDatabaseForm.enableTimeStamp" hide-details />
            </div>
            <div class="d-flex flex-row-reverse ma-4">
                <v-btn size="large" @click="addItemSubmit" :color="$primaryColor.value">{{
                    $lang.text.submit[$lang.currentLang]
                }}</v-btn>
                <v-btn size="large" @click="addItemDialog = false" class="mr-4">{{ $lang.text.cancel[$lang.currentLang]
                    }}</v-btn>
            </div>
        </v-card>
    </v-dialog>
    <!-- 删除表单 -->
    <v-dialog max-width="512" v-model="deleteItemAlert">
        <v-alert :title="$lang.text.error[$lang.currentLang]" :text="$lang.text.deleteErrorText[$lang.currentLang]"
            type="warning" />
    </v-dialog>
    <v-dialog persistent max-width="512" v-model="deleteItemDialog">
        <v-card>
            <div class="ma-4">
                <label>{{ $lang.text.deleteConfirm1[$lang.currentLang] }} "{{ deleteRowName }}" {{
                    $lang.text.deleteConfirm2[$lang.currentLang] }}</label>
            </div>
            <div class="d-flex flex-row-reverse ma-4">
                <v-btn size="large" @click="deleteItemSubmit" :color="$primaryColor.value">{{
                    $lang.text.confirm[$lang.currentLang]
                }}</v-btn>
                <v-btn size="large" @click="deleteItemDialog = false" class="mr-4">{{
                    $lang.text.cancel[$lang.currentLang]
                }}</v-btn>
            </div>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, reactive } from "vue"
import { useComu, useTableData } from "@/plugins/useGlobal.js"

const comu = useComu()
const tableData = useTableData()

// 添加数据库对话框
const addItemDialog = ref(false)
const initAddDatabaseForm = {
    databaseName: null,
    databasePath: null,
    enableGrid: false,
    enableDoubleTable: false,
    enableTimeStamp: false
}
var addDatabaseForm = reactive(JSON.parse(JSON.stringify(initAddDatabaseForm)))
function addItemSubmit() {
    tableData.loading = true
    addItemDialog.value = false
    comu.postData("addDatabase", addDatabaseForm, rdata => {
        console.log(rdata)
        addDatabaseForm = reactive(JSON.parse(JSON.stringify(initAddDatabaseForm)))
        tableData.updateReq()
        tableData.loading = false
    })
}

// 删除数据库对话框
const deleteItemAlert = ref(false)
const deleteItemDialog = ref(false)
const deleteRowName = ref(null)
function deleteItemButton() {
    if (tableData.selectedRow == null) {
        deleteItemAlert.value = true
    }
    else {
        tableData.data.forEach(row => {
            if (row[tableData.values[tableData.keys[0]]] == tableData.selectedRow) {
                deleteRowName.value = row[tableData.values[tableData.keys[1]]]
                return
            }
        })
        deleteItemDialog.value = true
    }
}
function deleteItemSubmit() {
    tableData.loading = true
    deleteItemDialog.value = false
    comu.postData("deleteDatabase", { id: tableData.selectedRow }, rdata => {
        console.log(rdata)
        tableData.updateReq()
        tableData.loading = false
    })
}
</script>