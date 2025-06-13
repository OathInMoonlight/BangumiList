<template>
    <v-tooltip :text="global.lang.text.export[global.lang.currentLang]" location="bottom center">
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon="mdi-export" @click="exportItemDialog = true" />
        </template>
    </v-tooltip>

    <v-dialog v-model="exportItemDialog" persistent>
        <v-card v-if="global.isMain.value" width="512" class="ga-4 pa-4 ma-auto">
            <label>{{ global.lang.text.exportDatabase[global.lang.currentLang] }}</label>
            <div class="d-flex flex-row align-center">
                <v-select v-model="exportFileName" variant="outlined"
                          :label="global.lang.text.exportSelect[global.lang.currentLang]" hide-details
                          :no-data-text="global.lang.text.noData[global.lang.currentLang]"
                          :items="exportFileList" />
                <label>&nbsp;.db</label>
            </div>
            <div class="d-flex flex-row-reverse">
                <v-btn size="large" :color="global.primaryColor.value" @click="exportFileSubmit">
                    {{ global.lang.text.submit[global.lang.currentLang] }}
                </v-btn>
                <v-btn size="large" class="mr-4" @click="exportItemDialog = false">
                    {{ global.lang.text.cancel[global.lang.currentLang] }}
                </v-btn>
            </div>
        </v-card>
    </v-dialog>
    <!-- 报错 -->
    <v-dialog v-model="exportAlert" max-width="512">
        <v-alert :title="global.lang.text.error[global.lang.currentLang]"
                 :text="global.lang.text.exportError[global.lang.currentLang]" type="error" />
    </v-dialog>
</template>

<script setup>
import { computed, ref } from "vue"
import global from "@/plugins/global"

const exportItemDialog = ref(false)
const exportFileName = ref(null)
const exportFileList = computed(() => global.tableData.getNameList())
const exportAlert = ref(false)

function exportFileSubmit(){
    exportItemDialog.value = false
    if(exportFileName.value == null || exportFileName.value == ""){
        exportAlert.value = true
        return
    }
    global.tableData.exportReq(exportFileName.value, status => {
        if(status !== "Success"){
            exportAlert.value = true
            return
        }
    })
}
</script>