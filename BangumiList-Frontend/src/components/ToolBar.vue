<template>
    <v-toolbar density="comfortable">
        <div class="w-100 d-flex flex-row justify-space-between align-center">
            <!-- 左侧标题 -->
            <div class="d-flex align-center ml-4">
                <label v-if="!$isDatabase.value" class="text-h6">{{ $lang.text.databaseList[$lang.currentLang]
                }}</label>
                <v-tooltip v-else :text="$lang.text.backToList[$lang.currentLang]">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" variant="outlined">{{ $isDatabase }}</v-btn>
                    </template>
                </v-tooltip>
            </div>
            <!-- 工具栏 -->
            <div class="d-flex align-center mr-2">
                <v-tooltip :text="$lang.text.plus[$lang.currentLang]">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" icon="mdi-plus" @click="addItem" />
                    </template>
                </v-tooltip>
                <v-tooltip :text="$lang.text.import[$lang.currentLang]">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" icon="mdi-import" />
                    </template>
                </v-tooltip>
                <v-tooltip :text="$lang.text.export[$lang.currentLang]">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" icon="mdi-export" />
                    </template>
                </v-tooltip>
                <v-tooltip :text="$lang.text.delete[$lang.currentLang]">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" icon="mdi-delete" />
                    </template>
                </v-tooltip>
                <v-tooltip :text="$lang.text.edit[$lang.currentLang]">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" icon="mdi-square-edit-outline" />
                    </template>
                </v-tooltip>
            </div>
        </div>
    </v-toolbar>

    <!-- 表单 -->
    <v-dialog persistent v-model="addItemDialog">
        <v-card>
            <label>adding item</label>
            <v-btn @click="addItemDialog = false">Close</v-btn>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref } from "vue"
import { useHttp, useTableData } from "@/plugins/useGlobal.js"

const http = useHttp()
const tableData = useTableData()
const addItemDialog = ref(false)
function addItem() {
    addItemDialog.value = true
    tableData.loading = true
    tableData.loading = false
}
</script>