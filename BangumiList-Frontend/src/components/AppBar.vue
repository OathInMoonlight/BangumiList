<template>
    <v-app-bar :elevation="4" scroll-behavior="hide">
        <v-app-bar-title style="line-height: normal" class="text-h4">
            BangumiList
        </v-app-bar-title>

        <!-- 自定义设置按钮 -->
        <template v-slot:append>
            <v-tooltip :text="global.lang.text.settings[global.lang.currentLang]">
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" icon="mdi-tune" @click.stop="openDrawer = !openDrawer" />
                </template>
            </v-tooltip>
        </template>
    </v-app-bar>

    <!-- 右侧抽屉 -->
    <v-navigation-drawer v-model="openDrawer" location="right" temporary :width="300">
        <!-- 深色模式 -->
        <v-list-item>
            <div class="d-flex justify-space-between align-center">
                <label>{{ global.lang.text.darkMode[global.lang.currentLang] }}</label>
                <v-switch v-model="darkModeSwitch" :color="global.primaryColor.value" class="d-flex align-center mr-4"
                          hide-details @update:model-value="toggleTheme" />
            </div>
        </v-list-item>

        <!-- 主色调选择 -->
        <v-list-item>
            <div class="d-flex justify-space-between align-center">
                <label>{{ global.lang.text.primaryColor[global.lang.currentLang] }}</label>
                <v-select v-model="global.primaryColor.value" variant="solo-filled" density="comfortable" :items="colorList"
                          hide-details class="d-flex justify-end align-center">
                    <!-- 自定义选择框 -->
                    <template v-slot:selection="{ item }">
                        <v-avatar :color="item.value" size="24" />
                        <label class="ml-4">{{ item.title }}</label>
                    </template>
                    <!-- 自定义选项 -->
                    <template v-slot:item="{ item, props }">
                        <v-list-item v-bind="props" title="">
                            <div class="d-flex justify-start align-center">
                                <v-avatar :color="item.value" size="24" />
                                <label class="ml-4">{{ item.title }}</label>
                            </div>
                        </v-list-item>
                    </template>
                </v-select>
            </div>
        </v-list-item>

        <!-- 语言选择 -->
        <v-list-item>
            <div class="d-flex justify-space-between align-center">
                <label>{{ global.lang.text.language[global.lang.currentLang] }}</label>
                <v-select v-model="global.lang.currentLang" variant="solo-filled" density="comfortable" :items="languageList"
                          hide-details class="d-flex justify-end align-center" />
            </div>
        </v-list-item>

        <!-- 脚注 -->
        <v-footer class="d-flex flex-column justify-center align-center" app>
            <label class="text-center mb-2">OathInMoonlight</label>
            <div class="d-flex flex-row mb-2">
                <v-icon icon="mdi-github" size="small" />
                <pre>&nbsp;</pre>
                <a href="https://github.com/OathInMoonlight/BangumiList" class="text-decoration-none">View On Github</a>
            </div>
            <div class="d-flex flex-row mb-4">
                <v-icon icon="mdi-scale-balance" size="small" />
                <pre>&nbsp;</pre>
                <a href="https://github.com/OathInMoonlight/BangumiList?tab=MIT-1-ov-file" class="text-decoration-none">MIT License</a>
            </div>
        </v-footer>
    </v-navigation-drawer>
</template>

<script setup>
import { ref, computed } from "vue"
import { useTheme } from "vuetify"
import global from "@/plugins/global.js"

const openDrawer = ref(false)
const colorList = computed(() => [
    { title: global.lang.text.red[global.lang.currentLang], value: "red" },
    { title: global.lang.text.yellow[global.lang.currentLang], value: "yellow" },
    { title: global.lang.text.green[global.lang.currentLang], value: "green" },
    { title: global.lang.text.blue[global.lang.currentLang], value: "blue" }
])
const languageList = [
    { title: "中文", value: "zh" },
    { title: "日本語", value: "ja" },
    { title: "English", value: "en" }
]

//主题切换
const theme = useTheme()
const darkModeSwitch = ref(theme.global.current.value.dark)
function toggleTheme() {
    theme.global.name.value = darkModeSwitch.value ? "dark" : "light"
}
</script>