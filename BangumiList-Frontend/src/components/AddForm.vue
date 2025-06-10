<template>
    <v-tooltip :text="global.lang.text.plus[global.lang.currentLang]" location="bottom center">
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon="mdi-plus" @click="addItemDialog = true" />
        </template>
    </v-tooltip>

    <v-dialog v-model="addItemDialog" persistent>
        <v-card v-if="global.isMain.value">
            <div class="d-flex flex-row align-center pa-0 mt-4 ml-4 mr-4 mb-2">
                <v-text-field v-model="addDatabaseForm.databasePath" variant="outlined"
                              :label="global.tableData.text.databasePath[global.lang.currentLang]" hide-details class="mr-4" disabled />
                <v-text-field v-model="addDatabaseForm.databaseName" variant="outlined"
                              :label="global.tableData.text.databaseName[global.lang.currentLang]" hide-details />
                <label>&nbsp;.db</label>
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
            <div v-if="addDatabaseForm.timeStamp" class="d-flex flex-row justify-space-around ga-4 pa-0 ma-4">
                <v-select v-model="addDatabaseForm.firstTimeStamp" variant="outlined"
                          :label="global.lang.text.firstTimeStamp[global.lang.currentLang]" hide-details
                          :items="columnSortMaps" />
                <v-select v-model="addDatabaseForm.secondTimeStamp" variant="outlined"
                          :label="global.lang.text.secondTimeStamp[global.lang.currentLang]" hide-details
                          :items="columnSortMaps" />
            </div>
            <v-divider v-if="addDatabaseForm.timeStamp" />
            <div class="ma-4">
                <div v-for="(column, index) in addDatabaseForm.userDatabaseColumns" :key="index"
                     class="d-flex flex-row align-center ga-2 pa-0 mt-2">
                    <v-tooltip :text="global.lang.text.deleteColumn[global.lang.currentLang]" location="bottom center">
                        <template v-slot:activator="{ props }">
                            <v-btn v-if="index == 0" rounded="0" v-bind="props" icon="mdi-minus" disabled />
                            <v-btn v-else-if="index == 1 && addDatabaseForm.gridView" rounded="0" v-bind="props" icon="mdi-minus" disabled />
                            <v-btn v-else rounded="0" v-bind="props" icon="mdi-minus" @click="deleteColumn(index)" />
                        </template>
                    </v-tooltip>
                    <label>{{ global.lang.text.column[global.lang.currentLang] }} {{ index }}:</label>
                    <Columns v-if="index == 0" v-model="addDatabaseForm.userDatabaseColumns[0]"
                             :editable="[false, false, false, false, false, false, false, true]"
                             :items="[columnDataTypes, columnSortMaps, columnWidths, columnDefaultShow]" />
                    <Columns v-else-if="index == 1 && addDatabaseForm.gridView" v-model="addDatabaseForm.userDatabaseColumns[1]"
                             :editable="[false, false, false, false, false, false, false, true]"
                             :items="[columnDataTypes, columnSortMaps, columnWidths, columnDefaultShow]" />
                    <Columns v-else v-model="addDatabaseForm.userDatabaseColumns[index]"
                             :editable="[true, true, true, true, true, true, true, true]"
                             :items="[columnDataTypes, columnSortMaps, columnWidths, columnDefaultShow]" />
                </div>
                <v-tooltip :text="global.lang.text.addNewColumn[global.lang.currentLang]" location="bottom center">
                    <template v-slot:activator="{ props }">
                        <v-btn block rounded="0" v-bind="props" icon="mdi-plus" class="mt-4" @click="addNewColumn(1)" />
                    </template>
                </v-tooltip>
            </div>
            <v-divider v-if="addDatabaseForm.doubleTable" />
            <div v-if="addDatabaseForm.doubleTable" class="ma-4">
                <div v-for="(column, index) in addDatabaseForm.userDatabaseColumns2" :key="index"
                     class="d-flex flex-row align-center ga-2 pa-0 mt-2">
                    <v-tooltip :text="global.lang.text.deleteColumn[global.lang.currentLang]" location="bottom center">
                        <template v-slot:activator="{ props }">
                            <v-btn v-if="index == 0" rounded="0" v-bind="props" icon="mdi-minus" disabled />
                            <v-btn v-else-if="index == 1 && addDatabaseForm.gridView" rounded="0" v-bind="props" icon="mdi-minus" disabled />
                            <v-btn v-else rounded="0" v-bind="props" icon="mdi-minus" @click="deleteColumn(index)" />
                        </template>
                    </v-tooltip>
                    <label>{{ global.lang.text.column[global.lang.currentLang] }} {{ index }}:</label>
                    <Columns v-if="index == 0" v-model="addDatabaseForm.userDatabaseColumns2[0]"
                             :editable="[false, false, false, false, false, false, false, true]"
                             :items="[columnDataTypes, columnSortMaps, columnWidths, columnDefaultShow]" />
                    <Columns v-else-if="index == 1 && addDatabaseForm.gridView" v-model="addDatabaseForm.userDatabaseColumns2[1]"
                             :editable="[false, false, false, false, false, false, false, true]"
                             :items="[columnDataTypes, columnSortMaps, columnWidths, columnDefaultShow]" />
                    <Columns v-else v-model="addDatabaseForm.userDatabaseColumns2[index]"
                             :editable="[true, true, true, true, true, true, true, true]"
                             :items="[columnDataTypes, columnSortMaps, columnWidths, columnDefaultShow]" />
                </div>
                <v-tooltip :text="global.lang.text.addNewColumn[global.lang.currentLang]" location="bottom center">
                    <template v-slot:activator="{ props }">
                        <v-btn block rounded="0" v-bind="props" icon="mdi-plus" class="mt-4" @click="addNewColumn(2)" />
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
    <v-dialog v-model="checkAlert" max-width="512">
        <v-alert :title="global.lang.text.error[global.lang.currentLang]"
                 :text="checkAlertMessage" type="error" />
    </v-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from "vue"
import global from "@/plugins/global.js"
import Columns from "@/components/Columns.vue"

// 添加数据库对话框
const addItemDialog = ref(false)
function initAddDatabaseForm() {
    const form = {}
    if (global.isMain.value) {
        for (let key of global.tableData.keys) {
            if(key != "id"){
                form[key] = null
            }
        }
        form.databasePath = "/databases/"
        form.gridView = false
        form.doubleTable = false
        form.timeStamp = false
        form.firstTimeStamp = null
        form.secondTimeStamp = null
        form.userDatabaseColumns = []
        form.userDatabaseColumns2 = []

        const idColumn = {
            key: "id",
            dataType: "INTEGER PRIMARY KEY AUTOINCREMENT",
            sortMap: "id",
            text: { zh: "序号", ja: "番号", en: "ID" },
            width: "tight",
            defaultShow: true
        }
        form.userDatabaseColumns.push(idColumn)
        form.userDatabaseColumns2.push(idColumn)
    }
    return form
}
let addDatabaseForm = reactive(initAddDatabaseForm())
watch(() => addDatabaseForm.gridView, (newValue) => {
    if (newValue) {
        const newColumn = {
            key: "cover",
            dataType: "TEXT",
            sortMap: "cover",
            text: { zh: "封面", ja: "カバー", en: "Cover" },
            width: "flex",
            defaultShow: false
        }
        addDatabaseForm.userDatabaseColumns.splice(1, 0, newColumn)
        addDatabaseForm.userDatabaseColumns2.splice(1, 0, newColumn)
    }
    else{
        addDatabaseForm.userDatabaseColumns.splice(1, 1)
        addDatabaseForm.userDatabaseColumns2.splice(1, 1)
    }
})
function addNewColumn(table) {
    const newColumn = {
        key: null,
        dataType: null,
        sortMap: null,
        text: { zh: null, ja: null, en: null },
        width: null,
        defaultShow: true
    }
    if(table == 1){
        addDatabaseForm.userDatabaseColumns.push(newColumn)
    }
    else{
        addDatabaseForm.userDatabaseColumns2.push(newColumn)
    }
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

const checkAlert = ref(false)
let checkAlertMessage = null
function notNullCheck(value){
    if(Array.isArray(value) || typeof value == "object"){
        for(let index in value){
            if(index == "scondTimeStamp" || (index == "firstTimeStamp" && !addDatabaseForm.timeStamp)
            || (index == "userDatabaseColumns2" && !addDatabaseForm.doubleTable)){
                continue
            }
            if(!notNullCheck(value[index])){
                return false
            }
        }
        return true
    }
    return (value !== null && value !== undefined && value !== "") ? true : false
}
function noConflictCheck(columns) {
    const keys = []
    for(let column of columns){
        for(let key of keys){
            if(key == column.key){
                return false
            }
        }
        keys.push(column.key)
    }
    return true
}
function nameCheck(value){
    if(value.includes(" ") || value.includes("/") || value.includes("\\") || value.includes(":") ||
       value.includes("*") || value.includes("?") || value.includes("'") || value.includes("<") ||
       value.includes(">") || value.includes("|") || value.includes(".")){
        return false
    }
    return true
}
function formCheck(form){
    if(!notNullCheck(form)){
        return global.lang.text.notEmpty[global.lang.currentLang]
    }
    if(!noConflictCheck(form.userDatabaseColumns) || (form.doubleTable && !noConflictCheck(form.userDatabaseColumns2))){
        return global.lang.text.noConflict[global.lang.currentLang]
    }
    if(!nameCheck(form.databaseName)){
        return global.lang.text.notValidName[global.lang.currentLang]
    }
    for(let column of form.userDatabaseColumns){
        if(!nameCheck(column.key)){
            return global.lang.text.notValidName[global.lang.currentLang]
        }
    }
    if(form.doubleTable){
        for(let column of form.userDatabaseColumns2){
            if(!nameCheck(column.key)){
                return global.lang.text.notValidName[global.lang.currentLang]
            }
        }
    }
    return true
}

function addItemSubmit() {
    addItemDialog.value = false
    const checkResult = formCheck(addDatabaseForm)
    if(checkResult != true){
        checkAlertMessage = ref(checkResult)
        checkAlert.value = true
        return
    }
    global.tableData.insertReq(addDatabaseForm, () => {
        addDatabaseForm = reactive(initAddDatabaseForm())
    })
}
</script>