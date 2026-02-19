<template>
    <!-- 加载动画 -->
    <div v-if="global.currentData.value.loading">
        <v-skeleton-loader type="table-thead" />
        <v-skeleton-loader type="table-tbody" />
    </div>
    <!-- 数据表格 -->
    <v-table v-else fixed-header hover class="fill-height">
        <!-- 表头 -->
        <thead>
            <!-- 无数据显示 -->
            <label v-if="tableHeaders.length === 0" class="d-flex justify-center ma-8">
                {{ global.lang.getText("noData") }}
            </label>
            <tr>
                <!-- 分组列 -->
                <th v-if="groupSort.column !== null" :width="groupColWidth" class="border-e pa-0 fill-height" />
                <th v-for="header in tableHeaders" :key="header.key" :width="header.width"
                    class="border-e pa-0 height">
                    <!-- 鼠标焦点 -->
                    <v-hover>
                        <template #default="{ isHovering, props }">
                            <!-- 按钮单击排序 -->
                            <v-btn v-bind="props" block variant="text" rounded="0" size="x-large"
                                   class="pl-2 pr-2" @click="onHeaderClick(header.key)">
                                <label class="text-body-2">{{ header.text }}</label>
                                <v-icon v-if="isHovering && (sortData.column !== header.key || sortData.order === '-')"
                                        icon="mdi-menu-swap" size="small" class="position-absolute right-0" />
                                <v-icon v-if="sortData.column === header.key && sortData.order !== '-'"
                                        :icon="sortData.order === 'asc' ? 'mdi-menu-up' : 'mdi-menu-down'"
                                        size="small" class="position-absolute right-0" />
                            </v-btn>
                        </template>
                    </v-hover>
                </th>
            </tr>
        </thead>
        <!-- 表体 -->
        <tbody>
            <!-- 行单击选择 -->
            <tr v-for="groupTag in groupTagList" :key="groupTag.rowId"
                @click="onRowClick(groupTag.rowId)">
                <!-- 分组列 -->
                <td v-if="groupSort.column !== null && groupTag.groupSpan !== null"
                    :rowspan="groupTag.groupSpan" class="border-e pa-0">
                    <div class="d-flex justify-center text-center">
                        <label v-if="groupColDisplayType === 'text'" class="d-flex justify-center text-center">
                            {{ groupTag.groupTitle }}
                        </label>
                        <v-icon v-else-if="groupColDisplayType === 'bool'"
                                :icon="global.currentTable.value[groupTag.rowId][groupSort.column as number] ?
                                    'mdi-check-circle' : 'mdi-close-circle'"
                                :color="global.currentTable.value[groupTag.rowId][groupSort.column as number] ?
                                    'light-green' : 'deep-orange'" />
                        <v-chip v-else :color="global.currentTable.value[groupTag.rowId][groupSort.column as number] ?
                            'light-green' : 'deep-orange'">
                            {{ groupTag.groupTitle }}
                        </v-chip>
                    </div>
                </td>
                <td v-for="header in tableHeaders" :key="header.key" class="border-e pa-0">
                    <!-- 被选中颜色控制 -->
                    <v-card rounded="0" elevation="0"
                            :color="header.key === selectedRow ? '#9E9E9E20' : 'transparent'"
                            :class="'d-flex justify-' + header.align + 'align-center fill-height pa-2'">
                        <label v-if="global.currentTableInfo.value[header.key].displayType === 'text'"
                               style="word-break: break-word;" class="d-flex justify-center text-center">
                            {{ global.currentTable.value[groupTag.rowId][header.key] }}
                        </label>
                        <v-icon v-else-if="global.currentTableInfo.value[header.key].displayType === 'bool'"
                                :icon="global.currentTable.value[groupTag.rowId][header.key] ?
                                    'mdi-check-circle' : 'mdi-close-circle'"
                                :color="global.currentTable.value[groupTag.rowId][header.key] ?
                                    'light-green' : 'deep-orange'" />
                        <v-chip v-else :color="global.currentTable.value[groupTag.rowId][header.key] ?
                            'light-green' : 'deep-orange'">
                            {{ global.currentTable.value[groupTag.rowId][header.key] }}
                        </v-chip>
                    </v-card>
                </td>
            </tr>
        </tbody>
    </v-table>
</template>

<script setup lang="ts">
import type { Ref } from "vue"
import { ref, computed } from "vue"
import global from "@/plugins/global"
import searchAndSort from "@/plugins/searchAndSort"

// 表头数据
const tableHeaders = computed(() => {
    const headerOrder: number[] = []
    const displayColumns = !global.isChildTable.value ?
        global.currentData.value.displayColumns1 : global.currentData.value.displayColumns2
    for(const index in global.currentTableInfo.value) { // 按显示索引排序
        const col = global.currentTableInfo.value[index]
        if(col.displayIndex >= 0 && displayColumns.includes(col.id)) { // 仅当列被设置为显示时加入
            let insertedFlag = false
            for(let i=headerOrder.length-1; i>=0; i--) { // 从后往前查找插入位置
                if(col.displayIndex > headerOrder[i]) { // 如果当前列的显示索引大于已插入列的显示索引
                    headerOrder.splice(i+1, 0, Number(index)) // 插入到已插入列的后面
                    insertedFlag = true
                    break
                }
            }
            if(!insertedFlag) { // 如果没有找到插入位置，说明当前列的显示索引最小
                headerOrder.unshift(Number(index))
            }
        }
    }
    const headers = []
    for(const index of headerOrder) { // 构建表头数据
        const col = global.currentTableInfo.value[index]
        headers.push({
            key: col.id,
            text: col.text[global.lang.currentLang],
            align: col.textAlign,
            width: global.lang.getTextLength(col.text)
        })
    }
    return headers
})

// 表头单击排序
const sortData = !global.isChildTable.value ?
    global.currentData.value.sort1 : global.currentData.value.sort2
function onHeaderClick(headerKey: number) {
    sortData.column = headerKey
    switch(sortData.order) {
    case "-":
        sortData.order = "asc"
        break
    case "asc":
        sortData.order = "desc"
        break
    case "desc":
        sortData.order = "-"
        break
    }
    if(!global.isChildTable.value) {
        global.currentData.value.sort1 = sortData
    } else {
        global.currentData.value.sort2 = sortData
    }
}

// 分组列
const groupSort = computed(() => !global.isChildTable.value ?
    global.currentData.value.groupSort1 : global.currentData.value.groupSort2)
const groupColWidth = computed(() => {
    const groupType = global.currentTableInfo.value[groupSort.value.column as number].groupType
    if(groupType === null) {
        throw new Error("Group type is null.")
    }
    if(groupType === "alphabet") {
        return 38
    } else {
        let maxLength = 0
        for(const tag of groupType) {
            if(tag.length > maxLength) {
                maxLength = tag.length
            }
        }
        return global.lang.currentLang === "en" ?
            maxLength * 8 + 30 : maxLength * 16 + 30
    }
})
const groupTagList = computed(() => !global.isChildTable.value ?
    searchAndSort.groupedItems1 : searchAndSort.groupedItems2)
const groupColDisplayType = computed(() =>
    global.currentTableInfo.value[groupSort.value.column as number].displayType)

// 选中行更新
const selectedRow: Ref<number | null, number | null> = ref(null)
function onRowClick(rowId: number) {
    selectedRow.value = rowId
    if(!global.isChildTable.value) {
        global.currentData.value.selctedRow1 = rowId
    } else {
        global.currentData.value.selctedRow2 = rowId
    }
}
</script>