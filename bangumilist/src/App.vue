<template>
  <n-config-provider id="contentsRoot" :theme="global.darkMode">
    <n-layout>
      <!-- 标题栏 -->
      <n-layout-header>
        <n-card embedded content-style="padding: 0px">
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
              <n-button secondary size="small" color="red" @click="appWindow.close()">
                <template #icon>
                  <svg-icon type="mdi" :path="mdiClose"/>
                </template>
              </n-button>
            </n-flex>
          </n-flex>
        </n-card>
      </n-layout-header>

      <n-layout has-sider :style="`height:${contentsHeight}px`">
        <!-- 侧边栏 -->
        <n-layout-sider bordered :width="56">
          <n-card embedded style="height: 100%" content-style="padding: 0">
            <n-flex vertical justify="space-between" style="height:100%">
              <n-flex vertical align="center">
                <n-popover placement="right">
                  <template #trigger>
                    <n-button quaternary size="large">
                      <template #icon>
                        <svg-icon type="mdi" :path="mdiDatabasePlus"/>
                      </template>
                    </n-button>
                  </template>
                  {{ global.lang.getText("newDatabase") }}
                </n-popover>
                <n-popover placement="right">
                  <template #trigger>
                    <n-button quaternary size="large">
                      <template #icon>
                        <svg-icon type="mdi" :path="mdiDatabaseCog"/>
                      </template>
                    </n-button>
                  </template>
                  {{ global.lang.getText("editDatabase") }}
                </n-popover>
                <n-popover placement="right">
                  <template #trigger>
                    <n-button quaternary size="large">
                      <template #icon>
                        <svg-icon type="mdi" :path="mdiContentSave"/>
                      </template>
                    </n-button>
                  </template>
                  {{ global.lang.getText("saveDatabase") }}
                </n-popover>
                <n-popover placement="right">
                  <template #trigger>
                    <n-button quaternary size="large">
                      <template #icon>
                        <svg-icon type="mdi" :path="mdiContentSavePlus"/>
                      </template>
                    </n-button>
                  </template>
                  {{ global.lang.getText("saveDatabaseAs") }}
                </n-popover>
                <n-popover placement="right">
                  <template #trigger>
                    <n-button quaternary size="large">
                      <template #icon>
                        <svg-icon type="mdi" :path="mdiDatabaseRemove"/>
                      </template>
                    </n-button>
                  </template>
                  {{ global.lang.getText("closeDatabase") }}
                </n-popover>
              </n-flex>
              <n-flex vertical justify="end" align="center" style="margin-bottom:8px">
                <n-popover placement="right">
                  <template #trigger>
                    <n-popselect v-model:value="global.lang.currentLang" :options="global.lang.langList" placement="right" size="large" trigger="click">
                      <n-button quaternary size="large">
                        <template #icon>
                          <svg-icon type="mdi" :path="mdiTranslate"/>
                        </template>
                      </n-button>
                    </n-popselect>
                  </template>
                  {{ global.lang.getText("language") }}
                </n-popover>
                <n-popover placement="right">
                  <template #trigger>
                    <n-button quaternary size="large" @click="global.settingPage = !global.settingPage">
                      <template #icon>
                        <svg-icon type="mdi" :path="mdiCog"/>
                      </template>
                    </n-button>
                  </template>
                  {{ global.lang.getText("settings") }}
                </n-popover>
              </n-flex>
            </n-flex>
          </n-card>
        </n-layout-sider>
        <!-- 正文 -->
        <n-layout-content>
          <Settings v-show="global.settingPage"/>
          <Toolbar v-if="!global.settingPage && global.databaseLoaded"/>
          <n-dialog-provider>
            <OpenPage v-if="!global.settingPage && !global.databaseLoaded"/>
          </n-dialog-provider>
        </n-layout-content>
      </n-layout>
    </n-layout>
  </n-config-provider>
</template>

<script setup lang="ts">
import { Window } from "@tauri-apps/api/window"
import { NConfigProvider, NButton, NFlex, NAvatar, NLayout, NLayoutHeader, NLayoutSider, NLayoutContent,
  NCard, NPopover, NPopselect, NDialogProvider } from "naive-ui"
import SvgIcon from "@jamescoyle/vue-icon"
import { mdiClose, mdiCropSquare, mdiMinus, mdiCircleMedium, mdiCog, mdiTranslate,
  mdiDatabasePlus, mdiContentSave, mdiContentSavePlus, mdiDatabaseRemove, mdiDatabaseCog } from "@mdi/js"
import { computed, onMounted, onUnmounted, ref, watch } from "vue"
import Settings from "./components/Settings.vue"
import Toolbar from "./components/Toolbar.vue"
import OpenPage from "./components/OpenPage.vue"
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
const contentsHeight = computed(() => windowHeight.value * (1 / global.globalZoom) - 30)
</script>