<template>
    <!-- 新建按钮 -->
    <v-tooltip :text="global.lang.text.plus[global.lang.currentLang]" location="bottom center">
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon="mdi-plus" @click="addItemDialog = true" />
        </template>
    </v-tooltip>

    <!-- 新建新的数据库 -->
    <v-dialog v-model="addItemDialog" persistent>
        <contentsForm v-model="addDatabaseForm" @error="errorHandler" @submit="addItemSubmit" @cancel="addItemDialog = false" />
    </v-dialog>

    <!-- 报错 -->
    <v-dialog v-model="checkAlert" max-width="512">
        <v-alert :title="global.lang.text.error[global.lang.currentLang]"
                 :text="checkAlertMessage" type="error" />
    </v-dialog>
</template>

<script setup>
import { reactive, ref } from "vue"
import global from "@/plugins/global.js"
import contentsForm from "@/components/toolBar/ContentsForm.vue"

// 添加数据库对话框
const addItemDialog = ref(false)
function initAddDatabaseForm() { // 新建表单
    const form = {}
    if (global.isMain.value) {
        form.databaseName = null
        form.databasePath = "databases/"
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
const addDatabaseForm = reactive(initAddDatabaseForm())

// 处理错误
const checkAlert = ref(false)
const checkAlertMessage = ref(null)
function errorHandler(errorMassage){
    checkAlert.value = true
    checkAlertMessage.value = errorMassage
}

// 提交
function addItemSubmit() {
    addItemDialog.value = false
    global.tableData.insertReq(addDatabaseForm, status => {
        if(status !== "Success"){
            checkAlertMessage.value = global.lang.text.newError[global.lang.currentLang]
            checkAlert.value = true
            return
        }
        Object.assign(addDatabaseForm, initAddDatabaseForm()) // 重置表单
    })
}
</script>