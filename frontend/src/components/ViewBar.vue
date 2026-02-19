<template>
    <v-card rounded="0" class="d-flex justify-space-between align-center pa-2">
        <!-- 搜索框 -->
        <v-responsive inline class="w-25">
            <v-text-field v-model="global.view.filterText" variant="solo-filled"
                          density="compact" :label="global.lang.getText('search')"
                          clearable single-line hide-details>
                <template #prepend-inner>
                    <v-icon icon="mdi-magnify" />
                </template>
            </v-text-field>
        </v-responsive>


        <div class="d-flex flex-row-reverse justify-space-between align-center ga-2">
            <!-- 视图切换 -->
            <v-btn-toggle v-if="global.currentData.value.gridView" v-model="global.view.contentsType"
                          density="compact" :color="global.view.primaryColor" mandatory>
                <v-tooltip :text="global.lang.getText('gridView')" location="bottom center">
                    <template #activator="{ props }">
                        <v-btn v-bind="props" value="grid" icon="mdi-view-grid" size="large" />
                    </template>
                </v-tooltip>
                <v-tooltip :text="global.lang.getText('tableView')" location="bottom center">
                    <template #activator="{ props }">
                        <v-btn v-bind="props" value="table" icon="mdi-view-list" size="large" />
                    </template>
                </v-tooltip>
            </v-btn-toggle>
            <!-- 表格显示项 -->
            <v-select v-if="global.view.contentsType === 'table'"
                      v-model="displayColumns"
                      variant="solo-filled" density="compact" :width="256"
                      :placeholder="global.lang.getText('tableDisplayItems')"
                      :no-data-text="global.lang.getText('noData')" hide-details multiple
                      :items="displayColSelections">
                <template #selection="{ index }">
                    <label v-if="index < 1">{{ global.lang.getText("tableDisplayItems") }}</label>
                </template>
            </v-select>
            <!-- 网格大小 -->
            <v-btn-toggle v-if="global.view.contentsType === 'grid'"
                          v-model="global.view.gridSize" density="compact" 
                          :color="global.view.primaryColor" mandatory divided>
                <v-tooltip :text="global.lang.getText('gridLarge')" location="bottom center">
                    <template #activator="{ props }">
                        <v-btn v-bind="props" value="large" icon="mdi-square" size="large" />
                    </template>
                </v-tooltip>
                <v-tooltip :text="global.lang.getText('gridDefault')" location="bottom center">
                    <template #activator="{ props }">
                        <v-btn v-bind="props" value="default" icon="mdi-view-grid" size="large" />
                    </template>
                </v-tooltip>
                <v-tooltip :text="global.lang.getText('gridSmall')" location="bottom center">
                    <template #activator="{ props }">
                        <v-btn v-bind="props" value="small" icon="mdi-apps" size="large" />
                    </template>
                </v-tooltip>
            </v-btn-toggle>
            <!-- 排序 -->
            <v-select v-if="global.view.contentsType === 'grid'" variant="solo-filled"
                      :label="global.lang.getText('sortBy')" density="compact"
                      :width="256" :no-data-text="global.lang.getText('noData')"
                      hide-details />
            <!-- 分组 -->
            <v-select v-model="groupSortBy" variant="solo-filled"
                      :label="global.lang.getText('groupSortBy')" density="compact"
                      :no-data-text="global.lang.getText('noData')" hide-details
                      :width="256" :items="groupList">
                <template #selection="{ item }">
                    <v-icon v-if="item.value[1] === 'asc'" icon="mdi-arrow-up" size="small" />
                    <v-icon v-else-if="item.value[1] === 'desc'" icon="mdi-arrow-down" size="small" />
                    <label class="text-no-wrap">{{ item.title }}</label>
                </template>
                <template #item="{ item, props }">
                    <v-list-item v-bind="props" title="">
                        <v-icon v-if="item.value[1] === 'asc'" icon="mdi-arrow-up" size="small" />
                        <v-icon v-else-if="item.value[1] === 'desc'" icon="mdi-arrow-down" size="small" />
                        <label class="text-no-wrap">{{ item.title }}</label>
                    </v-list-item>
                </template>
            </v-select>
        </div>
    </v-card>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue"
import global from "@/plugins/global"
import type { Order } from "@/plugins/transportTypes"
// 显示列
const displayColumns = ref(global.currentData.value.displayColumns1)
watch(displayColumns, (newDisplayColumns) => { // 更新显示列变化到全局数据
    if(!global.isChildTable) {
        global.currentData.value.displayColumns1 = newDisplayColumns
    } else {
        global.currentData.value.displayColumns2 = newDisplayColumns
    }
})
const displayColSelections = computed(() => { // 获取所有可选显示列
    const allCols = []
    for(const col of global.currentTableInfo.value) {
        allCols.push({
            title: col.text[global.lang.currentLang],
            value: col.id
        })
    }
    return allCols
})
// 分组
const groupList = computed(() => { // 获取所有可分组列
    const list = []
    list.push({ title: global.lang.getText("noGroup"), value: "null.-" })
    for(const col of global.currentTableInfo.value) {
        const colText = col.text[global.lang.currentLang]
        if(col.groupType !== null) {
            list.push({ title: colText, value: `${col.id}.asc` })
            list.push({ title: colText, value: `${col.id}.desc` })
        }
    }
    return list
})
const groupSortBy = ref("null.-") // 分组选项值
watch(groupSortBy, (newGroupSortBy) => { // 监听分组选项变化
    const newGroupSortByArr = newGroupSortBy.split(".")
    if(newGroupSortByArr[0] === "null") {
        if(!global.isChildTable) {
            global.currentData.value.groupSort1.column = null
        } else {
            global.currentData.value.groupSort2.column = null
        }
    } else{
        if(!global.isChildTable) {
            global.currentData.value.groupSort1.column = Number(newGroupSortBy[0])
            global.currentData.value.groupSort1.order = newGroupSortBy[1] as Order
        } else {
            global.currentData.value.groupSort2.column = Number(newGroupSortBy[0])
            global.currentData.value.groupSort2.order = newGroupSortBy[1] as Order
        }
    }
})
</script>