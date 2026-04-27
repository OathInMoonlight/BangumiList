<template>
  <n-config-provider id="contentsRoot" :theme="global.darkMode">
    <n-layout>
      <!-- 标题栏 -->
      <n-layout-header>
        <n-card embedded :bordered="false" content-style="padding: 0px">
          <n-flex justify="space-between" data-tauri-drag-region>
            <n-flex align="center" size="small" style="padding-left:3px" data-tauri-drag-region>
              <n-avatar src="Icon-64.png" size="small" color="#00000000"/>
              <p data-tauri-drag-region style="margin: 0">BangumiList</p>
            </n-flex>
            <n-flex v-if="global.databaseLoaded" align="center" :size="0">
              <p data-tauri-drag-region style="margin: 0">{{ global.databaseData?.path.split(/[/\\$]/).pop() }}</p>
              <svg-icon v-if="!global.databaseSaved" type="mdi" :path="mdiCircleMedium"/>
            </n-flex>
            <n-flex justify="end" :size="0">
              <n-button quaternary size="small" @click="appWindow.minimize()">
                <template #icon>
                  <svg-icon type="mdi" :path="mdiMinus"/>
                </template>
              </n-button>
              <n-button quaternary size="small" @click="appWindow.toggleMaximize()">
                <template #icon>
                  <svg-icon type="mdi" :path="mdiCropSquare"/>
                </template>
              </n-button>
              <n-dialog-provider>
                <window-close :close="appWindow.close"/>
              </n-dialog-provider>
            </n-flex>
          </n-flex>
          <n-divider style="margin: 0"/>
        </n-card>
      </n-layout-header>

      <n-layout has-sider :style="`height:${contentsHeight}px`">
        <!-- 侧边栏 -->
        <n-layout-sider bordered :width="56">
          <n-scrollbar style="height: 100%" content-style="height: 100%">
            <n-dialog-provider>
              <n-message-provider placement="bottom" keep-alive-on-hover>
                <side-bar/>
              </n-message-provider>
            </n-dialog-provider>
          </n-scrollbar>
        </n-layout-sider>
        <!-- 正文 -->
        <n-layout-content>
          <n-scrollbar style="height: 100%" content-style="height: 100%">
            <settings v-show="global.settingPage"/>
            <toolbar v-if="!global.settingPage && global.page === 'contents'"/>
            <n-dialog-provider>
              <open-page v-if="!global.settingPage && global.page === 'open'"/>
            </n-dialog-provider>
            <n-message-provider placement="bottom" keep-alive-on-hover>
              <DatabaseDef v-if="!global.settingPage && global.page === 'edit'"/>
            </n-message-provider>
          </n-scrollbar>
        </n-layout-content>
      </n-layout>
    </n-layout>
  </n-config-provider>
</template>

<script setup lang="ts">
import { Window } from "@tauri-apps/api/window"
import { NConfigProvider, NButton, NFlex, NAvatar, NLayout, NLayoutHeader, NLayoutSider, NLayoutContent,
  NCard, NDivider, NScrollbar, NDialogProvider, NMessageProvider } from "naive-ui"
import SvgIcon from "@jamescoyle/vue-icon"
import { mdiCropSquare, mdiMinus, mdiCircleMedium } from "@mdi/js"
import { computed, onMounted, onUnmounted, ref, watch } from "vue"
import WindowClose from "./components/WindowClose.vue"
import SideBar from "./components/SideBar.vue"
import Settings from "./components/Settings.vue"
import Toolbar from "./components/Toolbar.vue"
import OpenPage from "./components/OpenPage.vue"
import DatabaseDef from "./components/DatabaseDef.vue"
import global from "./plugins/global"

const appWindow = new Window("main")

// 将 window.innerHeight 包装为响应式数据
const windowHeight = ref(window.innerHeight)
const updateHeight = () => { windowHeight.value = window.innerHeight }
onMounted(() => { window.addEventListener("resize", updateHeight) })
onUnmounted(() => { window.removeEventListener("resize", updateHeight) })

// 监听 globalZoom 变化，动态调整页面缩放
watch(() => global.globalZoom, newValue => {
  document.getElementById("contentsRoot")!.style.zoom = newValue.toString()
})

// 计算内容区域高度
const contentsHeight = computed(() => windowHeight.value * (1 / global.globalZoom) - 29)
</script>