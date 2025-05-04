<template>
    <v-toolbar density="comfortable">
        <div class="w-100 d-flex flex-row justify-space-between align-center">
            <!-- 左侧标题 -->
            <div class="d-flex align-center ml-4">
                <label v-if="!global.isDatabase.value" class="text-h6">{{ global.lang.text.databaseList[global.lang.currentLang]
                    }}</label>
                <v-tooltip v-else :text="global.lang.text.backToList[global.lang.currentLang]">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" variant="outlined">{{ global.isDatabase }}</v-btn>
                    </template>
                </v-tooltip>
            </div>
            <!-- 工具栏 -->
            <div class="d-flex align-center mr-2">
                <v-tooltip :text="global.lang.text.plus[global.lang.currentLang]">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" icon="mdi-plus" @click="addItemDialog = true" />
                    </template>
                </v-tooltip>
                <v-tooltip :text="global.lang.text.import[global.lang.currentLang]">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" icon="mdi-import" />
                    </template>
                </v-tooltip>
                <v-tooltip :text="global.lang.text.export[global.lang.currentLang]">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" icon="mdi-export" />
                    </template>
                </v-tooltip>
                <v-tooltip :text="global.lang.text.delete[global.lang.currentLang]">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" icon="mdi-delete" @click="deleteItemButton" />
                    </template>
                </v-tooltip>
                <v-tooltip :text="global.lang.text.edit[global.lang.currentLang]">
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
                <v-text-field variant="outlined" :label="global.tableData.text.databaseName[global.lang.currentLang]"
                    v-model="addDatabaseForm.databaseName" hide-details />
                <v-checkbox :color="global.primaryColor.value" :label="global.tableData.text.enableGrid[global.lang.currentLang]"
                    v-model="addDatabaseForm.enableGrid" hide-details />
                <v-checkbox :color="global.primaryColor.value" :label="global.tableData.text.enableDoubleTable[global.lang.currentLang]"
                    v-model="addDatabaseForm.enableDoubleTable" hide-details />
                <v-checkbox :color="global.primaryColor.value" :label="global.tableData.text.enableTimeStamp[global.lang.currentLang]"
                    v-model="addDatabaseForm.enableTimeStamp" hide-details />
            </div>
            <div class="d-flex flex-row-reverse ma-4">
                <v-btn size="large" @click="addItemSubmit" :color="global.primaryColor.value">{{
                    global.lang.text.submit[global.lang.currentLang]
                }}</v-btn>
                <v-btn size="large" @click="addItemDialog = false" class="mr-4">{{ global.lang.text.cancel[global.lang.currentLang]
                    }}</v-btn>
            </div>
        </v-card>
    </v-dialog>
    <!-- 删除表单 -->
    <v-dialog max-width="512" v-model="deleteItemAlert">
        <v-alert :title="global.lang.text.error[global.lang.currentLang]" :text="global.lang.text.deleteErrorText[global.lang.currentLang]"
            type="warning" />
    </v-dialog>
    <v-dialog persistent max-width="512" v-model="deleteItemDialog">
        <v-card>
            <div class="ma-4">
                <label>{{ global.lang.text.deleteConfirm1[global.lang.currentLang] }} "{{ deleteRowName }}" {{
                    global.lang.text.deleteConfirm2[global.lang.currentLang] }}</label>
            </div>
            <div class="d-flex flex-row-reverse ma-4">
                <v-btn size="large" @click="deleteItemSubmit" :color="global.primaryColor.value">{{
                    global.lang.text.confirm[global.lang.currentLang]
                }}</v-btn>
                <v-btn size="large" @click="deleteItemDialog = false" class="mr-4">{{
                    global.lang.text.cancel[global.lang.currentLang]
                }}</v-btn>
            </div>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, reactive } from "vue"
import global from "@/plugins/global.js"

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
    global.tableData.loading = true
    addItemDialog.value = false
    global.comTool.postData("addDatabase", addDatabaseForm, rdata => {
        console.log(rdata)
        addDatabaseForm = reactive(JSON.parse(JSON.stringify(initAddDatabaseForm)))
        global.tableData.updateReq()
        global.tableData.loading = false
    })
}

// 删除数据库对话框
const deleteItemAlert = ref(false)
const deleteItemDialog = ref(false)
const deleteRowName = ref(null)
function deleteItemButton() {
    if (global.tableData.selectedRow == null) {
        deleteItemAlert.value = true
    }
    else {
        global.tableData.data.forEach(row => {
            if (row[global.tableData.values[global.tableData.keys[0]]] == global.tableData.selectedRow) {
                deleteRowName.value = row[global.tableData.values[global.tableData.keys[1]]]
                return
            }
        })
        deleteItemDialog.value = true
    }
}
function deleteItemSubmit() {
    global.tableData.loading = true
    deleteItemDialog.value = false
    global.comTool.postData("deleteDatabase", { id: global.tableData.selectedRow }, rdata => {
        console.log(rdata)
        global.tableData.updateReq()
        global.tableData.loading = false
    })
}
</script>