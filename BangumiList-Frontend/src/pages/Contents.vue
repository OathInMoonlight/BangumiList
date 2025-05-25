<template>
    <TableComp v-if="global.isTableReady.value" />
</template>

<script setup lang="ts">
import global from "@/plugins/global.js"
import TableComp from "@/components/TableComp.vue"

global.tableData.getInfoReq()
global.tableData.getReq()
</script>