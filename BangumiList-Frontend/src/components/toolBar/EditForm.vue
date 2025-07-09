<template>
    <v-tooltip :text="global.lang.text.edit[global.lang.currentLang]" location="bottom center">
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon="mdi-square-edit-outline" @click="getDatabaseInfo" />
        </template>
    </v-tooltip>

    <!-- 修改数据库 -->
    <v-dialog v-model="editItemDialog" persistent>
        <contentsForm v-model="editDatabaseForm" @error="errorHandler" @submit="editItemSubmit"
                      @cancel="editItemCancel" />
    </v-dialog>

    <!-- 报错 -->
    <v-dialog v-model="editAlert" max-width="512">
        <v-alert :title="global.lang.text.error[global.lang.currentLang]" :text="editAlertMessage" type="error" />
    </v-dialog>
</template>

<script setup>
import { reactive, ref } from "vue"
import global from "@/plugins/global.js"
import userTable from "@/plugins/userTable"
import contentsForm from "@/components/toolBar/ContentsForm.vue"

const editAlert = ref(false)
const editAlertMessage = ref(null)
let editRowName = null
const editItemDialog = ref(false)
function getDatabaseInfo() {
    if (global.tableData.selectedRow == null) {
        editAlertMessage.value = global.lang.text.editErrorText[global.lang.currentLang]
        editAlert.value = true
    }
    else {
        editRowName = global.tableData.selectedRow.DATABASENAME
        userTable.getInfoReq(editRowName, status => {
            if (status !== "Success") {
                editAlert.value = true
                return
            }
            Object.assign(editDatabaseForm, initEditDatabaseForm())
            editItemDialog.value = true
        })
    }
}

function initEditDatabaseForm() { // 新建表单
    const form = {}
    form.id = global.tableData.selectedRow.ID
    if (global.isMain.value) {
        form.databaseName = editRowName
        form.databasePath = global.tableData.selectedRow.DATABASEPATH
        form.gridView = userTable.gridView
        form.doubleTable = userTable.doubleTable
        form.timeStamp = userTable.timeStamp
        form.firstTimeStamp = userTable.firstTimeStamp
        form.secondTimeStamp = userTable.secondTimeStamp
        form.userDatabaseColumns = userTable.keys.map(key => {
            return {
                id: userTable.ids[key],
                key: key,
                dataType: userTable.dataType[key],
                sortMap: userTable.sortMap[key],
                text: userTable.text[key],
                width: userTable.width[key],
                shownColumns: userTable.shownColumns[key]
            }
        })
        if (userTable.doubleTable) {
            form.userDatabaseColumns2 = userTable.secondTable.keys.map(key => {
                return {
                    id: userTable.secondTable.ids[key],
                    key: key,
                    dataType: userTable.secondTable.dataType[key],
                    sortMap: userTable.secondTable.sortMap[key],
                    text: userTable.secondTable.text[key],
                    width: userTable.secondTable.width[key],
                    shownColumns: false
                }
            })
        }
        else {
            form.userDatabaseColumns2 = [{
                key: "id",
                dataType: "INTEGER PRIMARY KEY AUTOINCREMENT",
                sortMap: "id",
                text: { zh: "序号", ja: "番号", en: "ID" },
                width: "tight",
                shownColumns: true
            }]
            if (userTable.gridView) {
                form.userDatabaseColumns2.push({
                    key: "cover",
                    dataType: "TEXT",
                    sortMap: "cover",
                    text: { zh: "封面", ja: "カバー", en: "Cover" },
                    width: "flex",
                    shownColumns: false
                })
            }
        }
    }
    return form
}
const editDatabaseForm = reactive({})

// 处理错误
function errorHandler(errorMassage) {
    editAlert.value = true
    editAlertMessage.value = errorMassage
}

// 提交
function editItemCancel() {
    editItemDialog.value = false
    Object.assign(editDatabaseForm, {}) // 重置表单
}
function editItemSubmit() {
    editItemDialog.value = false
    global.tableData.editReq(editDatabaseForm, status => {
        if (status !== "Success") {
            editAlertMessage.value = global.lang.text.editError[global.lang.currentLang]
            editAlert.value = true
            return
        }
        Object.assign(editDatabaseForm, initEditDatabaseForm()) // 重置表单
    })
}
</script>