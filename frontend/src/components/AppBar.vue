<template>
    <!-- 标题栏 -->
    <v-app-bar scroll-behavior="hide" elevation="4" class="pa-4">
        <!-- 自定义标题 -->
        <template #default>
            <label class="d-flex align-center text-h3">BangumiList</label>
        </template>
        <template #append>
            <!-- 语言选项按钮 -->
            <v-tooltip :text="global.lang.getText('language')" location="bottom center">
                <template #activator="{ props }">
                    <v-btn v-bind="props" elevation="0" icon="">
                        <v-icon icon="mdi-translate" />
                        <!-- 语言选项菜单 -->
                        <v-menu activator="parent" location="bottom center">
                            <v-list v-model:selected="languageSelected"
                                    :items="languageList" item-title="title" item-value="value" />
                        </v-menu>
                    </v-btn>
                </template>
            </v-tooltip>
            <!-- 设置按钮 -->
            <v-tooltip :text="global.lang.getText('settings')" location="bottom center">
                <template #activator="{ props }">
                    <v-btn v-bind="props" elevation="0" icon="mdi-tune"
                           @click.stop="openDrawer=!openDrawer" />
                </template>
            </v-tooltip>
        </template>
    </v-app-bar>

    <!-- 右侧设置抽屉 -->
    <v-navigation-drawer v-model="openDrawer" location="right" temporary class="mt-8">
        <!-- 深色模式 -->
        <v-list-item class="mt-4">
            <v-btn block variant="outlined" @click="theme.toggle()">
                {{ themeText }}
            </v-btn>
        </v-list-item>
        <!-- 全局缩放 -->
        <v-list-item class="mt-2">
            <v-select variant="outlined" density="comfortable" hide-details
                      :label="global.lang.getText('globalZoom')"
                      v-model="global.view.globalZoom" :items="zoomList" class="pt-2" />
        </v-list-item>
        <!-- 主色调选项 -->
        <v-list-item class="mt-2">
            <v-select variant="outlined" density="comfortable" hide-details
                      :label="global.lang.getText('primaryColor')"
                      v-model="global.view.primaryColor" :items="colorList" class="pt-2">
                <!-- 自定义选择框 -->
                <template #selection="{ item }">
                    <v-icon icon="mdi-circle" :color="item.value" />
                    <label>{{ item.title }}</label>
                </template>
                <!-- 自定义选项列表 -->
                <template #item="{ item, props }">
                    <v-list-item v-bind="props" title="">
                        <v-icon icon="mdi-circle" :color="item.value" />
                        <label>{{ item.title }}</label>
                    </v-list-item>
                </template>
            </v-select>
        </v-list-item>
        <!-- 传输地址设置 -->
        <v-list-item class="mt-2">
            <v-text-field variant="outlined" density="comfortable" hide-details
                          :label="global.lang.getText('transAddress')"
                          v-model="transAddress" class="pt-2" />
        </v-list-item>
        <!-- 脚注 -->
        <v-footer class="d-flex flex-column ga-2 mb-10" app>
            <label class="text-center">OathInMoonlight</label>
            <div class="d-flex flex-row ga-2">
                <v-icon icon="mdi-github" size="small" />
                <a href="https://github.com/OathInMoonlight/BangumiList" class="text-decoration-none">View On Github</a>
            </div>
            <div class="d-flex flex-row ga-2">
                <v-icon icon="mdi-scale-balance" size="small" />
                <a href="https://github.com/OathInMoonlight/BangumiList?tab=MIT-1-ov-file" class="text-decoration-none">MIT License</a>
            </div>
        </v-footer>
    </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue"
import { useTheme } from "vuetify"
import global from "@/plugins/global.js"
import type { LanguageType } from "@/plugins/transportTypes"
// 抽屉开关
const openDrawer = ref(false)
// 语言
const languageList = global.lang.langList
const languageSelected = ref(global.lang.currentLang)
watch(languageSelected, newValue => global.lang.currentLang = newValue[0] as LanguageType)
//主题
const theme = useTheme()
const themeText = computed(() => global.lang.getText(`${
    theme.global.name.value === "dark" ? "light" : "dark" }Mode`))
// 缩放
const zoomList = [
    { title: "50%", value: 0.5 },
    { title: "75%", value: 0.75 },
    { title: "100%", value: 1 },
    { title: "150%", value: 1.5 },
    { title: "200%", value: 2 }
]
// 主题色
const colorList = computed(() => [
    { title: global.lang.text.red[global.lang.currentLang], value: "red" },
    { title: global.lang.text.yellow[global.lang.currentLang], value: "yellow" },
    { title: global.lang.text.green[global.lang.currentLang], value: "green" },
    { title: global.lang.text.blue[global.lang.currentLang], value: "blue" }
])
// 传输地址
const transAddress = ref(`${global.trans.url}:${global.trans.port}`)
watch(transAddress, newAddress => {
    if(newAddress.includes(":")) {
        const addressSplit = newAddress.split(":")
        addressSplit.reverse()
        global.trans.url = addressSplit[1]
        global.trans.port = parseInt(addressSplit[0])
    }
})
</script>