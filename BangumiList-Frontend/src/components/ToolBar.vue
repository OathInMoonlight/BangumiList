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
                <EditForm />
            </div>
        </div>
    </v-toolbar>
</template>

<script setup>
import global from "@/plugins/global.js"
import AddForm from "@/components/toolBar/AddForm.vue"
import ImportForm from "@/components/toolBar/ImportForm.vue"
import ExportForm from "@/components/toolBar/ExportForm.vue"
import DeleteForm from "@/components/toolBar/DeleteForm.vue"
import EditForm from "@/components/toolBar/EditForm.vue"
</script>