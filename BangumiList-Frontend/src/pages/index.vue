<template>
    <AppBar />
    <ToolBar v-if="global.isTableReady.value" />
    <ViewBar v-if="global.isTableReady.value" />
    <Contents />
</template>

<script setup>
import global from "@/plugins/global.js"
import AppBar from "@/components/AppBar.vue"
import Contents from "@/pages/Contents.vue"
import ToolBar from "@/components/ToolBar.vue"
import ViewBar from "@/components/ViewBar.vue"
</script>