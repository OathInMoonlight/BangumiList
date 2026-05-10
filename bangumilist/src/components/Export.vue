<template>
    <n-flex vertical align="center" style="padding: 16px">
        <n-flex justify="center">
            <h1>{{ global.lang.getText("export") }}</h1>
        </n-flex>
        <n-card embedded style="max-width: 512px; margin-bottom: 48px">
            <n-flex vertical :size="16">
                <n-flex justify="space-between" align="center">
                    {{ global.lang.getText("exportPath") }}
                    <n-flex align="center" :wrap="false" style="width: 256px">
                        <n-input v-model:value="exportPath" :placeholder="global.lang.getText('exportPath')"/>
                        <n-button @click="browse">
                            {{ global.lang.getText("browse") }}
                        </n-button>
                    </n-flex>
                </n-flex>
                <n-flex justify="space-between" align="center">
                    {{ global.lang.getText("exportLanguage") }}
                    <n-select v-model:value="exportLang" :options="global.lang.langList" style="width: 256px"/>
                </n-flex>
                <n-flex justify="space-between" align="center">
                    {{ global.lang.getText("unfoldChildTable") }}
                    <colored-switch v-model="unfoldChildTable" checked-label="" unchecked-label="" :disabled="!global.databaseData!.dualTable"/>
                </n-flex>
            </n-flex>
        </n-card>
        <n-flex justify="space-evenly" align="center" style="width: 100%">
            <n-button size="large" @click="global.page = 'contents'" style="width: 512px">{{ global.lang.getText("cancel") }}</n-button>
            <n-button size="large" :color="global.primaryColor" @click="exportCSV" style="width: 512px">{{ global.lang.getText("confirm") }}</n-button>
        </n-flex>
    </n-flex>
    <n-modal v-model:show="loadModal" :trap-focus="false" :close-on-esc="false" :mask-closable="false">
        <n-flex vertical justify="center" align="center">
            {{ global.lang.getText("exporting") }}
            <n-spin size="large"/>
        </n-flex>
    </n-modal>
</template>

<script setup lang="ts">
import { save } from "@tauri-apps/plugin-dialog"
import { invoke } from "@tauri-apps/api/core"
import { NFlex, NCard, NInput, NButton, NSelect, useDialog, useMessage, NModal, NSpin } from "naive-ui"
import { ref } from "vue"
import ColoredSwitch from "./ColoredSwitch.vue"
import global from "../plugins/global"

const dialog = useDialog()
const message = useMessage()

const exportPath = ref<string | null>(null)
const exportLang = ref(global.lang.currentLang)
const unfoldChildTable = ref(true)

const loadModal = ref(false)

async function browse() {
    exportPath.value = await save({
        title: global.lang.getText("exportAs"),
        defaultPath: `${global.databaseData!.path.substring(0, global.databaseData!.path.lastIndexOf("."))}.csv`,
        filters: [{
            name: "",
            extensions: ["csv"]
        }]
    })
    if(exportPath.value === null) {
        global.errorDialog(dialog, "Error in Getting File Path")
    }
}

async function exportCSV() {
    if(exportPath.value === null) {
        message.warning(`${global.lang.getText("invalidValue")}: ${global.lang.getText("exportPath")}`)
        return
    }
    loadModal.value = true
    const createCSVCell = (value: unknown) => {
        if(typeof value === "string") {
            if(value.includes(",") || value.includes("\"") || value.includes("\n") || value.includes("\r")) {
                return `"${value.replaceAll("\"", "\"\"")}"`
            } else {
                return value
            }
        } else {
            return String(value)
        }
    }
    const outputLines = []
    let tmpLine = []
    for(const column of global.databaseData!.table1Info) {
        if(column.id === (global.databaseData!.gridView ? 2 : 1) && global.databaseData!.dualTable && unfoldChildTable.value) {
            continue
        }
        tmpLine.push(createCSVCell(column.title[exportLang.value]))
    }
    if(global.databaseData!.dualTable && unfoldChildTable.value) {
        let maxChildLength = 0
        for(const row of global.databaseData!.tableData) {
            const childLength = JSON.parse(row[global.databaseData!.gridView ? "2" : "1"] as string).length
            if(childLength > maxChildLength) {
                maxChildLength = childLength
            }
        }
        for(let i = 0; i < maxChildLength; i++) {
            for(const column of global.databaseData!.table2Info) {
                tmpLine.push(createCSVCell(column.title[exportLang.value]))
            }
        }
    }
    outputLines.push(tmpLine.join(","))
    for(const row of global.databaseData!.tableData) {
        tmpLine = []
        for(const key in row) {
            if(key === (global.databaseData!.gridView ? "2" : "1") && global.databaseData!.dualTable && unfoldChildTable.value) {
                continue
            }
            tmpLine.push(createCSVCell(row[key]))
        }
        if(global.databaseData!.dualTable && unfoldChildTable.value) {
            const tmpChild = JSON.parse(row[global.databaseData!.gridView ? "2" : "1"] as string)
            for(const childRow of tmpChild) {
                for(const childKey in childRow) {
                    tmpLine.push(createCSVCell(childRow[childKey]))
                }
            }
        }
        outputLines.push(tmpLine.join(","))
    }
    try {
        await invoke("export_csv", { pathStr: exportPath.value, contents: outputLines.join("\n") })
        global.page = "contents"
        loadModal.value = false
        message.success(global.lang.getText("exportSuccess"))
    } catch(error) {
        loadModal.value = false
        global.errorDialog(dialog, error)
    }
}
</script>