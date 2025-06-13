<template>
    <TableComp v-if="global.isTableReady.value" />

    <!-- 报错 -->
    <v-dialog v-model="getAlert" max-width="512">
        <v-alert :title="global.lang.text.error[global.lang.currentLang]"
                 :text="global.lang.text.getError[global.lang.currentLang]" type="error" />
    </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import global from "@/plugins/global.js"
import TableComp from "@/components/TableComp.vue"

const getAlert = ref(false)
global.tableData.getInfoReq(() => {
    getAlert.value = true
})
global.tableData.getReq(() => {
    getAlert.value = true
})
</script>