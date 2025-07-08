<template>
    <v-tooltip :text="global.lang.text.delete[global.lang.currentLang]" location="bottom center">
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon="mdi-delete" @click="deleteItemButton" />
        </template>
    </v-tooltip>
    <!-- 删除表单 -->
    <v-dialog v-model="deleteItemAlert" max-width="512">
        <v-alert :title="global.lang.text.error[global.lang.currentLang]"
                 :text="global.lang.text.deleteErrorText[global.lang.currentLang]" type="warning" />
    </v-dialog>
    <v-dialog v-model="deleteItemDialog" persistent max-width="512">
        <v-card>
            <div class="mt-4 ml-4 mr-4">
                <label>{{ global.lang.text.deleteConfirm1[global.lang.currentLang] }} "{{ deleteRowName }}" {{
                    global.lang.text.deleteConfirm2[global.lang.currentLang] }}</label>
                <v-switch v-model="ifDeleteFile" :color="global.primaryColor.value"
                          :label="global.lang.text.deleteFile[global.lang.currentLang]" hide-details />
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
    <!-- 报错 -->
    <v-dialog v-model="deleteAlert" max-width="512">
        <v-alert :title="global.lang.text.error[global.lang.currentLang]"
                 :text="global.lang.text.deleteError[global.lang.currentLang]" type="error" />
    </v-dialog>
</template>

<script setup>
import { ref } from "vue"
import global from "@/plugins/global.js"

const deleteAlert = ref(false)
const deleteItemAlert = ref(false)
const deleteItemDialog = ref(false)
const deleteRowName = ref(null)
const ifDeleteFile = ref(false)
function deleteItemButton() {
    if (global.tableData.selectedRow == null) {
        deleteItemAlert.value = true
    }
    else {
        deleteRowName.value = global.tableData.selectedRow.DATABASENAME
        deleteItemDialog.value = true
    }
}
function deleteItemSubmit() {
    deleteItemDialog.value = false
    global.tableData.deleteReq(ifDeleteFile.value, status => {
        if(status !== "Success") {
            deleteAlert.value = true
            return
        }
        ifDeleteFile.value = false
    })
}
</script>