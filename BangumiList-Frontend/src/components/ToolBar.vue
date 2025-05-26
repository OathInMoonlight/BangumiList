<template>
    <v-toolbar density="comfortable">
        <div class="w-100 d-flex flex-row justify-space-between align-center">
            <!-- 左侧标题 -->
            <div class="d-flex align-center ml-4">
                <label v-if="global.isMain.value" class="text-h6">{{
                    global.lang.text.databaseList[global.lang.currentLang]
                }}</label>
                <v-tooltip v-else :text="global.lang.text.backToList[global.lang.currentLang]">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" variant="outlined">
                            {{ global.isMain }}
                        </v-btn>
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
    <v-dialog v-model="addItemDialog" persistent>
        <v-card v-if="global.isMain.value">
            <div class="d-flex flex-row align-center pa-0 mt-4 ml-4 mr-4 mb-2">
                <v-text-field v-model="addDatabaseForm.databasePath" variant="outlined"
                              :label="global.tableData.text.databasePath[global.lang.currentLang]" hide-details class="mr-4" disabled />
                <v-text-field v-model="addDatabaseForm.databaseName" variant="outlined"
                              :label="global.tableData.text.databaseName[global.lang.currentLang]" hide-details />
                <label>.db</label>
            </div>
            <div class="d-flex flex-row justify-space-around pa-0 ml-4 mr-4 mb-2">
                <v-switch v-model="addDatabaseForm.gridView" :color="global.primaryColor.value"
                          :label="global.tableData.text.gridView[global.lang.currentLang]" hide-details />
                <v-switch v-model="addDatabaseForm.doubleTable" :color="global.primaryColor.value"
                          :label="global.tableData.text.doubleTable[global.lang.currentLang]" hide-details />
                <v-switch v-model="addDatabaseForm.timeStamp" :color="global.primaryColor.value"
                          :label="global.tableData.text.timeStamp[global.lang.currentLang]" hide-details />
            </div>
            <v-divider />
            <div class="ma-4">
                <div class="d-flex flex-row align-center ga-2 pa-0 mt-2">
                    <v-btn rounded="0" icon="mdi-minus" disabled @click="deleteColumn(0)" />
                    <label>{{ global.lang.text.column[global.lang.currentLang] }} 0:</label>
                    <v-text-field model-value="id" variant="outlined"
                                  :label="global.lang.text.columnKey[global.lang.currentLang]" hide-details disabled />
                    <v-select model-value="INTEGER PRIMARY KEY AUTOINCREMENT" variant="outlined"
                              :label="global.lang.text.columnType[global.lang.currentLang]" hide-details disabled />
                    <v-select model-value="id" variant="outlined"
                              :label="global.lang.text.columnSortMap[global.lang.currentLang]" hide-details disabled />
                    <v-text-field model-value="序号" variant="outlined"
                                  :label="global.lang.text.columnNameZH[global.lang.currentLang]" hide-details disabled />
                    <v-text-field model-value="番号" variant="outlined"
                                  :label="global.lang.text.columnNameJA[global.lang.currentLang]" hide-details disabled />
                    <v-text-field model-value="ID" variant="outlined"
                                  :label="global.lang.text.columnNameEN[global.lang.currentLang]" hide-details disabled />
                    <v-select :model-value="global.lang.text.tight[global.lang.currentLang]" variant="outlined"
                              :label="global.lang.text.columnWidth[global.lang.currentLang]" hide-details disabled />
                    <v-select :model-value="global.lang.text.true[global.lang.currentLang]" variant="outlined"
                              :label="global.lang.text.columnDefaultShow[global.lang.currentLang]" hide-details
                              :items="columnDefaultShow" />
                </div>
                <div v-for="(column, index) in addDatabaseForm.userDatabaseColumns" :key="index"
                     class="d-flex flex-row align-center ga-2 pa-0 mt-2">
                    <v-tooltip :text="global.lang.text.deleteColumn[global.lang.currentLang]">
                        <template v-slot:activator="{ props }">
                            <v-btn rounded="0" v-bind="props" icon="mdi-minus" @click="deleteColumn(index)" />
                        </template>
                    </v-tooltip>
                    <label>{{ global.lang.text.column[global.lang.currentLang] }} {{ index + 1 }}:</label>
                    <v-text-field v-model="column.key" variant="outlined"
                                  :label="global.lang.text.columnKey[global.lang.currentLang]" hide-details />
                    <v-select v-model="column.dataType" variant="outlined"
                              :label="global.lang.text.columnType[global.lang.currentLang]" hide-details
                              :items="columnDataTypes" />
                    <v-select v-model="column.sortMap" variant="outlined" :no-data-text="global.lang.text.noData[global.lang.currentLang]"
                              :label="global.lang.text.columnSortMap[global.lang.currentLang]" hide-details
                              :items="columnSortMaps" />
                    <v-text-field v-model="column.text.zh" variant="outlined"
                                  :label="global.lang.text.columnNameZH[global.lang.currentLang]" hide-details />
                    <v-text-field v-model="column.text.ja" variant="outlined"
                                  :label="global.lang.text.columnNameJA[global.lang.currentLang]" hide-details />
                    <v-text-field v-model="column.text.en" variant="outlined"
                                  :label="global.lang.text.columnNameEN[global.lang.currentLang]" hide-details />
                    <v-select v-model="column.width" variant="outlined"
                              :label="global.lang.text.columnWidth[global.lang.currentLang]" hide-details
                              :items="columnWidths" />
                    <v-select v-model="column.defaultShow" variant="outlined"
                              :label="global.lang.text.columnDefaultShow[global.lang.currentLang]" hide-details
                              :items="columnDefaultShow" />
                </div>
                <v-tooltip :text="global.lang.text.addNewColumn[global.lang.currentLang]">
                    <template v-slot:activator="{ props }">
                        <v-btn block rounded="0" v-bind="props" icon="mdi-plus" class="mt-4" @click="addNewColumn" />
                    </template>
                </v-tooltip>
            </div>
            <div class="d-flex flex-row-reverse ma-4">
                <v-btn size="large" :color="global.primaryColor.value" @click="addItemSubmit">
                    {{ global.lang.text.submit[global.lang.currentLang] }}
                </v-btn>
                <v-btn size="large" class="mr-4" @click="addItemDialog = false">
                    {{ global.lang.text.cancel[global.lang.currentLang] }}
                </v-btn>
            </div>
        </v-card>
    </v-dialog>
    <!-- 删除表单 -->
    <v-dialog v-model="deleteItemAlert" max-width="512">
        <v-alert :title="global.lang.text.error[global.lang.currentLang]"
                 :text="global.lang.text.deleteErrorText[global.lang.currentLang]" type="warning" />
    </v-dialog>
    <v-dialog v-model="deleteItemDialog" persistent max-width="512">
        <v-card>
            <div class="ma-4">
                <label>{{ global.lang.text.deleteConfirm1[global.lang.currentLang] }} "{{ deleteRowName }}" {{
                    global.lang.text.deleteConfirm2[global.lang.currentLang] }}</label>
            </div>
            <div class="d-flex flex-row-reverse ma-4">
                <v-btn size="large" :color="global.primaryColor.value" @click="deleteItemSubmit">
                    {{ global.lang.text.confirm[global.lang.currentLang] }}
                </v-btn>
                <v-btn size="large" class="mr-4" @click="deleteItemDialog = false">
                    {{ global.lang.text.cancel[global.lang.currentLang] }}
                </v-btn>
            </div>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, reactive, computed } from "vue"
import global from "@/plugins/global.js"

// function notNullCheck(value){
//     return (value != null && value != undefined && value != "") ? true : "This field cannot be empty"
// }
// function noConflictCheck(value) {
//     if (global.tableData.keys.includes(value)) {
//         return "This key already exists"
//     }
//     return true
// }

// 添加数据库对话框
const addItemDialog = ref(false)
function initAddDatabaseForm() {
    const form = {}
    if (global.isMain.value) {
        for (let key of global.tableData.keys) {
            form[key] = null
        }
        form.databasePath = "/databases/"
        form.userDatabaseColumns = []
    }
    return form
}
let addDatabaseForm = reactive(initAddDatabaseForm())
function addNewColumn() {
    addDatabaseForm.userDatabaseColumns.push({
        key: null,
        dataType: null,
        sortMap: null,
        text: { zh: null, ja: null, en: null },
        width: null,
        defaultShow: true
    })
}
function deleteColumn(index) {
    addDatabaseForm.userDatabaseColumns.splice(index, 1)
}
const columnDataTypes = ["INTEGER", "REAL", "BOOLEAN", "TEXT"]
const columnSortMaps = computed(() => {
    const keys = []
    for (let column of addDatabaseForm.userDatabaseColumns) {
        if (column.key != null && column.key != "") {
            keys.push(column.key)
        }
    }
    return keys
})
const columnWidths = computed(() => {
    return [{ title: global.lang.text.tight[global.lang.currentLang], value: "tight" },
        { title: global.lang.text.flex[global.lang.currentLang], value: "flex" }]
})
const columnDefaultShow = computed(() => {
    return [{ title: global.lang.text.true[global.lang.currentLang], value: true },
        { title: global.lang.text.false[global.lang.currentLang], value: false }]
})
function addItemSubmit() {
    addItemDialog.value = false
    global.comTool.postData("main/insert", Object.fromEntries(Object.entries(addDatabaseForm).map(([key, value]) => [global.tableData.values[key], value])), () => {
        addDatabaseForm = reactive(initAddDatabaseForm())
        global.tableData.getReq()
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
        for (let row of global.tableData.data) {
            if (row[global.tableData.values[global.tableData.keys[0]]] == global.tableData.selectedRow) {
                deleteRowName.value = row[global.tableData.values[global.tableData.keys[1]]]
                break
            }
        }
        deleteItemDialog.value = true
    }
}
function deleteItemSubmit() {
    deleteItemDialog.value = false
    global.comTool.postData("main/delete", { id: global.tableData.selectedRow }, () => {
        global.tableData.selectedRow = null
        global.tableData.getReq()
    })
}
</script>