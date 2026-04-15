<template>
    <n-flex justify="center" align="center" style="height: 100%">
        <div ref="dropArea">
            <n-button dashed @click="fileOpenDialog" style="width: 512px; height: 256px">
                <n-flex vertical justify="space-evenly" align="center" :size="32">
                    <SvgIcon type="mdi" :path="mdiFileUpload" :size="64"/>
                    <h2 style="margin: 0">{{ global.lang.getText("clickOrDragToOpen") }}</h2>
                </n-flex>
            </n-button>
        </div>
    </n-flex>
</template>

<script setup lang="ts">
import { open } from "@tauri-apps/plugin-dialog"
import { getCurrentWebview } from "@tauri-apps/api/webview"
import { invoke } from "@tauri-apps/api/core"
import { NFlex, NButton, useDialog } from "naive-ui"
import SvgIcon from "@jamescoyle/vue-icon"
import { mdiFileUpload } from "@mdi/js"
import { onMounted, onUnmounted, useTemplateRef } from "vue"
import global from "../plugins/global"

const dialog = useDialog()

function openErrorDialog(errorMessage: unknown) {
    dialog.error({
        title: global.lang.getText("error"),
        content: String(errorMessage),
        positiveText: global.lang.getText("confirm"),
        closable: false,
        maskClosable: false
    })
}

async function loadDatabase(path: string) {
    try {
        global.databaseData = await invoke("read_db", { pathStr: path })
        console.log(global.databaseData)
    } catch(error) {
        openErrorDialog(error)
    }
    global.databaseLoaded = true
}

async function fileOpenDialog() {
    const path = await open({
        title: global.lang.getText("openDatabase"),
        multiple: false,
        directory: false,
        filters: [{
            name: "",
            extensions: ["db"]
        }]
    })
    if(path === null) {
        openErrorDialog("Error in Getting File Path")
    } else {
        loadDatabase(path)
    }
}

const dropAreaBox = useTemplateRef("dropArea")
let unlisten: (() => void) | null = null
onMounted(async () => {
    unlisten = await getCurrentWebview().onDragDropEvent((event) => {
        try {
            const dropArea = dropAreaBox.value?.getBoundingClientRect()
            if (event.payload.type === 'drop') {
                if(event.payload.position.x >= dropArea?.left! &&
                    event.payload.position.x <= dropArea?.right! &&
                    event.payload.position.y >= dropArea?.top! &&
                    event.payload.position.y <= dropArea?.bottom!) {
                    loadDatabase(event.payload.paths[0])
                }
            }
        } catch (error) {
            openErrorDialog(error)
        }
    })
})

onUnmounted(() => {
    if (unlisten) unlisten()
})
</script>