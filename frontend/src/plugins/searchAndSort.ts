import type { Order } from "@/plugins/transportTypes"
import { reactive, watch } from "vue"
import global from "@/plugins/global"
import languageTool from "@/plugins/languageTool"

type GroupTag = { rowId: number, groupTitle: string | boolean | null, groupSpan: number | null }

interface SearchAndSort {
    filteredItems1: number[],
    sortedItems1: number[],
    groupedItems1: GroupTag[],
    filteredItems2: number[],
    sortedItems2: number[],
    groupedItems2: GroupTag[],
    filterFunc: () => void,
    sortFunc: () => void,
    groupFunc: () => void
}

const searchAndSort: SearchAndSort = {
    filteredItems1: reactive([]),
    sortedItems1: reactive([]),
    groupedItems1: reactive([]),
    filteredItems2: reactive([]),
    sortedItems2: reactive([]),
    groupedItems2: reactive([]),

    filterFunc() {
        const tableData = global.currentTable.value
        const filterText = global.view.filterText
        this.filteredItems1 = []
        this.filteredItems2 = []
        const filteredItems = !global.isChildTable.value ? this.filteredItems1 : this.filteredItems2
        if(filterText === null || filterText === "") { // 如果为空则不过滤
            for(const row of tableData) {
                filteredItems.push(row[global.colIdMap.value.id] as number)
            }
        } else {
            const lowerFilterText = filterText.toLowerCase() // 统一转换为小写比较
            for(const row of tableData) { // 遍历每一行
                let isMatch = false
                for(const colKey in row) {  // 遍历每一列
                    const value = row[colKey]
                    if(value !== null && value !== undefined && // 值不为空且包含搜索词
                        value.toString().toLowerCase().includes(lowerFilterText)) {
                        isMatch = true
                        break
                    }
                }
                if(isMatch) { // 如果匹配则通过
                    filteredItems.push(row[global.colIdMap.value.id] as number)
                }
            }
        }
    },
    sortFunc() {
        const filteredItems = !global.isChildTable.value ? this.filteredItems1 : this.filteredItems2
        // 获取排序列和排序顺序
        let sortCol = !global.isChildTable.value ?
            global.currentData.value.sort1.column : global.currentData.value.sort2.column
        let sortOrder: Order | boolean = !global.isChildTable.value ?
            global.currentData.value.sort1.order : global.currentData.value.sort2.order
        sortCol = sortCol === null ? global.colIdMap.value.id : sortCol
        sortOrder = (sortOrder === "-" ? "asc" : sortOrder) === "asc" ? true: false
        const sortedItems = filteredItems.sort((a, b) => {
            // 获取比较值
            const tableData = global.currentTable.value
            const aValue = JSON.stringify(tableData[a][global.currentTableInfo.value[sortCol].sortMap])
            const bValue = JSON.stringify(tableData[b][global.currentTableInfo.value[sortCol].sortMap])
            let collator = null
            const langOfA = languageTool.detectLanguage(aValue)
            const langOfB = languageTool.detectLanguage(bValue)
            if(langOfA === langOfB) { // 如果语言相通则使用比较器并考虑数字顺序
                if(langOfA === "zh") {
                    collator = new Intl.Collator("zh-Hans-CN", { numeric: true })
                } else if(langOfA === "ja") {
                    collator = new Intl.Collator("ja", { numeric: true })
                } else {
                    collator = new Intl.Collator("en", { numeric: true })
                }
                if(collator.compare(aValue, bValue) > 0) return sortOrder ? 1 : -1
                else if(collator.compare(aValue, bValue) < 0) return !sortOrder ? 1 : -1
                else return 0
            } else { // 语言不同则直接比较
                if(aValue > bValue) return sortOrder ? 1 : -1
                else if(aValue < bValue) return !sortOrder ? 1 : -1
                else return 0
            }
        })
        if(!global.isChildTable.value) {
            this.sortedItems1 = sortedItems
        } else {
            this.sortedItems2 = sortedItems
        }
    },
    groupFunc() {
        const sortedItems = !global.isChildTable.value ?
            this.sortedItems1 : this.sortedItems2
        const groupSortCol = !global.isChildTable.value ?
            global.currentData.value.groupSort1.column : global.currentData.value.groupSort2.column
        const groupedItems = []
        if(groupSortCol === null) { // 如果不分组则直接返回排序结果
            for(const rowId of sortedItems) {
                groupedItems.push({ rowId: rowId, groupTitle: null, groupSpan: null })
            }
        } else {
            const groupSortOrder = !global.isChildTable.value ?
                global.currentData.value.groupSort1.order : global.currentData.value.groupSort2.order
            // 通用分类函数
            const commonClassify = (classList: string[], getCellValue: (oriValue: string) => string = (oriValue) => oriValue) => {
                const classBuckets: { [ key: string ]: number[] } = {}
                for(const className of classList) { // 初始化分类桶
                    classBuckets[className] = []
                }
                const tmpGroupTags: { [ key: number ]: GroupTag } = {}
                for(const rowId of sortedItems) { // 遍历排序结果，分配到各个分类桶中
                    const cellValue = getCellValue(global.currentTable.value[rowId][global.currentTableInfo.value[groupSortCol].sortMap] as string)
                    classBuckets[cellValue].push(rowId)
                    tmpGroupTags[rowId] = { rowId: rowId, groupTitle: cellValue, groupSpan: null }
                }
                if(groupSortOrder === "desc") { // 如果是降序则反转分类顺序
                    classList.reverse()
                }
                for(const className of classList) { // 遍历分类桶，生成分组结果
                    const bucket = classBuckets[className]
                    if(bucket.length > 0) { // 如果桶内有内容则添加分组
                        tmpGroupTags[bucket[0]].groupSpan = bucket.length // 设置分组跨度
                        for(const rowId of bucket) {
                            groupedItems.push(tmpGroupTags[rowId])
                        }
                    }
                }
            }
            switch(global.currentTableInfo.value[groupSortCol].groupType) {
            case null:
                throw new Error("Column group type is null.")
            case "alphabet": { // 按字母分组
                const alphabetList = "#ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
                const getFirstLetter = (oriValue: string) => languageTool.getFirstLetter(oriValue).toLowerCase() // 获取首字母函数
                commonClassify(alphabetList, getFirstLetter)
                break
            }
            default: { // 自定义分类分组
                commonClassify(global.currentTableInfo.value[groupSortCol].groupType as string[])
            }
            }
        }
        if(!global.isChildTable.value) {
            this.groupedItems1 = groupedItems
        } else {
            this.groupedItems2 = groupedItems
        }
    }
}

export default searchAndSort

// 监听过滤文本变化，触发搜索和排序
let timer: number | null = null
watch(() => global.view.filterText, () => {
    if(timer !== null) {
        clearTimeout(timer)
    }
    timer = setTimeout(() => { // 防抖动
        searchAndSort.filterFunc()
        searchAndSort.sortFunc()
        searchAndSort.groupFunc()
    }, 100)
}, { immediate: false })

watch([ searchAndSort.filteredItems1, searchAndSort.filteredItems2,
    global.currentData.value.sort1, global.currentData.value.sort2 ], () => {
    searchAndSort.sortFunc()
    searchAndSort.groupFunc()
}, { deep: true })

watch([ searchAndSort.sortedItems1, searchAndSort.sortedItems2,
    global.currentData.value.groupSort1, global.currentData.value.groupSort2 ],
searchAndSort.groupFunc, { deep: true })