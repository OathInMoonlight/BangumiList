<template>
    <v-tooltip :text="global.lang.text.edit[global.lang.currentLang]" location="bottom center">
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon="mdi-square-edit-outline" @click="getDatabaseInfo" />
        </template>
    </v-tooltip>

    <!-- 修改数据库 -->
    <v-dialog v-model="editItemDialog" persistent>
        <contentsForm v-model="EditDatabaseForm" @error="errorHandler" @submit="editItemSubmit" @cancel="editItemDialog = false" />
    </v-dialog>

    <!-- 报错 -->
    <v-dialog v-model="editAlert" max-width="512">
        <v-alert :title="global.lang.text.error[global.lang.currentLang]"
                 :text="checkAlertMessage" type="error" />
    </v-dialog>
</template>

<script setup>
import { reactive, ref } from "vue"
import global from "@/plugins/global.js"
import userTable from "@/plugins/userTable"
import contentsForm from "@/components/toolBar/ContentsForm.vue"

const editAlert = ref(false)
const editAlertMessage = ref(null)
const editRowName = ref(null)
const editItemDialog = ref(false)
function getDatabaseInfo(){
    if (global.tableData.selectedRow == null) {
        editAlertMessage.value = global.lang.text.editErrorText[global.lang.currentLang]
        editAlert.value = true
    }
    else {
        editRowName.value = global.tableData.selectedRow.name
        userTable.getInfoReq(editRowName, status => {
            if(status !== "Success") {
                editAlert.value = true
                return
            }
            editItemDialog.value = true
        })
    }
}

function initEditDatabaseForm() { // 新建表单
    const form = {}
    if (global.isMain.value) {
        form.databaseName = editRowName.value
        form.databasePath = global.tableData.data[global.tableData.selectedRow.id].DATABASEPATH
        form.gridView = userTable.gridView
        form.doubleTable = userTable.doubleTable
        form.timeStamp = userTable.timeStamp
        form.firstTimeStamp = userTable.firstTimeStamp
        form.secondTimeStamp = userTable.secondTimeStamp
        form.userDatabaseColumns = userTable.keys.map(key => {
            return {
                key: key,
                dataType: userTable.dataType[key],
                sortMap: userTable.sortMap[key],
                text: userTable.text[key],
                width: userTable.width[key],
                defaultShow: userTable.defaultShow[key]
            }
        })
        form.userDatabaseColumns2 = userTable.doubleTable ? userTable.secondTable.keys.map(key => {
            return {
                key: key,
                dataType: userTable.secondTable.dataType[key],
                sortMap: userTable.secondTable.sortMap[key],
                text: userTable.secondTable.text[key],
                width: userTable.secondTable.width[key],
                defaultShow: userTable.secondTable.defaultShow[key]
            }
        }) : [{
            key: "id",
            dataType: "INTEGER PRIMARY KEY AUTOINCREMENT",
            sortMap: "id",
            text: { zh: "序号", ja: "番号", en: "ID" },
            width: "tight",
            defaultShow: true
        }]
    }
    return form
}
const editDatabaseForm = reactive(initEditDatabaseForm())

// 处理错误
function errorHandler(errorMassage){
    editAlert.value = true
    editAlertMessage.value = errorMassage
}

// 提交
function editItemSubmit() {
    editItemDialog.value = false
    global.tableData.insertReq(editDatabaseForm, status => {
        if(status !== "Success"){
            editAlertMessage.value = global.lang.text.newError[global.lang.currentLang]
            editAlert.value = true
            return
        }
        Object.assign(editDatabaseForm, initEditDatabaseForm()) // 重置表单
    })
}
</script>