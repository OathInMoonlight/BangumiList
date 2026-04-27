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
import type { DatabaseData, Column } from "../types/dataTypes"
import { open } from "@tauri-apps/plugin-dialog"
import { getCurrentWebview } from "@tauri-apps/api/webview"
import { invoke } from "@tauri-apps/api/core"
import { NFlex, NButton, useDialog } from "naive-ui"
import SvgIcon from "@jamescoyle/vue-icon"
import { mdiFileUpload } from "@mdi/js"
import { onMounted, onUnmounted, useTemplateRef } from "vue"
import global from "../plugins/global"

type TransportColumn = Omit<Column, "title" | "groupType" | "valuePreset"> & {
    title: string
    groupType: string
    valuePreset: string
}

type TransportDatabaseData = Omit<DatabaseData, "table1Info" | "table2Info" | "sort1" | "sort2" | "groupSort1" | "groupSort2"> & {
    table1Info: TransportColumn[]
    table2Info: TransportColumn[]
    sort1: string
    sort2: string
    groupSort1: string
    groupSort2: string
}

const dialog = useDialog()

async function loadDatabase(path: string) {
    try {
        const transportData = await invoke<TransportDatabaseData>("read_db", { pathStr: path })
        global.databaseData = {
            path: transportData.path,
            gridView: transportData.gridView,
            dualTable: transportData.dualTable,
            table1Label: transportData.table1Label,
            table2Label: transportData.table2Label,
            table1Info: transportData.table1Info.map(column => ({
                ...column, title: JSON.parse(column.title), groupType: JSON.parse(column.groupType), valuePreset: JSON.parse(column.valuePreset)
            })),
            table2Info: transportData.table2Info.map(column => ({
                ...column, title: JSON.parse(column.title), groupType: JSON.parse(column.groupType), valuePreset: JSON.parse(column.valuePreset)
            })),
            tableData: transportData.tableData,
            sort1: JSON.parse(transportData.sort1),
            sort2: JSON.parse(transportData.sort2),
            groupSort1: JSON.parse(transportData.groupSort1),
            groupSort2: JSON.parse(transportData.groupSort2)
        }
        global.databaseLoaded = true
        global.page = "contents"
    } catch(error) {
        global.errorDialog(dialog, error)
    }
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
        global.errorDialog(dialog, "Error in Getting File Path")
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
            global.errorDialog(dialog, error)
        }
    })
})

onUnmounted(() => {
    if (unlisten) unlisten()
})
</script>