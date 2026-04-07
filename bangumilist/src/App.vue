<template>
  <n-layout>
    <!-- 标题栏 -->
    <n-layout-header>
      <n-flex justify="space-between" data-tauri-drag-region>
        <n-flex align="center" size="small" style="padding-left:3px" data-tauri-drag-region>
          <n-avatar src="Icon-64.png" size="small" color="#00000000"/>
          <label data-tauri-drag-region>BangumiList</label>
        </n-flex>
        <n-flex align="center" :size="0">
          <label data-tauri-drag-region>File Name</label>
          <svg-icon type="mdi" :path="mdiCircleMedium"/>
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
      <n-divider style="margin:0px"/>
    </n-layout-header>

    <n-layout has-sider style="height:calc(100vh - 29px)">
      <!-- 侧边栏 -->
      <n-layout-sider bordered :width="56">
        <n-flex vertical justify="space-between" style="height:100%">
          <n-flex vertical align="center">
            <n-tooltip placement="right">
              <template #trigger>
                <n-button quaternary size="large">
                  <template #icon>
                    <svg-icon type="mdi" :path="mdiDatabasePlus"/>
                  </template>
                </n-button>
              </template>
              <label>{{ global.lang.getText("newDatabase") }}</label>
            </n-tooltip>
            <n-tooltip placement="right">
              <template #trigger>
                <n-button quaternary size="large">
                  <template #icon>
                    <svg-icon type="mdi" :path="mdiDatabaseCog"/>
                  </template>
                </n-button>
              </template>
              <label>{{ global.lang.getText("editDatabase") }}</label>
            </n-tooltip>
            <n-tooltip placement="right">
              <template #trigger>
                <n-button quaternary size="large">
                  <template #icon>
                    <svg-icon type="mdi" :path="mdiContentSave"/>
                  </template>
                </n-button>
              </template>
              <label>{{ global.lang.getText("saveDatabase") }}</label>
            </n-tooltip>
            <n-tooltip placement="right">
              <template #trigger>
                <n-button quaternary size="large">
                  <template #icon>
                    <svg-icon type="mdi" :path="mdiContentSavePlus"/>
                  </template>
                </n-button>
              </template>
              <label>{{ global.lang.getText("saveDatabaseAs") }}</label>
            </n-tooltip>
            <n-tooltip placement="right">
              <template #trigger>
                <n-button quaternary size="large">
                  <template #icon>
                    <svg-icon type="mdi" :path="mdiDatabaseRemove"/>
                  </template>
                </n-button>
              </template>
              <label>{{ global.lang.getText("closeDatabase") }}</label>
            </n-tooltip>
          </n-flex>
          <n-flex vertical justify="end" align="center" style="margin-bottom:8px">
            <n-tooltip placement="right">
              <template #trigger>
                <n-popselect v-model:value="global.lang.currentLang" :options="global.lang.langList" placement="right" size="large" trigger="click">
                  <n-button quaternary size="large">
                    <template #icon>
                      <svg-icon type="mdi" :path="mdiTranslate"/>
                    </template>
                  </n-button>
                </n-popselect>
              </template>
              <label>{{ global.lang.getText("language") }}</label>
            </n-tooltip>
            <n-tooltip placement="right">
              <template #trigger>
                <n-button quaternary size="large" @click="global.settingPage = !global.settingPage">
                  <template #icon>
                    <svg-icon type="mdi" :path="mdiCog"/>
                  </template>
                </n-button>
              </template>
              <label>{{ global.lang.getText("settings") }}</label>
            </n-tooltip>
          </n-flex>
        </n-flex>
      </n-layout-sider>
      <!-- 正文 -->
      <n-layout-content>
        <Settings v-if="global.settingPage"/>
        <Test v-else/>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import { Window } from "@tauri-apps/api/window"
import { NButton, NFlex, NAvatar, NDivider, NLayout, NLayoutHeader, NLayoutSider, NLayoutContent, NTooltip, NPopselect } from "naive-ui"
import SvgIcon from "@jamescoyle/vue-icon"
import { mdiClose, mdiCropSquare, mdiMinus, mdiCircleMedium, mdiCog, mdiTranslate,
  mdiDatabasePlus, mdiContentSave, mdiContentSavePlus, mdiDatabaseRemove, mdiDatabaseCog } from "@mdi/js"
import Settings from "./components/settings.vue"
import Test from "./components/Test.vue"
import global from "./plugins/global"

const appWindow = new Window("main")
</script>