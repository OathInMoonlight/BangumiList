<template>
    <v-app>
        <v-main class="pb-0">
            <index />
        </v-main>
    </v-app>
</template>

<style>
/* 去除垂直滚动条 */
html {
  overflow-y: auto !important
}
</style>

<script setup>
import index from "@/pages/index.vue"
</script>