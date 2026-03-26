<script setup lang="ts">
import { ref } from "vue";
import { invoke } from "@tauri-apps/api/core";

import { NButton, NInput, NFlex, NAvatar, NIcon, NDivider } from "naive-ui"
import { Window } from '@tauri-apps/api/window';

import { CloseRound, MinimizeRound } from "@vicons/material"
import { FullScreenMaximize24Filled } from "@vicons/fluent"
import { DotMark } from "@vicons/carbon"

const appWindow = new Window('main');

const greetMsg = ref("");
const name = ref("");

async function greet() {
  greetMsg.value = await invoke("greet", { name: name.value });
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
  <n-flex vertical :size="0">
    <n-flex justify="space-between" data-tauri-drag-region>
      <n-flex align="center" size="small" style="padding-left:3px" data-tauri-drag-region>
        <n-avatar src="Icon-64.png" size="small" color="#00000000"/>
        <label data-tauri-drag-region>BangumiList</label>
      </n-flex>
      <n-flex align="center" :size="4">
        <label data-tauri-drag-region>File Name</label>
        <n-icon :component="DotMark"/>
      </n-flex>
      <n-flex justify="end" :size="0">
        <n-button quaternary size="small" @click="appWindow.minimize()">
          <template #icon>
            <n-icon :component="MinimizeRound" size="large"/>
          </template>
        </n-button>
        <n-button quaternary size="small" @click="appWindow.toggleMaximize()">
          <template #icon>
            <n-icon :component="FullScreenMaximize24Filled" size="large"/>
          </template>
        </n-button>
        <n-button secondary size="small" color="red" @click="appWindow.close()">
          <template #icon>
            <n-icon :component="CloseRound" size="large"/>
          </template>
        </n-button>
      </n-flex>
    </n-flex>
    <n-divider style="margin:0px"/>

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

  </n-flex>
</template>