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
                    <!-- 分组列 -->
                    <th v-if="global.viewOpt.groupSortBy != 'none'" width=38 class="border-e pa-0 fill-height" />
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
                <tr v-for="row in groupedData"
                    @click="selectRow(row[global.tableData.values[global.tableData.keys[0]]])">
                    <!-- 分组列 -->
                    <td v-if="global.viewOpt.groupSortBy != 'none' && row.GROUPSPAN != null"
                        :rowspan="global.viewOpt.groupSortBy == 'none' ? null : row['GROUPSPAN']" class="border-e pa-0">
                        <div class="d-flex justify-center">
                            <label v-if="global.tableData.dataDisplay[groupKey] == 'text'"
                                class="d-flex justify-center text-center">{{
                                    row["GROUP"] }}</label>
                            <v-icon v-else-if="global.tableData.dataDisplay[groupKey] == 'icon'"
                                :icon="row[global.tableData.values[groupKey]] == 1 ? 'mdi-check-circle' : (row[global.tableData.values[groupKey]] == 0 ? 'mdi-close-circle' : null)"
                                :color="row[global.tableData.values[groupKey]] == 1 ? 'light-green' : (row[global.tableData.values[groupKey]] == 0 ? 'deep-orange' : null)" />
                            <v-chip v-else
                                :prepend-icon="row[global.tableData.values[groupKey]] == 1 ? 'mdi-check' : (row[global.tableData.values[groupKey]] == 0 ? 'mdi-close' : null)"
                                :color="row[global.tableData.values[groupKey]] == 1 ? 'light-green' : (row[global.tableData.values[groupKey]] == 0 ? 'deep-orange' : null)">
                                {{ row[global.tableData.values[groupKey]] }}
                            </v-chip>
                        </div>
                    </td>
                    <td v-for="header in tableHeaders" class="border-e pa-0">
                        <!-- 被选中颜色控制 -->
                        <v-card rounded="0" elevation="0"
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

const tableHeaders = computed(() => { // 计算表头
    var headers = []
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
const filteredData = ref(global.tableData.data)
var groupKey = null
const groupedData = ref([])
watch(() => global.tableData.data, (newData) => { // 监听数据变化
    filteredData.value = newData
    filterData(global.tableData.filterText)
    sortData()
    groupData()
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
    }, 100)
})
function filterData(filterText) {
    if (filterText == null || filterText == "") {
        filteredData.value = global.tableData.data
    }
    else {
        const newFilteredData = []
        const lowFilterText = global.tableData.filterText.toLowerCase() // 转换为小写
        for (var row of global.tableData.data) {
            var ifContain = false
            for (var key in row) { // 遍历每一单元格数据
                if (row[key] == null) {
                    continue // 如果单元格数据为空，则跳过
                }
                if (row[key].toString().toLowerCase().includes(lowFilterText)) {
                    ifContain = true
                    break
                }
            }
            if (ifContain) { // 如果包含过滤文本
                newFilteredData.push(row)
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
function sortFunc(a, b, is_asc, key) {
    const sortValue = global.tableData.values[global.tableData.sortMap[key]] // 转换为大写值
    const aValue = a[sortValue]
    const bValue = b[sortValue]
    const langOfA = langTool.detectLanguage(aValue)
    var collator = null
    if (key == global.tableData.sortMap[key] && langOfA == langTool.detectLanguage(bValue)) {
        if (langOfA == "zh") {
            collator = Intl.Collator("zh-u-co-pinyin")
        }
        else if (langOfA == "ja") {
            collator = Intl.Collator("ja")
        }
    }
    if (collator == null) {
        if (aValue > bValue) return is_asc ? 1 : -1
        else if (aValue < bValue) return is_asc ? -1 : 1
        else return 0
    }
    else {
        if (collator.compare(aValue, bValue) > 0) return is_asc ? 1 : -1
        else if (collator.compare(aValue, bValue) < 0) return is_asc ? -1 : 1
        else return 0
    }
}
function sortData() {
    var allNone = true
    for (var key in sortOfHeaders) { // 遍历每一表头
        if (sortOfHeaders[key] == "none") {
            continue
        }
        else if (sortOfHeaders[key] == "asc") {
            filteredData.value.sort((a, b) => sortFunc(a, b, true, key))
            allNone = false
            break
        }
        else {
            filteredData.value.sort((a, b) => sortFunc(a, b, false, key))
            allNone = false
            break
        }
    }
    if (allNone) { // 如果所有表头都是none，则默认按第一个表头排序
        filteredData.value.sort((a, b) => sortFunc(a, b, true, global.tableData.keys[0]))
    }
}

// 分组
watch(() => global.viewOpt.groupSortBy, (newGroupSortBy) => { // 监听分组排序变化
    groupData()
})
function groupData() {
    if (global.viewOpt.groupSortBy == "none") { // 如果不分组，则直接返回
        groupedData.value = filteredData.value
    }
    else {
        groupedData.value = []
        groupKey = ref(global.viewOpt.groupSortBy.split('-')[0]) // 获取分组的key
        if (global.tableData.group[groupKey.value] == "alphabet") { // 如果分组为字母，则按字母分组
            var alphabet = "abcdefghijklmnopqrstuvwxyz"
            const alphabetCount = {}
            for (var i of alphabet) { // 初始化字母分组
                alphabetCount[i] = []
            }
            var getFirstLetter = null // 获取首字母的函数
            if (global.tableData.sortMap[groupKey.value] == groupKey.value) { // 如果分组的key和排序的key相同，则自动计算首字母
                getFirstLetter = (row) => {
                    return langTool.getFirstLetter(row[global.tableData.values[groupKey.value]])
                }
            }
            else {
                getFirstLetter = (row) => { // 如果分组的key和排序的key不同，则使用排序的key计算首字母
                    return row[global.tableData.values[global.tableData.sortMap[groupKey.value]]][0]
                }
            }
            for (var index in filteredData.value) { // 遍历每一行数据
                let firstLetter = getFirstLetter(filteredData.value[index]).toLowerCase() // 获取首字母
                alphabetCount[firstLetter].push(index) // 将首字母对应的行索引加入到字母分组中
                filteredData.value[index].GROUP = firstLetter.toUpperCase()
                filteredData.value[index].GROUPSPAN = null
            }
            if (global.viewOpt.groupSortBy.includes("desc")) { // 如果分组为降序，则反转字母顺序
                alphabet = alphabet.split("").reverse()
            }
            for (var i of alphabet) { // 遍历字母
                if (alphabetCount[i].length > 0) { // 如果字母分组不为空，则将字母分组加入到分组数据中
                    filteredData.value[alphabetCount[i][0]].GROUPSPAN = alphabetCount[i].length // 设置分组的行数
                    for (var index of alphabetCount[i]) {
                        groupedData.value.push(filteredData.value[index])
                    }
                }
            }
        }
        else {
            const dataClassification = {}
            for (var index in filteredData.value) {
                let classificationValue = filteredData.value[index][global.tableData.values[groupKey.value]]
                if (classificationValue == null) { // 如果分组值为空，则跳过
                    continue
                }
                if (dataClassification[classificationValue] == null) { // 如果分组不存在，则初始化分组
                    dataClassification[classificationValue] = []
                }
                dataClassification[classificationValue].push(index) // 将分组的行索引加入到分组中
                filteredData.value[index].GROUP = classificationValue
                filteredData.value[index].GROUPSPAN = null
            }
            var valueList = Object.keys(dataClassification) // 获取分组的值列表
            if (global.viewOpt.groupSortBy.includes("desc")) { // 如果分组为降序，则反转分组顺序
                valueList = valueList.reverse()
            }
            for (var i of valueList) { // 遍历分组的值
                if (dataClassification[i].length > 0) { // 如果分组不为空，则将分组加入到分组数据中
                    filteredData.value[dataClassification[i][0]].GROUPSPAN = dataClassification[i].length // 设置分组的行数
                    for (var index of dataClassification[i]) {
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