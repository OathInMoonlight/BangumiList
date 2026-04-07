<script setup lang="ts">
import { ref } from "vue"
import { invoke } from "@tauri-apps/api/core"

import { NButton, NInput, NFlex, NAvatar, NDivider, NLayout, NLayoutHeader, NLayoutSider, NLayoutContent, NPopover } from "naive-ui"
import { Window } from '@tauri-apps/api/window'

import SvgIcon from '@jamescoyle/vue-icon'
import { mdiClose, mdiCropSquare, mdiMinus, mdiCircleMedium, mdiCog, mdiTranslate, mdiDatabasePlus, mdiContentSave, mdiContentSavePlus, mdiDatabaseRemove, mdiDatabaseCog } from '@mdi/js'

const appWindow = new Window('main')

const greetMsg = ref("")
const name = ref("")

async function greet() {
  greetMsg.value = await invoke("greet", { name: name.value })
}

const path = ref("")
const data = ref({ path: "", grid_view: false })
async function getData(path: string) {
  data.value = await invoke("read_db", { pathStr: path })
}
async function saveData() {
  data.value.path = path.value
  data.value.grid_view = false
  await invoke("write_db", { dbData: data.value })
}
</script>

<template>
  <n-layout>
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
      <n-layout-sider bordered :width="56">
        <n-flex vertical justify="space-between" style="height:100%">
          <n-flex vertical align="center">
            <n-popover placement="right" :show-arrow="false">
              <template #trigger>
                <n-button quaternary size="large">
                  <template #icon>
                    <svg-icon type="mdi" :path="mdiDatabasePlus"/>
                  </template>
                </n-button>
              </template>
              <label>New Database</label>
            </n-popover>
            <n-popover placement="right" :show-arrow="false">
              <template #trigger>
                <n-button quaternary size="large">
                  <template #icon>
                    <svg-icon type="mdi" :path="mdiDatabaseCog"/>
                  </template>
                </n-button>
              </template>
              <label>Edit Database</label>
            </n-popover>
            <n-popover placement="right" :show-arrow="false">
              <template #trigger>
                <n-button quaternary size="large">
                  <template #icon>
                    <svg-icon type="mdi" :path="mdiContentSave"/>
                  </template>
                </n-button>
              </template>
              <label>Save Database</label>
            </n-popover>
            <n-popover placement="right" :show-arrow="false">
              <template #trigger>
                <n-button quaternary size="large">
                  <template #icon>
                    <svg-icon type="mdi" :path="mdiContentSavePlus"/>
                  </template>
                </n-button>
              </template>
              <label>Save Database As</label>
            </n-popover>
            <n-popover placement="right" :show-arrow="false">
              <template #trigger>
                <n-button quaternary size="large">
                  <template #icon>
                    <svg-icon type="mdi" :path="mdiDatabaseRemove"/>
                  </template>
                </n-button>
              </template>
              <label>Close Database</label>
            </n-popover>
          </n-flex>
          <n-flex vertical justify="end" align="center" style="margin-bottom:8px">
            <n-popover placement="right" :show-arrow="false">
              <template #trigger>
                <n-button quaternary size="large">
                  <template #icon>
                    <svg-icon type="mdi" :path="mdiTranslate"/>
                  </template>
                </n-button>
              </template>
              <label>Language</label>
            </n-popover>
            <n-popover placement="right" :show-arrow="false">
              <template #trigger>
                <n-button quaternary size="large">
                  <template #icon>
                    <svg-icon type="mdi" :path="mdiCog"/>
                  </template>
                </n-button>
              </template>
              <label>Setting</label>
            </n-popover>
          </n-flex>
        </n-flex>
      </n-layout-sider>
      <n-layout-content>
        <div>
          <n-input v-model:value="name" type="text" style="width:50%"/>
          <n-button @click="greet">Greet</n-button>
          <p>{{ greetMsg }}</p>
        </div>

        <div>
          <n-input v-model:value="path" type="text" style="width:50%"/>
          <n-button @click="getData(path)">Get Data</n-button>
          <n-button @click="saveData">Save Data</n-button>
          <p>{{ data }}</p>
        </div>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>