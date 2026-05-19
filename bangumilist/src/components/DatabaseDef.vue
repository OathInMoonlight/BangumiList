<template>
    <n-flex vertical style="padding: 16px">
        <h2 style="margin: 0">{{ global.lang.getText("databaseSettings") }}</h2>
        <n-flex align="center">
            <Colored-switch v-model="newDatabaseDef.gridView" :checked-label="global.lang.getText('gridViewOn')" :unchecked-label="global.lang.getText('gridViewOff')" :disabled="global.databaseLoaded"/>
            <Colored-switch v-model="newDatabaseDef.dualTable" :checked-label="global.lang.getText('dualTableOn')" :unchecked-label="global.lang.getText('dualTableOff')" :disabled="global.databaseLoaded"/>
        </n-flex>
        <n-divider/>
        <h3 style="margin: 0">{{ global.lang.getText("primaryTableSetting") }}</h3>
        <n-flex v-if="newDatabaseDef.gridView" align="center">
            <n-input-group style="width: auto">
                <n-input-group-label>{{ global.lang.getText("gridLabel") }}</n-input-group-label>
                <n-input-number v-model:value="newDatabaseDef.table1Label" :placeholder="global.lang.getText('gridLabel')" :min="0" :max="newDatabaseDef.table1Info.length - 1" style="width: 256px"/>
            </n-input-group>
            <n-input-group style="width: auto">
                <n-input-group-label>{{ global.lang.getText("gridTitle") }}</n-input-group-label>
                <n-input v-model:value="newDatabaseDef.table1Title" :placeholder="global.lang.getText('gridTitle')" style="width: 256px"/>
            </n-input-group>
        </n-flex>
        <n-flex vertical>
            <column-def v-for="column in newDatabaseDef.table1Info" :key="column.id" v-model="newDatabaseDef.table1Info[column.id]" :move-up="() => moveColumnUp(false, column.id)"
                :move-down="() => moveColumnDown(false, column.id)" :delete-column="() => deleteColumn(false, column.id)"
                :index-min="minIndex + (newDatabaseDef.dualTable ? 1 : 0)" :index-max="newDatabaseDef.table1Info.length - 1" :user-index-min="userIndexMin[0]"/>
            <n-popover placement="top">
                <template #trigger>
                    <n-button secondary size="large" @click="addNewColumn(false)" style="width: 100%">
                        <template #icon>
                            <svg-icon type="mdi" :path="mdiPlus"/>
                        </template>
                    </n-button>
                </template>
                {{ global.lang.getText("addNewColumn") }}
            </n-popover>
        </n-flex>
        <n-flex v-if="newDatabaseDef.dualTable" vertical>
            <n-divider/>
            <h3 style="margin: 0">{{ global.lang.getText("childTableSetting") }}</h3>
            <n-flex v-if="newDatabaseDef.gridView" align="center">
                <n-input-group style="width: auto">
                    <n-input-group-label>{{ global.lang.getText("gridLabel") }}</n-input-group-label>
                    <n-input-number v-model:value="newDatabaseDef.table2Label" :placeholder="global.lang.getText('gridLabel')" :min="0" :max="newDatabaseDef.table2Info.length - 1" style="width: 256px"/>
                </n-input-group>
                <n-input-group style="width: auto">
                    <n-input-group-label>{{ global.lang.getText("gridTitle") }}</n-input-group-label>
                    <n-input v-model:value="newDatabaseDef.table2Title" :placeholder="global.lang.getText('gridTitle')" style="width: 256px"/>
                </n-input-group>
            </n-flex>
            <n-flex vertical>
                <column-def v-for="column in newDatabaseDef.table2Info" :key="column.id" v-model="newDatabaseDef.table2Info[column.id]" :move-up="() => moveColumnUp(true, column.id)"
                    :move-down="() => moveColumnDown(true, column.id)" :delete-column="() => deleteColumn(true, column.id)"
                    :index-min="minIndex" :index-max="newDatabaseDef.table2Info.length - 1" :user-index-min="userIndexMin[1]"/>
                <n-popover placement="top">
                    <template #trigger>
                        <n-button secondary size="large" @click="addNewColumn(true)" style="width: 100%">
                            <template #icon>
                                <svg-icon type="mdi" :path="mdiPlus"/>
                            </template>
                        </n-button>
                    </template>
                    {{ global.lang.getText("addNewColumn") }}
                </n-popover>
            </n-flex>
        </n-flex>
        <n-divider/>
        <n-flex justify="space-evenly" align="center">
            <n-button size="large" @click="cancel" style="width: 512px">{{ global.lang.getText("cancel") }}</n-button>
            <n-button size="large" :color="global.primaryColor" @click="confirm" style="width: 512px">{{ global.lang.getText("confirm") }}</n-button>
        </n-flex>
    </n-flex>
</template>

<script setup lang="ts">
import type { DatabaseData, InputColumn, Column } from "../types/dataTypes"
import { NFlex, NDivider, NInputGroup, NInputGroupLabel, NInputNumber, NInput, NPopover, NButton, useMessage } from "naive-ui"
import SvgIcon from "@jamescoyle/vue-icon"
import { mdiPlus } from "@mdi/js"
import { computed, reactive, toRaw, watch } from "vue"
import global from "../plugins/global"
import ColoredSwitch from "./ColoredSwitch.vue"
import ColumnDef from "./ColumnDef.vue"

const message = useMessage()

const newDatabaseDef: Omit<DatabaseData, "path" | "table1Title" | "table2Title" | "table1Info" | "table2Info" | "tableData" | "sort1" | "sort2" | "groupSort1" | "groupSort2"> & {
        table1Title: string, table2Title: string, table1Info: InputColumn[], table2Info: InputColumn[]
    } = reactive({
    gridView: false, dualTable: false, table1Label: null, table2Label: null, table1Title: "[]", table2Title: "[]", table1Info: [], table2Info: []
})
const createIdColumn = (): InputColumn => ({
    id: 0, dataType: "number", title: toRaw(global.lang.text.id), sortMap: 0, groupType: "none", ifDisplay: true, displayLang: "none", valuePreset: "none"
})
const createCoverColumn = (): InputColumn => ({
    id: 1, dataType: "paragraph", title: toRaw(global.lang.text.cover), sortMap: 1, groupType: "none", ifDisplay: false, displayLang: "none", valuePreset: "none"
})
const createChildTableColumn = (): InputColumn => ({
    id: 1, dataType: "paragraph", title: toRaw(global.lang.text.childTable), sortMap: 1, groupType: "none", ifDisplay: false, displayLang: "none", valuePreset: "none"
})
const createDefaultColumn = (): InputColumn => ({
    id: 0, dataType: null, title: { zh: "", ja: "", en: "" }, sortMap: 0, groupType: "none", ifDisplay: true, displayLang: "none", valuePreset: "none"
})
const stringifyColumns = (columns: Column[]) => structuredClone(toRaw(columns)).map(column => ({
    ...column, dataType: column.dataType,
    groupType: (column.groupType === "none" || column.groupType === "alphabet") ? column.groupType : JSON.stringify(column.groupType),
    valuePreset: column.valuePreset === "none" ? column.valuePreset : JSON.stringify(column.valuePreset)
}))
const userIndexMin = [0, 0]
if(global.databaseLoaded) {
    newDatabaseDef.gridView = global.databaseData!.gridView
    newDatabaseDef.dualTable = global.databaseData!.dualTable
    newDatabaseDef.table1Label = global.databaseData!.table1Label
    newDatabaseDef.table2Label = global.databaseData!.table2Label
    newDatabaseDef.table1Title = JSON.stringify(global.databaseData!.table1Title)
    newDatabaseDef.table2Title = JSON.stringify(global.databaseData!.table2Title)
    newDatabaseDef.table1Info = stringifyColumns(global.databaseData!.table1Info)
    newDatabaseDef.table2Info = stringifyColumns(global.databaseData!.table2Info)
    userIndexMin[0] = newDatabaseDef.table1Info.length
    userIndexMin[1] = newDatabaseDef.table2Info.length
} else {
    newDatabaseDef.table1Info.push(createIdColumn())
}

const minIndex = computed(() => newDatabaseDef.gridView ? 2 : 1)
watch(() => newDatabaseDef.gridView, (newGridView) => {
    if(newGridView) {
        newDatabaseDef.table1Info.splice(1, 0, createCoverColumn())
        for(let i = 2; i < newDatabaseDef.table1Info.length; i++) {
            newDatabaseDef.table1Info[i].id = i
            newDatabaseDef.table1Info[i].sortMap += newDatabaseDef.table1Info[i].sortMap === i - 1 ? 1 : 0
        }
        if(newDatabaseDef.dualTable) {
            newDatabaseDef.table1Info[1].dataType = "number"
            newDatabaseDef.table2Info.splice(1, 0, createCoverColumn())
            for(let i = 2; i < newDatabaseDef.table2Info.length; i++) {
                newDatabaseDef.table2Info[i].id = i
                newDatabaseDef.table2Info[i].sortMap += newDatabaseDef.table2Info[i].sortMap === i - 1 ? 1 : 0
            }
        }

    } else {
        newDatabaseDef.table1Info.splice(1, 1)
        for(let i = 1; i < newDatabaseDef.table1Info.length; i++) {
            newDatabaseDef.table1Info[i].id = i
            newDatabaseDef.table1Info[i].sortMap -= newDatabaseDef.table1Info[i].sortMap === i + 1 ? 1 : 0
        }
        if(newDatabaseDef.dualTable) {
            newDatabaseDef.table2Info.splice(1, 1)
            for(let i = 1; i < newDatabaseDef.table2Info.length; i++) {
                newDatabaseDef.table2Info[i].id = i
                newDatabaseDef.table2Info[i].sortMap -= newDatabaseDef.table2Info[i].sortMap === i + 1 ? 1 : 0
            }
        }
    }
})
watch(() => newDatabaseDef.dualTable, (newDualTable) => {
    if(newDualTable) {
        newDatabaseDef.table1Info.splice(minIndex.value, 0, createChildTableColumn())
        newDatabaseDef.table2Info.push(createIdColumn())
        if(newDatabaseDef.gridView) {
            newDatabaseDef.table1Info[1].dataType = "number"
            newDatabaseDef.table1Info[2].id = 2
            newDatabaseDef.table1Info[2].sortMap = 2
            newDatabaseDef.table2Info.splice(1, 0, createCoverColumn())
        }
        for(let i = minIndex.value + 1; i < newDatabaseDef.table1Info.length; i++) {
            newDatabaseDef.table1Info[i].id = i
            newDatabaseDef.table1Info[i].sortMap += newDatabaseDef.table1Info[i].sortMap === i - 1 ? 1 : 0
        }
    } else {
        newDatabaseDef.table1Info.splice(minIndex.value, 1)
        newDatabaseDef.table2Info = []
        if(newDatabaseDef.gridView) {
            newDatabaseDef.table1Info[1].dataType = "paragraph"
        }
        for(let i = minIndex.value; i < newDatabaseDef.table1Info.length; i++) {
            newDatabaseDef.table1Info[i].id = i
            newDatabaseDef.table1Info[i].sortMap -= newDatabaseDef.table1Info[i].sortMap === i + 1 ? 1 : 0
        }
    }
})
function moveColumnUp(isChildTable: boolean, columnId: number) {
    const tableInfoPointer = isChildTable ? newDatabaseDef.table2Info : newDatabaseDef.table1Info
    const tmpColumn = tableInfoPointer[columnId]
    tableInfoPointer[columnId] = tableInfoPointer[columnId - 1]
    tableInfoPointer[columnId - 1] = tmpColumn
    tableInfoPointer[columnId - 1].id = columnId - 1
    tableInfoPointer[columnId].id = columnId
    tableInfoPointer[columnId - 1].sortMap -= tableInfoPointer[columnId - 1].sortMap === columnId ? 1 : 0
    tableInfoPointer[columnId].sortMap += tableInfoPointer[columnId].sortMap === columnId - 1 ? 1 : 0
}
function deleteColumn(isChildTable: boolean, columnId: number) {
    const tableInfoPointer = isChildTable ? newDatabaseDef.table2Info : newDatabaseDef.table1Info
    tableInfoPointer.splice(columnId, 1)
    for(let i = columnId; i < tableInfoPointer.length; i++) {
        tableInfoPointer[i].id = i
        tableInfoPointer[i].sortMap -= tableInfoPointer[i].sortMap === i - 1 ? 1 : 0
    }
}
function moveColumnDown(isChildTable: boolean, columnId: number) {
    const tableInfoPointer = isChildTable ? newDatabaseDef.table2Info : newDatabaseDef.table1Info
    const tmpColumn = tableInfoPointer[columnId]
    tableInfoPointer[columnId] = tableInfoPointer[columnId + 1]
    tableInfoPointer[columnId + 1] = tmpColumn
    tableInfoPointer[columnId + 1].id = columnId + 1
    tableInfoPointer[columnId].id = columnId
    tableInfoPointer[columnId + 1].sortMap += tableInfoPointer[columnId + 1].sortMap === columnId ? 1 : 0
    tableInfoPointer[columnId].sortMap -= tableInfoPointer[columnId].sortMap === columnId + 1 ? 1 : 0
}
function addNewColumn(isChildTable: boolean) {
    const tableInfoPointer = isChildTable ? newDatabaseDef.table2Info : newDatabaseDef.table1Info
    tableInfoPointer.push({
        ...createDefaultColumn(), id: tableInfoPointer.length, sortMap: tableInfoPointer.length
    })
}

function cancel() {
    global.page = global.databaseLoaded ? "contents" : "open"
}
function confirm() {
    const warning = (isChildTable: boolean, columnIndex: number, columnName: string) => message.warning(`${global.lang.getText("invalidValue")}: ${
        isChildTable ? global.lang.getText("childTableSetting") : global.lang.getText("primaryTableSetting")} -> ${
        global.lang.getText("column")} ${columnIndex} -> ${global.lang.getText(columnName)}`)
    const inputChecker = (isChildTable: boolean) => {
        const tableLabel = isChildTable ? newDatabaseDef.table2Label : newDatabaseDef.table1Label
        const tableInfo = isChildTable ? newDatabaseDef.table2Info : newDatabaseDef.table1Info
        if(tableLabel !== null && (tableLabel < 0 || tableLabel >= tableInfo.length)) {
            message.warning(`${global.lang.getText("invalidValue")}: ${isChildTable ? global.lang.getText("childTableSetting") : global.lang.getText("primaryTableSetting")} -> ${global.lang.getText("gridLabel")}`)
            return false
        }
        for(let index = 0; index < tableInfo.length; index++) {
            const column = tableInfo[index]
            if(column.id !== index) {
                warning(isChildTable, index, "id")
                return false
            }
            if(column.dataType !== "bool" && column.dataType !== "tag" && column.dataType !== "number" && column.dataType !== "text" && column.dataType !== "paragraph") {
                warning(isChildTable, index, "columnType")
                return false
            }
            if(column.sortMap < 0 || column.sortMap >= tableInfo.length) {
                warning(isChildTable, index, "columnSortMap")
                return false
            }
            if(column.groupType !== "none" && column.groupType !== "alphabet") {
                try {
                    const groupType = JSON.parse(column.groupType)
                    if(!Array.isArray(groupType)) {
                        throw new Error
                    }
                } catch(error) {
                    warning(isChildTable, index, "columnGroupType")
                    return false
                }
            }
            if(column.displayLang !== "none" && column.displayLang !== "zh" && column.displayLang !== "ja" && column.displayLang !== "en") {
                warning(isChildTable, index, "columnDisplayAsLang")
                return false
            }
            if(column.valuePreset !== "none") {
                try {
                    const valuePreset = JSON.parse(column.valuePreset)
                    if(typeof valuePreset !== "object" || valuePreset === null) {
                        throw new Error
                    }
                    for(const key in valuePreset) {
                        if(typeof valuePreset[key] !== "object" || (valuePreset[key].hasOwnProperty("title") && (!valuePreset[key].title.hasOwnProperty("zh") || typeof valuePreset[key].title.zh !== "string"
                            || !valuePreset[key].title.hasOwnProperty("ja") || typeof valuePreset[key].title.ja !== "string" || !valuePreset[key].title.hasOwnProperty("en")
                            || typeof valuePreset[key].title.en !== "string")) || (valuePreset[key].hasOwnProperty("color") && typeof valuePreset[key].color !== "string")
                            || (valuePreset[key].hasOwnProperty("icon") && typeof valuePreset[key].icon !== "string")) {
                            throw new Error
                        }
                    }
                } catch(error) {
                    warning(isChildTable, index, "columnValuePreset")
                    return false
                }
            }
        }
        return true
    }
    try {
        const table1Title = JSON.parse(newDatabaseDef.table1Title)
        const table2Title = JSON.parse(newDatabaseDef.table2Title)
        if(!Array.isArray(table1Title) || table1Title.some(column => typeof column !== "number" || column < 0 || column >= newDatabaseDef.table1Info.length)) {
            throw new Error("primary")
        }
        if(!Array.isArray(table2Title) || table2Title.some(column => typeof column !== "number" || column < 0 || column >= newDatabaseDef.table2Info.length)) {
            throw new Error("child")
        }
    } catch(error: unknown) {
        if(error instanceof Error) {
            message.warning(`${global.lang.getText("invalidValue")}: ${error.message === "child" ? global.lang.getText("childTableSetting") : global.lang.getText("primaryTableSetting")} -> ${global.lang.getText("gridTitle")}`)
        } else {
            message.warning(`${global.lang.getText("invalidValue")}: Unknown ${global.lang.getText("gridTitle")}`)
        }
        return
    }
    if(!inputChecker(false) || !inputChecker(true)) {
        return
    }
    const parseColumns = (columns: InputColumn[]) => columns.map(column => ({
        ...column, dataType: column.dataType, title: toRaw(column.title),
        groupType: (column.groupType === "none" || column.groupType === "alphabet") ? column.groupType : JSON.parse(column.groupType),
        valuePreset: column.valuePreset === "none" ? column.valuePreset : JSON.parse(column.valuePreset)
    })) as Column[]
    if(!global.databaseLoaded) {
        global.databaseData = {
            path: "",
            gridView: newDatabaseDef.gridView,
            dualTable: newDatabaseDef.dualTable,
            table1Label: newDatabaseDef.table1Label,
            table2Label: newDatabaseDef.table2Label,
            table1Title: JSON.parse(newDatabaseDef.table1Title),
            table2Title: JSON.parse(newDatabaseDef.table2Title),
            table1Info: parseColumns(newDatabaseDef.table1Info),
            table2Info: parseColumns(newDatabaseDef.table2Info),
            tableData: [],
            sort1: { column: null, order: "-" },
            sort2: { column: null, order: "-" },
            groupSort1: { column: null, order: "-" },
            groupSort2: { column: null, order: "-" }
        }
    } else {
        global.databaseData!.table1Label = newDatabaseDef.table1Label
        global.databaseData!.table2Label = newDatabaseDef.table2Label
        global.databaseData!.table1Title = JSON.parse(newDatabaseDef.table1Title)
        global.databaseData!.table2Title = JSON.parse(newDatabaseDef.table2Title)
        global.databaseData!.table1Info = parseColumns(newDatabaseDef.table1Info)
        global.databaseData!.table2Info = parseColumns(newDatabaseDef.table2Info)
    }
    global.databaseLoaded = true
    global.page = "contents"
    global.databaseSaved = false
}
</script>