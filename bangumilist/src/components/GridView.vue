<template>
    <n-card embedded style="height: calc(100% - 114px)" content-style="padding: 12px; height: calc(100% - 114px)">
        <n-flex vertical style="height: 100%">
            <n-scrollbar trigger="none" style="height: 100%">
                <n-empty v-if="tableData.length === 0" :description="global.lang.getText('noData')" style="padding: 48px"/>
                <n-flex v-else-if="!isGrouped" align="start">
                    <single-cover v-for="row in tableData" :key="row[0]" :display-row="row"/>
                </n-flex>
                <n-collapse v-else v-model:expanded-names="expandedGroups">
                        <n-collapse-item v-for="group in groupedData" :key="String(group.title)" :name="String(group.title)" :title="getGroupTitle(group.title)">
                            <n-flex align="start">
                                <single-cover v-for="row in group.data" :key="row[0]" :display-row="row"/>
                            </n-flex>
                        </n-collapse-item>
                </n-collapse>
            </n-scrollbar>
            <n-flex justify="end">
                <n-pagination v-model:page="page" v-model:page-size="pageSize" :item-count="itemCount" :page-slot="11" size="large" :showSizePicker="true" :page-sizes="pageSizes"/>
            </n-flex>
        </n-flex>
    </n-card>
</template>

<script setup lang="ts">
import { NCard, NFlex, NScrollbar, NCollapse, NCollapseItem, NPagination, NEmpty } from "naive-ui"
import { computed, ref } from "vue"
import global from "../plugins/global"
import searchAndSort from "../plugins/searchAndSort"
import SingleCover from "./SingleCover.vue"

const page = ref(1)
const pageSize = ref(25)
const itemCount = computed(() => global.isChildTable ? searchAndSort.childGrouped.length : searchAndSort.primaryGrouped.length)
const pageSizes = computed(() => [10, 25, 50, 100].map(pageSize => ({ label: `${pageSize} ${global.lang.getText("pageSize")}`, value: pageSize })))

const tableData = computed(() => {
    const allData = global.isChildTable ? searchAndSort.childGrouped : searchAndSort.primaryGrouped
    const pageValue = (page.value - 1) * pageSize.value >= allData.length ? 0 : (page.value - 1) * pageSize.value
    return allData.slice(pageValue, pageValue + pageSize.value)
})

const isGrouped = computed(() => {
    const sort = global.isChildTable ? global.databaseData!.groupSort2 : global.databaseData!.groupSort1
    return sort.column !== null && sort.order !== "-"
})
const expandedGroups = ref([])
const groupedData = computed(() => {
    if(isGrouped.value) {
        const data = []
        for(const row of tableData.value) {
            let isAdded = false
            for(let i = data.length - 1; i >= 0; i--) {
                if(data[i].title === row.groupTitle) {
                    data[i].data.push(row)
                    isAdded = true
                    break
                }
            }
            if(!isAdded) {
                data.push({
                    title: row.groupTitle,
                    data: [row]
                })
            }
        }
        expandedGroups.value = data.map(group => group.title) as never[]
        return data
    }
    return undefined
})

function getGroupTitle(groupKey: boolean | number | string) {
    const valuePreset = (global.isChildTable ? global.databaseData!.table2Info : global.databaseData!.table1Info)
        [(global.isChildTable ? global.databaseData!.groupSort2 : global.databaseData!.groupSort1).column as number].valuePreset
    const stringKey = String(groupKey)
    if(valuePreset !== "none" && valuePreset.hasOwnProperty(stringKey) && valuePreset[stringKey].hasOwnProperty("title")) {
        return valuePreset[stringKey].title![global.lang.currentLang]
    }
    return stringKey
}
</script>