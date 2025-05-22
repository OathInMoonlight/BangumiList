<template>
    <TableComp v-if="global.isTableReady" />
</template>

<script setup lang="ts">
import global from "@/plugins/global.js"
import TableComp from "@/components/TableComp.vue"
</script>