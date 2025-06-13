<template>
    <v-tooltip :text="global.lang.text.import[global.lang.currentLang]" location="bottom center">
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon="mdi-import" @click="importItemDialog = true" />
        </template>
    </v-tooltip>

    <v-dialog v-model="importItemDialog" persistent>
        <v-card v-if="global.isMain.value" width="512" class="ga-4 pa-4 ma-auto">
            <label>{{ global.lang.text.importMassage[global.lang.currentLang] }}</label>
            <v-file-input v-model="file" :label="global.lang.text.uploadFile[global.lang.currentLang]" variant="outlined"
                          accept=".db" hide-details />
            <div class="d-flex flex-row-reverse">
                <v-btn size="large" :color="global.primaryColor.value" @click="uploadFileSubmit">
                    {{ global.lang.text.submit[global.lang.currentLang] }}
                </v-btn>
                <v-btn size="large" class="mr-4" @click="importItemDialog = false">
                    {{ global.lang.text.cancel[global.lang.currentLang] }}
                </v-btn>
            </div>
        </v-card>
    </v-dialog>
    <!-- 报错 -->
    <v-dialog v-model="importAlert" max-width="512">
        <v-alert :title="global.lang.text.error[global.lang.currentLang]"
                 :text="global.lang.text.importError[global.lang.currentLang]" type="error" />
    </v-dialog>
</template>

<script setup>
import { ref } from "vue"
import global from "@/plugins/global.js"

const importItemDialog = ref(false)
const file = ref(null)
const importAlert = ref(false)

function uploadFileSubmit(){
    importItemDialog.value = false
    global.tableData.importReq({fileName: file.value.name, file: file.value}, status => {
        if(status !== "Success"){
            importAlert.value = true
            return
        }
        file.value = null
    })
}
</script>