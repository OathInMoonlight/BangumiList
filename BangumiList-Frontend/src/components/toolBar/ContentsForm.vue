<template>
    <v-card v-if="global.isMain.value">
        <!-- 数据库名 -->
        <div class="d-flex flex-row align-center pa-0 mt-4 ml-4 mr-4 mb-2">
            <v-text-field v-model="contentsForm.databasePath" variant="outlined"
                          :label="global.tableData.text.databasePath[global.lang.currentLang]" hide-details class="mr-4" disabled />
            <v-text-field v-model="contentsForm.databaseName" variant="outlined"
                          :label="global.tableData.text.databaseName[global.lang.currentLang]" hide-details />
            <label>&nbsp;.db</label>
        </div>
        <!-- 数据库选项 -->
        <div class="d-flex flex-row justify-space-around pa-0 ml-4 mr-4 mb-2">
            <v-switch v-model="contentsForm.gridView" :color="global.primaryColor.value"
                      :label="global.lang.text.gridView[global.lang.currentLang]" hide-details />
            <v-switch v-model="contentsForm.doubleTable" :color="global.primaryColor.value"
                      :label="global.lang.text.doubleTable[global.lang.currentLang]" hide-details />
            <v-switch v-model="contentsForm.timeStamp" :color="global.primaryColor.value"
                      :label="global.lang.text.timeStamp[global.lang.currentLang]" hide-details />
        </div>
        <v-divider />
        <!-- 时间戳选项 -->
        <div v-if="contentsForm.timeStamp" class="d-flex flex-row justify-space-around ga-4 pa-0 ma-4">
            <v-select v-model="contentsForm.firstTimeStamp" variant="outlined"
                      :label="global.lang.text.firstTimeStamp[global.lang.currentLang]" hide-details
                      :items="columnSortMaps" />
            <v-select v-model="contentsForm.secondTimeStamp" variant="outlined"
                      :label="global.lang.text.secondTimeStamp[global.lang.currentLang]" hide-details
                      :items="columnSortMaps" />
        </div>
        <v-divider v-if="contentsForm.timeStamp" />
        <!-- 第一表列 -->
        <div class="ma-4">
            <div v-for="(column, index) in contentsForm.userDatabaseColumns" :key="index"
                 class="d-flex flex-row align-center ga-2 pa-0 mt-2">
                <!-- 删除列 -->
                <v-tooltip :text="global.lang.text.deleteColumn[global.lang.currentLang]" location="bottom center">
                    <template v-slot:activator="{ props }">
                        <v-btn v-if="index == 0" rounded="0" v-bind="props" icon="mdi-minus" disabled />
                        <v-btn v-else-if="index == 1 && contentsForm.gridView" rounded="0" v-bind="props" icon="mdi-minus" disabled />
                        <v-btn v-else rounded="0" v-bind="props" icon="mdi-minus" @click="deleteColumn(1, index)" />
                    </template>
                </v-tooltip>
                <!-- 列信息 -->
                <label>{{ global.lang.text.column[global.lang.currentLang] }} {{ index }}:</label>
                <Columns v-if="index == 0" v-model="contentsForm.userDatabaseColumns[0]"
                         :editable="[false, false, false, false, false, false, false, true]"
                         :items="[columnDataTypes, columnSortMaps, columnWidths, columnDefaultShow]"
                         :is-second="false" />
                <Columns v-else-if="index == 1 && contentsForm.gridView" v-model="contentsForm.userDatabaseColumns[1]"
                         :editable="[false, false, false, false, false, false, false, true]"
                         :items="[columnDataTypes, columnSortMaps, columnWidths, columnDefaultShow]"
                         :is-second="false" />
                <Columns v-else v-model="contentsForm.userDatabaseColumns[index]"
                         :editable="[true, true, true, true, true, true, true, true]"
                         :items="[columnDataTypes, columnSortMaps, columnWidths, columnDefaultShow]"
                         :is-second="false" />
            </div>
            <!-- 添加新列 -->
            <v-tooltip :text="global.lang.text.addNewColumn[global.lang.currentLang]" location="bottom center">
                <template v-slot:activator="{ props }">
                    <v-btn block rounded="0" v-bind="props" icon="mdi-plus" class="mt-4" @click="addNewColumn(1)" />
                </template>
            </v-tooltip>
        </div>
        <v-divider v-if="contentsForm.doubleTable" />
        <!-- 第二表列 -->
        <div v-if="contentsForm.doubleTable" class="ma-4">
            <div v-for="(column, index) in contentsForm.userDatabaseColumns2" :key="index"
                 class="d-flex flex-row align-center ga-2 pa-0 mt-2">
                <!-- 删除列 -->
                <v-tooltip :text="global.lang.text.deleteColumn[global.lang.currentLang]" location="bottom center">
                    <template v-slot:activator="{ props }">
                        <v-btn v-if="index == 0" rounded="0" v-bind="props" icon="mdi-minus" disabled />
                        <v-btn v-else-if="index == 1 && contentsForm.gridView" rounded="0" v-bind="props" icon="mdi-minus" disabled />
                        <v-btn v-else rounded="0" v-bind="props" icon="mdi-minus" @click="deleteColumn(2, index)" />
                    </template>
                </v-tooltip>
                <!-- 列信息 -->
                <label>{{ global.lang.text.column[global.lang.currentLang] }} {{ index }}:</label>
                <Columns v-if="index == 0" v-model="contentsForm.userDatabaseColumns2[0]"
                         :editable="[false, false, false, false, false, false, false, false]"
                         :items="[columnDataTypes, columnSortMaps, columnWidths, columnDefaultShow]"
                         :is-second="true" />
                <Columns v-else-if="index == 1 && contentsForm.gridView" v-model="contentsForm.userDatabaseColumns2[1]"
                         :editable="[false, false, false, false, false, false, false, false]"
                         :items="[columnDataTypes, columnSortMaps, columnWidths, columnDefaultShow]"
                         :is-second="true" />
                <Columns v-else v-model="contentsForm.userDatabaseColumns2[index]"
                         :editable="[true, true, true, true, true, true, true, false]"
                         :items="[columnDataTypes, columnSortMaps, columnWidths, columnDefaultShow]"
                         :is-second="true" />
            </div>
            <!-- 添加新列 -->
            <v-tooltip :text="global.lang.text.addNewColumn[global.lang.currentLang]" location="bottom center">
                <template v-slot:activator="{ props }">
                    <v-btn block rounded="0" v-bind="props" icon="mdi-plus" class="mt-4" @click="addNewColumn(2)" />
                </template>
            </v-tooltip>
        </div>
        <!-- 提交 -->
        <div class="d-flex flex-row-reverse ma-4">
            <v-btn size="large" :color="global.primaryColor.value" @click="FormSubmit">
                {{ global.lang.text.submit[global.lang.currentLang] }}
            </v-btn>
            <v-btn size="large" class="mr-4" @click="submitEmit('cancel')">
                {{ global.lang.text.cancel[global.lang.currentLang] }}
            </v-btn>
        </div>
    </v-card>
</template>

<script setup>
import { computed, watch } from "vue"
import global from "@/plugins/global.js"
import Columns from "@/components/toolBar/Columns.vue"

// 添加数据库对话框
let contentsForm = defineModel()

watch(() => contentsForm.value.gridView, (newValue) => { // 监控网格视图选项
    if (newValue) {
        const newColumn = {
            key: "cover",
            dataType: "TEXT",
            sortMap: "cover",
            text: { zh: "封面", ja: "カバー", en: "Cover" },
            width: "flex",
            defaultShow: false
        }
        contentsForm.value.userDatabaseColumns.splice(1, 0, newColumn)
        contentsForm.value.userDatabaseColumns2.splice(1, 0, newColumn)
    }
    else{
        contentsForm.value.userDatabaseColumns.splice(1, 1)
        contentsForm.value.userDatabaseColumns2.splice(1, 1)
    }
})
function addNewColumn(table) { // 添加一个新列
    const newColumn = {
        key: null,
        dataType: null,
        sortMap: null,
        text: { zh: null, ja: null, en: null },
        width: null,
        defaultShow: true
    }
    if(table == 1){
        contentsForm.value.userDatabaseColumns.push(newColumn)
    }
    else{
        contentsForm.value.userDatabaseColumns2.push(newColumn)
    }
}
function deleteColumn(table, index) { // 删除一个列
    if(table == 1){
        contentsForm.value.userDatabaseColumns.splice(index, 1)
    }
    else{
        contentsForm.value.userDatabaseColumns2.splice(index, 1)
    }
}
const columnDataTypes = ["INTEGER", "REAL", "BOOLEAN", "TEXT"] // 可选数据类型
const columnSortMaps = computed(() => { // 可选排序方式
    const keys = []
    for (let column of contentsForm.value.userDatabaseColumns) {
        if (column.key != null && column.key != "") {
            keys.push(column.key)
        }
    }
    return keys
})
const columnWidths = computed(() => { // 可选宽度选项
    return [{ title: global.lang.text.tight[global.lang.currentLang], value: "tight" },
        { title: global.lang.text.flex[global.lang.currentLang], value: "flex" }]
})
const columnDefaultShow = computed(() => { // 默认是否展示选项
    return [{ title: global.lang.text.true[global.lang.currentLang], value: true },
        { title: global.lang.text.false[global.lang.currentLang], value: false }]
})

// 表单检查
function notNullCheck(value){ // 非空检查
    if(Array.isArray(value) || ((value !== null && value !== undefined) && typeof value == "object")){
        for(let index in value){
            if(index == "secondTimeStamp" || (index == "firstTimeStamp" && !contentsForm.value.timeStamp)
            || (index == "userDatabaseColumns2" && !contentsForm.value.doubleTable)){
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
function noConflictCheck(columns) { // 无冲突检查
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
function nameCheck(value){ // 名称合法性检查
    if(value.includes(" ") || value.includes("/") || value.includes("\\") || value.includes(":") ||
       value.includes("*") || value.includes("?") || value.includes("'") || value.includes("<") ||
       value.includes(">") || value.includes("|") || value.includes(".")){
        return false
    }
    return true
}
function formCheck(form){ // 整体检查
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

// 提交
const submitEmit = defineEmits(["submit", "cancel", "error"])
function FormSubmit() {
    const checkResult = formCheck(contentsForm.value)
    if(checkResult != true){
        submitEmit("error", checkResult)
        return
    }
    submitEmit("submit") // 提交表单
}
</script>