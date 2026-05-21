<template>
    <div>
        <!-- 返回按钮 -->
        <n-flex align="center" style="padding: 8px">
            <n-button quaternary size="large" circle @click="global.settingPage = false">
                <template #icon>
                    <svg-icon type="mdi" :path="mdiChevronLeft"/>
                </template>
            </n-button>
            <h3 style="margin: 0">{{ global.lang.getText("back") }}</h3>
        </n-flex>

        <n-flex vertical align="center">
            <n-flex justify="center">
                <h1>{{ global.lang.getText("settings") }}</h1>
            </n-flex>
            <n-card embedded style="max-width: 512px">
                <n-flex vertical :size="16">
                    <!-- 全局缩放 -->
                    <n-flex justify="space-between" align="center">
                        {{ global.lang.getText("globalZoom") }}
                        <n-select v-model:value="global.globalZoom" :options="globalZoomOptions" style="width: 256px"/>
                    </n-flex>
                    <!-- 深色模式 -->
                    <n-flex justify="space-between" align="center">
                        {{ global.lang.getText("darkMode") }}
                        <n-select v-model:value="selectedTheme" :options="darkModeOptions" style="width: 256px"/>
                    </n-flex>
                    <!-- 主色调 -->
                    <n-flex justify="space-between" align="center">
                        {{ global.lang.getText("primaryColor") }}
                        <div style="width: 256px">
                            <n-color-picker v-model:value="global.primaryColor" placement="bottom" :modes="['hex']" :show-alpha="false" :swatches="colorSwatches"/>
                        </div>
                    </n-flex>
                    <colored-switch v-model="saveSettingFile" :checkedLabel="global.lang.getText('saveSettingFile')" :uncheckedLabel="global.lang.getText('notSaveSettingFile')"/>
                </n-flex>
            </n-card>
            <!-- 关于 -->
            <n-flex vertical align="center" style="margin-top: 16px">
                OathInMoonlight
                <n-flex justify="center" align="center" :size="8">
                    <svg-icon type="mdi" :path="mdiGithub"/>
                    <a href="https://github.com/OathInMoonlight/BangumiList" target="_blank">View On Github</a>
                </n-flex>
                <n-flex justify="center" align="center" :size="8">
                    <svg-icon type="mdi" :path="mdiScaleBalance"/>
                    <a href="https://github.com/OathInMoonlight/BangumiList?tab=MIT-1-ov-file" target="_blank">MIT License</a>
                </n-flex>
            </n-flex>
        </n-flex>
    </div>
</template>

<script setup lang="ts">
import { invoke } from "@tauri-apps/api/core"
import { darkTheme, useOsTheme, NButton, NFlex, NCard, NSelect, NColorPicker, useDialog } from "naive-ui"
import SvgIcon from "@jamescoyle/vue-icon"
import { mdiChevronLeft, mdiGithub, mdiScaleBalance } from "@mdi/js"
import { computed, ref, watch } from "vue"
import ColoredSwitch from "./ColoredSwitch.vue"
import global from "../plugins/global"

const dialog = useDialog()

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

const colorSwatches = [
    "#F44336", "#2196F3", "#00BCD4", "#8BC34A", "#FFC107", "#795548"
]

const saveSettingFile = ref(false)
async function read_setting() {
    try {
        const result = JSON.parse(await invoke("read_setting"))
        if(result) {
            global.globalZoom = result.globalZoom
            selectedTheme.value = result.theme
            global.primaryColor = result.primaryColor
            saveSettingFile.value = true
        }
    } catch(error) {
        global.errorDialog(dialog, "Error in reading setting file")
    }
}
async function save_setting() {
    try {
        await invoke("save_setting", {
            contents: JSON.stringify({
                globalZoom: global.globalZoom,
                theme: selectedTheme.value,
                primaryColor: global.primaryColor
            })
        })
    } catch(error) {
        global.errorDialog(dialog, "Error in saving setting file")
    }
}
read_setting()
watch(() => [saveSettingFile.value, global.globalZoom, selectedTheme.value, global.primaryColor], () => {
    if(saveSettingFile.value) {
        save_setting()
    }
})
</script>