<template>
    <div>
        <n-flex align="center" style="margin: 8px">
            <n-tooltip placement="bottom">
                <template #trigger>
                    <n-button quaternary size="large" circle @click="global.settingPage = false">
                        <template #icon>
                            <svg-icon type="mdi" :path="mdiChevronLeft"/>
                        </template>
                    </n-button>
                </template>
                <label>{{ global.lang.getText("back") }}</label>
            </n-tooltip>
            <h3 style="margin: 0">{{ global.lang.getText("settings") }}</h3>
        </n-flex>
        <n-flex vertical align="center">
            <n-card style="max-width: 768px">
                <n-flex vertical :size="16">
                    <n-flex justify="space-between" align="center">
                        <label>{{ global.lang.getText("globalZoom") }}</label>
                        <n-select v-model:value="global.globalZoom" :options="globalZoomOptions" style="width: 256px"/>
                    </n-flex>
                    <n-flex justify="space-between" align="center">
                        <label>{{ global.lang.getText("darkMode") }}</label>
                        <n-select v-model:value="selectedTheme" :options="darkModeOptions" style="width: 256px"/>
                    </n-flex>
                </n-flex>
            </n-card>
        </n-flex>
    </div>
</template>

<script setup lang="ts">
import { darkTheme, useOsTheme, NTooltip, NButton, NFlex, NCard, NSelect } from "naive-ui"
import SvgIcon from "@jamescoyle/vue-icon"
import { mdiChevronLeft } from "@mdi/js"
import { computed, ref, watch } from "vue"
import global from "../plugins/global"

const globalZoomOptions = computed(() => [
    { label: "50%", value: 0.5 },
    { label: "75%", value: 0.75 },
    { label: "100%", value: 1 },
    { label: "125%", value: 1.25 },
    { label: "150%", value: 1.5 },
    { label: "200%", value: 2 },
])

const selectedTheme = ref("system")
const darkModeOptions = computed(() => [
    { label: global.lang.getText("darkModeSystem"), value: "system" },
    { label: global.lang.getText("lightMode"), value: "light" },
    { label: global.lang.getText("darkMode"), value: "dark" },
])
watch(selectedTheme, (newTheme) => {
    switch(newTheme) {
        case "system":
            global.darkMode = useOsTheme().value === "dark" ? darkTheme : null
            break
        case "dark":
            global.darkMode = darkTheme
            break
        case "light":
            global.darkMode = null
            break
    }
}, { immediate: true })
</script>