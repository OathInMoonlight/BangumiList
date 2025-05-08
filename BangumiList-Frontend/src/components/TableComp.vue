<template>
    <!-- 加载动画 -->
    <div v-if="global.tableData.loading">
        <v-skeleton-loader type="table-thead" />
        <v-skeleton-loader type="table-tbody" />
    </div>
    <!-- 表 -->
    <div id="fillHeightDiv" v-if="!global.tableData.loading">
        <v-table fixed-header hover class="fill-height">
            <!-- 表头 -->
            <thead>
                <!-- 无数据显示 -->
                <label v-if="tableHeaders.length == 0" class="d-flex justify-center align-center ma-8">{{
                    global.lang.text.noData[global.lang.currentLang] }}</label>
                <tr>
                    <th v-for="header in tableHeaders" :width="header.width" class="border-e pa-0 fill-height">
                        <!-- 鼠标焦点 -->
                        <v-hover v-if="header.key != 'group'">
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
                <tr v-for="row in groupedData"
                    @click="selectRow(row[global.tableData.values[global.tableData.keys[0]]])">
                    <td v-for="header in tableHeaders" :rowspan="global.viewOpt.groupSortBy == 'none'?1:row['GROUPSPAN']" class="border-e pa-0">
                        <label v-if="header.key == 'group'" class="d-flex justify-center text-center">{{ row["GROUP"] }}</label>
                        <!-- 被选中颜色控制 -->
                        <v-card v-if="header.key != 'group'" rounded="0" elevation="0"
                            :color="rowColor[row[global.tableData.values[global.tableData.keys[0]]]]"
                            :class="'d-flex justify-' + header.align + ' align-center fill-height'">
                            <label v-if="global.tableData.dataDisplay[header.key] == 'text'" id="tableItemText">
                                {{ row[header.value] }}
                            </label>
                            <v-icon v-else-if="global.tableData.dataDisplay[header.key] == 'icon'"
                                :icon="row[header.value] == 1 ? 'mdi-check-circle' : (row[header.value] == 0 ? 'mdi-close-circle' : null)"
                                :color="row[header.value] == 1 ? 'light-green' : (row[header.value] == 0 ? 'deep-orange' : null)" />
                            <v-chip v-else
                                :prepend-icon="row[header.value] == 1 ? 'mdi-check' : (row[header.value] == 0 ? 'mdi-close' : null)"
                                :color="row[header.value] == 1 ? 'light-green' : (row[header.value] == 0 ? 'deep-orange' : null)">
                                {{ row[header.value] }}
                            </v-chip>
                        </v-card>
                    </td>
                </tr>
            </tbody>
        </v-table>
    </div>
</template>

<style>
#fillHeightDiv {
    height: calc(100vh - 176px);
    /* 使页面铺满 */
}

#tableItemText {
    word-break: break-word;
    /* 使长文本换行 */
}
</style>

<script setup>
import { ref, reactive, computed, watch } from "vue"
import global from "@/plugins/global.js"
import langTool from "@/plugins/langTool.js"
import { el } from "vuetify/locale"

const tableHeaders = computed(() => { // 计算表头
    var headers = []
    if (global.viewOpt.groupSortBy != "none") {
        headers.push({ key: "group", value: "GROUP", text: "", align: "center", width: 38 })
    }
    global.tableData.keys.forEach(hkey => {
        if (global.tableData.shownColumns[hkey] == true) { // 如果该列为显示列
            headers.push({
                key: hkey, value: global.tableData.values[hkey], text: global.tableData.text[hkey][global.lang.currentLang],
                align: global.tableData.align[hkey], width: global.tableData.computeWidth(hkey, global.lang.currentLang)
            })
        }
    })
    return headers
})

// 获取数据
global.tableData.updateReq() // 发送请求获取数据
var filteredData = ref(global.tableData.data)
watch(() => global.tableData.data, (newData) => { // 监听数据变化
    filteredData.value = newData
    filterData(global.tableData.filterText)
    sortData()
    // groupData()
}, { immediate: true }) // 立即执行一次

// 过滤文本
var timer = null
watch(() => global.tableData.filterText, (newfilterText) => { // 监听过滤文本变化
    if (timer != null) {
        clearTimeout(timer) // 清除定时器
    }
    timer = setTimeout(() => { // 防抖措施：避免频繁触发
        filterData(newfilterText)
        sortData()
        groupData()
    }, 500)
})
function filterData(filterText) {
    if (filterText == null || filterText == "") {
        filteredData.value = global.tableData.data
    }
    else {
        const newFilteredData = []
        const lowFilterText = global.tableData.filterText.toLowerCase() // 转换为小写
        for (var id in global.tableData.data) {
            var ifContain = false
            for (var key in global.tableData.data[id]) { // 遍历每一单元格数据
                if (global.tableData.data[id][key] == null) {
                    continue // 如果单元格数据为空，则跳过
                }
                if (global.tableData.data[id][key].toString().toLowerCase().includes(lowFilterText)) {
                    ifContain = true
                    break
                }
            }
            if (ifContain) { // 如果包含过滤文本
                newFilteredData.push(global.tableData.data[id])
            }
        }
        filteredData.value = newFilteredData
    }
}

// 排序
var sortOfHeaders = reactive({})
global.tableData.keys.forEach(hkey => {
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
    groupData()
}
function sortData() {
    var allNone = true
    for (var key in sortOfHeaders) { // 遍历每一表头
        if (sortOfHeaders[key] == "none") {
            continue
        }
        else if (sortOfHeaders[key] == "asc") {
            filteredData.value.sort((a, b) => { // 升序排序
                let sortValue = global.tableData.values[global.tableData.sortMap[key]] // 转换为大写值
                if (a[sortValue] > b[sortValue]) return 1
                if (a[sortValue] < b[sortValue]) return -1
                return 0
            })
            allNone = false
            break
        }
        else {
            filteredData.value.sort((a, b) => {
                let sortValue = global.tableData.values[global.tableData.sortMap[key]]
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
            let sortValue = global.tableData.values[global.tableData.sortMap[global.tableData.keys[0]]]
            if (a[sortValue] > b[sortValue]) return 1
            if (a[sortValue] < b[sortValue]) return -1
            return 0
        })
    }
}

// 分组
const groupedData = ref([])
watch(() => global.viewOpt.groupSortBy, (newGroupSortBy) => {
    groupData()
})
function groupData() {
    if (global.viewOpt.groupSortBy == "none") {
        groupedData.value = filteredData.value
    }
    else {
        groupedData.value = []
        const key = global.viewOpt.groupSortBy.split('-')[0]
        if (global.tableData.group[key] == "alphabet") {
            const alphabet = "abcdefghijklmnopqrstuvwxyz"
            const alphabetCount = {}
            for (var i of alphabet) {
                alphabetCount[i] = []
            }
            var getFirstLetter = null
            if (global.tableData.sortMap[key] == key) {
                getFirstLetter = (row) => {
                    return langTool.getFirstLetter(row[global.tableData.values[key]])
                }
            }
            else {
                getFirstLetter = (row) => {
                    return row[global.tableData.values[global.tableData.sortMap[key]]][0]
                }
            }
            for (var index in filteredData.value) {
                let firstLetter = getFirstLetter(filteredData.value[index]).toLowerCase()
                alphabetCount[firstLetter].push(index)
                filteredData.value[index].GROUP = firstLetter
            }
            for (var i of alphabet) {
                if (alphabetCount[i].length > 0) {
                    filteredData.value[alphabetCount[i][0]].GROUPSPAN = alphabetCount[i].length
                    for (var index of alphabetCount[i]) {
                        groupedData.value.push(filteredData.value[index])
                    }
                }
            }
        }
    }
}

// 选中行
var rowColor = reactive({})
function selectRow(id) {
    if (global.tableData.selectedRow != null) { // 如果有选中行，则取消选中
        rowColor[global.tableData.selectedRow] = "transparent"
    }
    global.tableData.selectedRow = id // 设置选中行
    rowColor[id] = "#9E9E9E20"
}
</script>