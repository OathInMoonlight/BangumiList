<template>
    <v-app>
        <v-main>
            <AppBar />
            <div class="mt-8" />
            <ToolBar />
            <ViewBar />
            <v-responsive :height="contentsHeight">
                <TableDisplay />
            </v-responsive>
        </v-main>
    </v-app>
</template>

<style>
/* 去除垂直滚动条 */
html {
    overflow-y: auto !important;
    /* zoom: 1; */
}
/* 去除AppBar底部空白 */
main {
    --v-layout-bottom: 0px !important;
    max-height: fit-content;
}
.v-application__wrap {
    min-height: fit-content !important;
}
</style>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from "vue"
import global from "@/plugins/global"
import AppBar from "@/components/AppBar.vue"
import ToolBar from "@/components/ToolBar.vue"
import ViewBar from "@/components/ViewBar.vue"
import TableDisplay from "./components/TableDisplay.vue"

// 将 window.innerHeight 包装为响应式数据
const windowHeight = ref(window.innerHeight)
const updateHeight = () => { windowHeight.value = window.innerHeight }
onMounted(() => { window.addEventListener("resize", updateHeight) })
onUnmounted(() => { window.removeEventListener("resize", updateHeight) })

// 监听 globalZoom 变化，动态调整页面缩放
watch(() => global.view.globalZoom, newValue => {
    document.body.style.zoom = newValue.toString()
}, { immediate: true })

// 计算内容区域高度
const contentsHeight = computed(() => windowHeight.value * (1 / global.view.globalZoom) - 208)
</script>