<template>
    <!-- 加载动画 -->
    <div v-if="tableData.loading">
        <v-skeleton-loader type="table-thead" />
        <v-skeleton-loader type="table-tbody" />
    </div>
    <!-- 表 -->
    <div id="fillHeightDiv" v-if="!tableData.loading">
        <v-table fixed-header hover class="fill-height">
            <!-- 表头 -->
            <thead>
                <!-- 无数据显示 -->
                <label v-if="tableHeaders.length == 0" class="d-flex justify-center align-center ma-8">{{
                    $lang.text.noData[$lang.currentLang] }}</label>
                <tr>
                    <th v-for="header in tableHeaders" :width="header.width" class="border-e pa-0 fill-height">
                        <!-- 鼠标焦点 -->
                        <v-hover>
                            <template v-slot:default="{ isHovering, props }">
                                <!-- 按钮单击排序 -->
                                <v-btn v-bind="props" block variant="text" rounded="0" size="x-large"
                                    @click="clickHeader(header.key)" class="pl-2 pr-2">
                                    <label class="text-body-2">{{ header.text }}</label>
                                    <v-icon v-if="isHovering && (sortOfHeaders[header.key] == 'none')"
                                        icon="mdi-menu-swap" size="small" class="position-absolute right-0" />
                                    <v-icon v-if="sortOfHeaders[header.key] != 'none'"
                                        :icon="(sortOfHeaders[header.key] == 'asc') ? 'mdi-menu-up' : 'mdi-menu-down'"
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
                <tr v-for="row in filteredData" @click="selectRow(row[tableHeaders[0].value])">
                    <td v-for="header in tableHeaders" class="border-e pa-0">
                        <!-- 被选中颜色控制 -->
                        <v-card rounded="0" elevation="0" :color="rowColor[row[tableHeaders[0].value]]"
                            :class="'d-flex justify-' + header.align + ' align-center fill-height'">
                            <label id="tableItemText">{{ row[header.value] }}</label>
                        </v-card>
                    </td>
                </tr>
            </tbody>
        </v-table>
    </div>
</template>

<style>
#fillHeightDiv {
    height: calc(100vh - 176px); /* 使页面铺满 */
}

#tableItemText {
    word-break: break-word; /* 使长文本换行 */
}
</style>

<script setup>
import { ref, reactive, computed, watch } from "vue"
import { useLang, useTableData } from "@/plugins/useGlobal.js"

const lang = useLang()
const tableData = useTableData()
const tableHeaders = computed(() => { // 计算表头
    var headers = []
    tableData.keys.forEach(hkey => {
        headers.push({
            key: hkey, value: tableData.values[hkey], text: tableData.text[hkey][lang.currentLang],
            align: tableData.align[hkey], width: tableData.computeWidth(hkey, lang.currentLang)
        })
    })
    return headers
})

// 获取数据
tableData.updateReq() // 发送请求获取数据
var filteredData = ref(tableData.data) 
watch(() => tableData.data, (newData) => { // 监听数据变化
    filteredData = ref(newData)
    filterData(tableData.filterText)
    sortData()
})

// 过滤文本
watch(() => tableData.filterText, (newfilterText) => { // 监听过滤文本变化
    filterData(newfilterText)
})
function filterData(filterText) {
    if (filterText == null || filterText == "") {
        filteredData.value = tableData.data
    }
    else {
        const newFilteredData = []
        const lowFilterText = tableData.filterText.toLowerCase() // 转换为小写
        for (var id in tableData.data) {
            var ifContain = false
            for (var key in tableData.data[id]) { // 遍历每一单元格数据
                if (tableData.data[id][key].toString().toLowerCase().includes(lowFilterText)) {
                    ifContain = true
                    break
                }
            }
            if (ifContain) { // 如果包含过滤文本
                newFilteredData.push(tableData.data[id])
            }
        }
        filteredData.value = newFilteredData
    }
    sortData()
}

// 排序
var sortOfHeaders = reactive({})
tableData.keys.forEach(hkey => {
    sortOfHeaders[hkey] = "none"
})
function clickHeader(hkey) {
    for (var key in sortOfHeaders) { // 遍历每一表头，除了当前表头外，其他表头都设置为none
        if (key != hkey) {
            sortOfHeaders[key] = "none"
        }
    }
    if (sortOfHeaders[hkey] == "none") {
        sortOfHeaders[hkey] = "asc"
    }
    else if (sortOfHeaders[hkey] == "asc") {
        sortOfHeaders[hkey] = "desc"
    }
    else {
        sortOfHeaders[hkey] = "none"
    }
    sortData()
}
function sortData() {
    var allNone = true
    for (var key in sortOfHeaders) { // 遍历每一表头
        if (sortOfHeaders[key] == "none") {
            continue
        }
        else if (sortOfHeaders[key] == "asc") {
            filteredData.value.sort((a, b) => { // 升序排序
                let sortValue = tableData.values[tableData.sortMap[key]] // 转换为大写值
                if (a[sortValue] > b[sortValue]) return 1
                if (a[sortValue] < b[sortValue]) return -1
                return 0
            })
            allNone = false
            break
        }
        else {
            filteredData.value.sort((a, b) => {
                let sortValue = tableData.values[tableData.sortMap[key]]
                if (a[sortValue] < b[sortValue]) return 1
                if (a[sortValue] > b[sortValue]) return -1
                return 0
            })
            allNone = false
            break
        }
    }
    if (allNone) { // 如果所有表头都是none，则默认按第一个表头排序
        filteredData.value.sort((a, b) => {
            let sortValue = tableData.values[tableData.sortMap[tableHeaders.value[0].key]]
            if (a[sortValue] > b[sortValue]) return 1
            if (a[sortValue] < b[sortValue]) return -1
            return 0
        })
    }
}

// 选中行
var rowColor = reactive({})
function selectRow(id) {
    if (tableData.selectedRow != null) { // 如果有选中行，则取消选中
        rowColor[tableData.selectedRow] = "transparent"
    }
    tableData.selectedRow = id // 设置选中行
    rowColor[id] = "#9E9E9E20"
}
</script>