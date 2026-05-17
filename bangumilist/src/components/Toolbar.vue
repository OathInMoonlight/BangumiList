<template>
    <n-flex vertical size="large" style="padding-bottom: 12px">
        <n-card embedded content-style="padding: 4px">
            <n-flex justify="space-between" align="center">
                <n-flex align="center" size="small">
                    <n-popover placement="bottom">
                        <template #trigger>
                            <n-button quaternary circle size="large" @click="global.page = 'newRow'">
                                <template #icon>
                                    <svg-icon type="mdi" :path="mdiPlus"/>
                                </template>
                            </n-button>
                        </template>
                        {{ global.lang.getText("plus") }}
                    </n-popover>
                    <n-popover placement="bottom">
                        <template #trigger>
                            <n-button quaternary circle size="large" @click="global.page = 'import'">
                                <template #icon>
                                    <svg-icon type="mdi" :path="mdiImport"/>
                                </template>
                            </n-button>
                        </template>
                        {{ global.lang.getText("import") }}
                    </n-popover>
                    <n-popover placement="bottom">
                        <template #trigger>
                            <n-button quaternary circle size="large" @click="global.page = 'export'">
                                <template #icon>
                                    <svg-icon type="mdi" :path="mdiExport"/>
                                </template>
                            </n-button>
                        </template>
                        {{ global.lang.getText("export") }}
                    </n-popover>
                </n-flex>
                <n-flex align="center" size="small">
                    <n-select v-if="global.contentsType !== 'statistic'" v-model:value="groupSortValue" :options="groupSortOptions" :render-label="groupSortOptionRender" :placeholder="global.lang.getText('groupSortBy')" style="width: 192px">
                        <template #empty>
                            <n-empty :description="global.lang.getText('noData')"/>
                        </template>
                    </n-select>
                    <n-select v-if="global.contentsType === 'grid'" :placeholder="global.lang.getText('sortBy')" style="width: 192px">
                        <template #empty>
                            <n-empty :description="global.lang.getText('noData')"/>
                        </template>
                    </n-select>
                    <button-group v-if="global.contentsType === 'grid'" v-model="global.gridSize" :items="[
                        { icon: mdiSquare, tooltip: 'gridLarge', value: 'large' },
                        { icon: mdiViewGrid, tooltip: 'gridDefault', value: 'default' },
                        { icon: mdiApps, tooltip: 'gridSmall', value: 'small' }
                    ]"/>
                    <button-group v-model="global.contentsType" :items="[
                        { icon: mdiViewGrid, tooltip: 'gridView', value: 'grid' },
                        { icon: mdiViewList, tooltip: 'tableView', value: 'table' },
                        { icon: mdiChartLine, tooltip: 'statisticView', value: 'statistic' }
                    ]"/>
                </n-flex>
            </n-flex>
        </n-card>
        <n-flex :justify="global.isChildTable ? 'space-between' : 'center'" align="center" style="min-height: 40px">
            <n-flex v-if="global.isChildTable" align="center">
                <n-button quaternary size="large" circle @click="back">
                    <template #icon>
                        <svg-icon type="mdi" :path="mdiChevronLeft"/>
                    </template>
                </n-button>
                <h3 style="margin: 0">{{ global.lang.getText("back") }}</h3>
            </n-flex>
            <n-flex align="center">
                <n-input v-model:value="filterText" :placeholder="global.lang.getText('search')" clearable style="width: 512px">
                    <template #prefix>
                        <svg-icon type="mdi" :path="mdiMagnify"/>
                    </template>
                </n-input>
                {{ `${global.lang.getText("total")} ${itemCount} ${global.lang.getText("items")}` }}
            </n-flex>
            <n-popover v-if="global.isChildTable" placement="bottom">
                <template #trigger>
                    <n-button quaternary circle size="large" @click="editItem">
                        <template #icon>
                            <svg-icon type="mdi" :path="mdiEye"/>
                        </template>
                    </n-button>
                </template>
                {{ global.lang.getText("viewPrimaryItem") }}
            </n-popover>
        </n-flex>
    </n-flex>
</template>

<script setup lang="ts">
import type { SelectOption } from 'naive-ui'
import { NFlex, NCard, NPopover, NButton, NSelect, NEmpty, NInput } from "naive-ui"
import SvgIcon from "@jamescoyle/vue-icon"
import { mdiPlus, mdiImport, mdiExport, mdiViewGrid, mdiViewList, mdiChartLine, mdiApps, mdiSquare, mdiChevronLeft, mdiMagnify, mdiEye, mdiChevronUp, mdiChevronDown } from "@mdi/js"
import { computed, h, ref, watch } from "vue"
import global from "../plugins/global"
import ButtonGroup from "./ButtonGroup.vue"
import searchAndSort from "../plugins/searchAndSort"

function back() {
    global.isChildTable = false
    global.selectedRow.primary = null
    global.selectedRow.child = null
}
function editItem() {
    global.isChildTable = false
    global.selectedRow.child = null
    global.page = "row"
}

const groupSortValue = ref("none")
const groupSortOptions = computed(() => {
    const options = [{ label: global.lang.getText("noGroup"), value: "none" }]
    for(const column of global.isChildTable ? global.databaseData!.table2Info : global.databaseData!.table1Info) {
        if(column.ifDisplay && (column.displayLang === "none" || column.displayLang === global.lang.currentLang) && column.groupType !== "none") {
            options.push({ label: column.title[global.lang.currentLang], value: `${column.id}-asc` })
            options.push({ label: column.title[global.lang.currentLang], value: `${column.id}-desc` })
        }
    }
    return options
})
function groupSortOptionRender(option: SelectOption) {
    if(option.value === "none" || typeof option.value !== "string") {
        return option.label as string
    }
    const optionParts = option.value.split("-")
    return h(NFlex, { align: "center" }, () => [
        h(NFlex, { align: "center" }, () => [optionParts[1] === "asc" ? h(SvgIcon, { type: "mdi", path: mdiChevronUp }) : h(SvgIcon, { type: "mdi", path: mdiChevronDown })]),
        option.label as string
    ])
}
watch(groupSortValue, (newGroupSort) => {
    const currentGroupSort = global.isChildTable ? global.databaseData!.groupSort2 : global.databaseData!.groupSort1
    if(newGroupSort === "none") {
        currentGroupSort.column = null
        currentGroupSort.order = "-"
    } else {
        const newGroupSortParts = newGroupSort.split("-")
        currentGroupSort.column = Number(newGroupSortParts[0])
        currentGroupSort.order = newGroupSortParts[1] as "asc" | "desc" | "-"
    }
    searchAndSort.groupFunc()
})
watch(() => global.isChildTable, () => {
    const currentGroupSort = global.isChildTable ? global.databaseData!.groupSort2 : global.databaseData!.groupSort1
    if(currentGroupSort.column === null || currentGroupSort.order === "-") {
        groupSortValue.value = "none"
    } else {
        groupSortValue.value = `${currentGroupSort.column}-${currentGroupSort.order}`
    }
}, { immediate: true })

const filterText = ref(global.filterText)
let timer: ReturnType<typeof setTimeout> | null = null
watch(filterText, (newFilterText) => {
    if(timer !== null) {
        clearTimeout(timer)
    }
    timer = setTimeout(() => {
        global.filterText = newFilterText
    }, 150)
})
const itemCount = computed(() => {
    if(global.filterText === null || global.filterText === undefined || global.filterText === "") {
        return global.databaseData!.dualTable && global.isChildTable ?
            JSON.parse(global.databaseData!.tableData[global.selectedRow.primary as number][global.databaseData!.gridView ? 2 : 1] as string).length
            : global.databaseData!.tableData.length
    }
    return global.isChildTable ? searchAndSort.childFiltered.length : searchAndSort.primaryFiltered.length
})
</script>