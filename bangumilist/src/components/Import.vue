<template>
    <n-flex vertical align="center" style="padding: 16px">
        <n-flex justify="center">
            <h1>{{ global.lang.getText("import") }}</h1>
        </n-flex>
        <n-card embedded style="max-width: 512px; margin-bottom: 48px">
            <n-flex vertical :size="16">
                <p style="white-space: pre-line">{{ global.lang.getText("checkBeforeImport") }}</p>
                <n-flex justify="space-between" align="center">
                    {{ global.lang.getText("importPath") }}
                    <n-flex align="center" :wrap="false" style="width: 256px">
                        <n-input v-model:value="importPath" :placeholder="global.lang.getText('importPath')"/>
                        <n-button @click="browse">
                            {{ global.lang.getText("browse") }}
                        </n-button>
                    </n-flex>
                </n-flex>
            </n-flex>
        </n-card>
        <n-flex justify="space-evenly" align="center" style="width: 100%">
            <n-button size="large" @click="global.page = 'contents'" style="width: 512px">{{ global.lang.getText("cancel") }}</n-button>
            <n-button size="large" :color="global.primaryColor" @click="importCSV" style="width: 512px">{{ global.lang.getText("confirm") }}</n-button>
        </n-flex>
    </n-flex>
    <n-modal v-model:show="loadModal" :trap-focus="false" :close-on-esc="false" :mask-closable="false">
        <n-flex vertical justify="center" align="center">
            {{ global.lang.getText("importing") }}
            <n-spin size="large"/>
        </n-flex>
    </n-modal>
</template>

<script setup lang="ts">
import type { DataRow } from "../types/dataTypes"
import { open } from "@tauri-apps/plugin-dialog"
import { invoke } from "@tauri-apps/api/core"
import { NFlex, NCard, NInput, NButton, useDialog, useMessage, NModal, NSpin } from "naive-ui"
import { ref } from "vue"
import global from "../plugins/global"
import searchAndSort from "../plugins/searchAndSort"

const dialog = useDialog()
const message = useMessage()

const importPath = ref<string | null>(null)

const loadModal = ref(false)

async function browse() {
    importPath.value = await open({
        title: global.lang.getText("importPath"),
        multiple: false,
        directory: false,
        filters: [{
            name: "",
            extensions: ["csv"]
        }]
    })
    if(importPath.value === null) {
        global.errorDialog(dialog, "Error in Getting File Path")
    }
}

async function importCSV() {
    if(importPath.value === null) {
        message.warning(`${global.lang.getText("invalidValue")}: ${global.lang.getText("importPath")}`)
        return
    }
    loadModal.value = true
    try {
        const input = await invoke("import_csv", { pathStr: importPath.value }) as string
        const rows = []
        let tmpLine = []
        let tmpStr = ""
        let insideQuotes = false
        for(let i = 0; i < input.length; i++) {
            switch(input[i]) {
                case "\"":
                    if(input.length > i + 1 && input[i + 1] === "\"") {
                        tmpStr += "\""
                        i++
                    } else {
                        insideQuotes = !insideQuotes
                    }
                    break
                case ",":
                    if(insideQuotes) {
                        tmpStr += ","
                    } else {
                        tmpLine.push(tmpStr)
                        tmpStr = ""
                    }
                    break
                case "\n":
                    if(insideQuotes) {
                        tmpStr += "\n"
                    } else {
                        tmpLine.push(tmpStr)
                        tmpStr = ""
                        rows.push(tmpLine)
                        tmpLine = []
                    }
                    break
                case "\r":
                    if(insideQuotes) {
                        tmpStr += "\r"
                    } else {
                        if(input.length > i + 1 && input[i + 1] === "\n") {
                            continue
                        }
                        tmpLine.push(tmpStr)
                        tmpStr = ""
                        rows.push(tmpLine)
                        tmpLine = []
                    }
                    break
                default:
                    tmpStr += input[i]
                    break
            }
        }
        if(tmpStr !== "") {
            tmpLine.push(tmpStr)
        }
        if(tmpLine.length !== 0) {
            rows.push(tmpLine)
        }
        const isUnfoldChildTable = global.databaseData!.dualTable && rows[0].length > global.databaseData!.table1Info.length
        const childTableColumn = isUnfoldChildTable ? (global.databaseData!.gridView ? 2 : 1) : null
        let tmpPrimaryLine: DataRow = { 0: 0 }
        let tmpChild = []
        let tmpChildLine: DataRow = { 0: 0 }
        for(let i = 0; i < rows.length; i++) {
            if(i === 0) {
                continue
            }
            tmpPrimaryLine = { 0: 0 }
            for(const column of global.databaseData!.table1Info) {
                if(column.id === childTableColumn && isUnfoldChildTable) {
                    continue
                } else {
                    const columnId = (isUnfoldChildTable && column.id >= (childTableColumn as number)) ? column.id - 1 : column.id
                    switch(column.dataType) {
                        case "bool":
                            if(rows[i][columnId] === null || rows[i][columnId] === undefined || rows[i][columnId] === "") {
                                tmpPrimaryLine[column.id] = null
                            } else {
                                tmpPrimaryLine[column.id] = JSON.parse(rows[i][columnId].toLowerCase())
                            }
                            break
                        case "number":
                            if(rows[i][columnId] === null || rows[i][columnId] === undefined || rows[i][columnId] === "") {
                                tmpPrimaryLine[column.id] = null
                            } else {
                                tmpPrimaryLine[column.id] = JSON.parse(rows[i][columnId])
                            }
                            break
                        case "tag":
                            if(rows[i][columnId] === undefined || rows[i][columnId] === "") {
                                tmpPrimaryLine[column.id] = null
                            } else {
                                tmpPrimaryLine[column.id] = rows[i][columnId]
                            }
                            break
                        default:
                            tmpPrimaryLine[column.id] = rows[i][columnId]
                    }
                }
            }
            if(isUnfoldChildTable) {
                tmpChild = []
                for(let j = 0; j < (rows[0].length - global.databaseData!.table1Info.length) / global.databaseData!.table2Info.length; j++) {
                    if(rows[i][global.databaseData!.table1Info.length - 1 + global.databaseData!.table2Info.length * j] === "") {
                        break
                    }
                    tmpChildLine = { 0: 0 }
                    for(const column of global.databaseData!.table2Info) {
                        const columnId = global.databaseData!.table1Info.length - 1 + global.databaseData!.table2Info.length * j + column.id
                        switch(column.dataType) {
                            case "bool":
                                if(rows[i][columnId] === null || rows[i][columnId] === undefined || rows[i][columnId] === "") {
                                    tmpPrimaryLine[column.id] = null
                                } else {
                                    tmpPrimaryLine[column.id] = JSON.parse(rows[i][columnId].toLowerCase())
                                }
                                break
                            case "number":
                                if(rows[i][columnId] === null || rows[i][columnId] === undefined || rows[i][columnId] === "") {
                                    tmpPrimaryLine[column.id] = null
                                } else {
                                    tmpPrimaryLine[column.id] = JSON.parse(rows[i][columnId])
                                }
                                break
                            case "tag":
                                if(rows[i][columnId] === undefined || rows[i][columnId] === "") {
                                    tmpPrimaryLine[column.id] = null
                                } else {
                                    tmpPrimaryLine[column.id] = rows[i][columnId]
                                }
                                break
                            default:
                                tmpChildLine[column.id] = rows[i][columnId]
                        }
                    }
                    tmpChild.push(tmpChildLine)
                    if(global.databaseData!.table1Info.length - 1 + global.databaseData!.table2Info.length * (j + 1) >= rows[i].length) {
                        break
                    }
                }
                tmpPrimaryLine[childTableColumn as number] = JSON.stringify(tmpChild)
            }
            global.databaseData!.tableData.push(tmpPrimaryLine)
        }
        global.page = "contents"
        loadModal.value = false
        global.databaseSaved = false
        searchAndSort.filterFunc()
        message.success(global.lang.getText("importSuccess"))
    } catch(error) {
        loadModal.value = false
        global.errorDialog(dialog, error)
    }
}
</script>