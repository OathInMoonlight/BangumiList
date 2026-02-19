<template>
    <v-toolbar density="comfortable" class="d-flex justify-space-between">
        <div class="ml-4">
            <!-- 打开数据库 -->
            <v-btn v-if="global.isMain.value" :variant="openBtnVariant" prepend-icon="mdi-open-in-app"
                   :text="global.lang.getText('openDatabase')" :color="global.view.primaryColor"
                   :disabled="disableOpenBtn" />
            <!-- 返回列表 -->
            <v-btn v-else variant="outlined" prepend-icon="mdi-chevron-left"
                   :text="global.lang.getText('backToList')" :color="global.view.primaryColor" />
        </div>
        <!-- 工具栏 -->
        <div class="mr-4">
            <MainAddForm v-if="global.isMain" />
        </div>
    </v-toolbar>
</template>

<script setup lang="ts">
import { computed } from "vue"
import global from "@/plugins/global"
import MainAddForm from "@/components/DataOperation/MainAddForm.vue"
// 打开按钮禁用状态
const disableOpenBtn = computed(() => global.mainData.selctedRow1 === null &&
    global.mainData.selctedRow2 === null)
const openBtnVariant = computed(() => disableOpenBtn.value ? "tonal" : "flat")
</script>