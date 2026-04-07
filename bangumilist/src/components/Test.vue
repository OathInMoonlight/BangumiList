<template>
    <n-flex vertical>
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

<script setup lang="ts">
import { invoke } from "@tauri-apps/api/core"
import { NButton, NInput, NFlex} from "naive-ui"
import { ref } from "vue"

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