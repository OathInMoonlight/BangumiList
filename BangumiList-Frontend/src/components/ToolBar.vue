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
                <AddForm />
                <ImportForm />
                <ExportForm />
                <DeleteForm />
                <v-tooltip :text="global.lang.text.edit[global.lang.currentLang]" location="bottom center">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" icon="mdi-square-edit-outline" />
                    </template>
                </v-tooltip>
            </div>
        </div>
    </v-toolbar>
</template>

<script setup>
import global from "@/plugins/global.js"
import AddForm from "@/components/AddForm.vue"
import ImportForm from "@/components/ImportForm.vue"
import ExportForm from "@/components/ExportForm.vue"
import DeleteForm from "@/components/DeleteForm.vue"
</script>