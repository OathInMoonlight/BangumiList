<script setup lang="ts">
import { ref } from "vue";
import { invoke } from "@tauri-apps/api/core";

import { NButton, NInput, NFlex } from "naive-ui"
import { Window } from '@tauri-apps/api/window';

const appWindow = new Window('main');

const greetMsg = ref("");
const name = ref("");

async function greet() {
  greetMsg.value = await invoke("greet", { name: name.value });
}

const path = ref("")
const data = ref({})
async function getData(path: string) {
  data.value = await invoke("read_db", { path })
}
</script>

<template>
  <n-flex vertical>
    <n-flex justify="flex-end" align="start" data-tauri-drag-region>
      <n-button @click="appWindow.close()">close</n-button>
      <n-button @click="appWindow.toggleMaximize()">toggleMaximize</n-button>
      <n-button @click="appWindow.minimize()">minimize</n-button>
    </n-flex>

    <div>
      <n-input v-model:value="name" type="text" :style="{width:'50%'}"/>
      <n-button @click="greet">Greet</n-button>
      <p>{{ greetMsg }}</p>
    </div>

    <div>
      <n-input v-model:value="path" type="text" :style="{width:'50%'}"/>
      <n-button @click="getData(path)">Get Data</n-button>
      <p>{{ data }}</p>
    </div>

  </n-flex>
</template>