import type { DataRow } from "../types/dataTypes"
import type { SearchAndSort, GroupTag, GroupInfoDataRow } from "../types/types"
import { reactive, toRaw, watch } from "vue"
import global from "../plugins/global"
import languageTool from "../plugins/languageTool"

const searchAndSort: SearchAndSort = reactive({
    primaryFiltered: [],
    childFiltered: [],
    primarySorted: [],
    childSorted: [],
    primaryGrouped: [],
    childGrouped: [],

    filterFunc() {
        const tableData = global.isChildTable ? JSON.parse(global.databaseData!.tableData[global.selectedRow.primary as number][global.databaseData!.gridView ? 2 : 1] as string)
            : global.databaseData!.tableData
        let filteredRows = []
        if(global.filterText === null || global.filterText === undefined || global.filterText === "") { // 如果为空则不过滤
            filteredRows = tableData
        } else {
            const lowerFilterText = global.filterText.toLowerCase() // 统一转换为小写比较
            for(const row of tableData) { // 遍历每一行
                let isMatch = false
                for(const colKey in row) { // 遍历每一列
                    const value = row[colKey]
                    if(value !== null && value !== undefined && // 值不为空且包含搜索词
                        String(value).toLowerCase().includes(lowerFilterText)) {
                        isMatch = true
                        break
                    }
                }
                if(isMatch) { // 如果匹配则通过
                    filteredRows.push(row)
                }
            }
        }
        if(global.isChildTable) {
            this.childFiltered = filteredRows
        } else {
            this.primaryFiltered = filteredRows
        }
        this.sortFunc()
    },
    sortFunc() {
        const tableInfo = global.isChildTable ? global.databaseData!.table2Info : global.databaseData!.table1Info
        // 获取排序列和排序顺序
        let sortColumn = global.isChildTable ? global.databaseData!.sort2.column : global.databaseData!.sort1.column
        let sortOrder: "asc" | "desc" | "-" | boolean = global.isChildTable ? global.databaseData!.sort2.order : global.databaseData!.sort1.order
        if(sortColumn === null || sortOrder === "-") {
            sortColumn = 0
            sortOrder = true
        } else{
            sortOrder = sortOrder === "asc"
        }
        const sortedRows = (global.isChildTable ? this.childFiltered : this.primaryFiltered).toSorted((a, b) => {
            const aValue = a[tableInfo[sortColumn].sortMap]
            const bValue = b[tableInfo[sortColumn].sortMap]
            switch(tableInfo[tableInfo[sortColumn].sortMap].dataType) {
                case "bool":
                    const result = aValue === bValue ? 0 : (aValue ? 1 : -1)
                    return sortOrder ? result : -result
                case "number":
                    const aNumber = aValue as number
                    const bNumber = bValue as number
                    if(aNumber > bNumber) return sortOrder ? 1 : -1
                    else if(aNumber < bNumber) return !sortOrder ? 1 : -1
                    else return 0
                default:
                    const aText = (aValue as string).normalize("NFKC").trim()
                    const bText = (bValue as string).normalize("NFKC").trim()
                    let collator = null
                    const langOfA = languageTool.detectLanguage(aText[0]) // 返回 "zh"、"ja"、"en" 或 "#"（无法识别）
                    const langOfB = languageTool.detectLanguage(bText[0])
                    if(langOfA === langOfB) { // 如果语言相通则使用比较器并考虑数字顺序
                        if(langOfA === "zh") {
                            collator = new Intl.Collator("zh-Hans-CN", { numeric: true })
                        } else if(langOfA === "ja") {
                            collator = new Intl.Collator("ja", { numeric: true })
                        } else {
                            collator = new Intl.Collator("en", { numeric: true })
                        }
                    } else { // 语言不同则直接比较
                        collator = new Intl.Collator("en", { numeric: true })
                    }
                    const compareResult = collator.compare(aText, bText)
                    if(compareResult > 0) return sortOrder ? 1 : -1
                    else if(compareResult < 0) return !sortOrder ? 1 : -1
                    else return 0
            }
        })
        if(global.isChildTable) {
            this.childSorted = sortedRows
        } else {
            this.primarySorted = sortedRows
        }
        this.groupFunc()
    },
    groupFunc() {
        const sortedRows = global.isChildTable ? this.childSorted : this.primarySorted
        const groupSort = global.isChildTable ? global.databaseData!.groupSort2 : global.databaseData!.groupSort1
        let groupedRows: GroupInfoDataRow[] = []
        if(groupSort.column === null || groupSort.order === "-") { // 如果不分组则直接返回排序结果
            groupedRows = sortedRows
        } else {
            const currentColumnInfo = global.isChildTable ? global.databaseData!.table2Info : global.databaseData!.table1Info
            // 通用分类函数
            const commonClassify = (oriClassList: unknown[], getValueClass: (oriValue: string) => string = (oriValue) => String(oriValue)) => {
                let classList: string[] = []
                classList = typeof oriClassList[0] === "string" ? oriClassList as string[] : oriClassList.map(value => String(value))
                classList.unshift("#")
                const classBuckets: { [ key: string ]: number[] } = {}
                for(const classValue of classList) { // 初始化分类桶
                    classBuckets[classValue] = []
                }
                const tmpGroupTags: { [ key: number ]: GroupTag } = {}
                for(const rowId in sortedRows) { // 遍历排序结果，分配到各个分类桶中
                    let cellValue = getValueClass(sortedRows[rowId][currentColumnInfo[groupSort.column as number].sortMap] as string)
                    if(!classBuckets.hasOwnProperty(cellValue)) {
                        cellValue = "#"
                    }
                    classBuckets[cellValue].push(parseInt(rowId)) // 注意行ID从1开始，数组索引从0开始，因此需要减1
                    tmpGroupTags[parseInt(rowId)] = { groupTitle: cellValue, groupSpan: 0, groupIndex: classBuckets[cellValue].length - 1 }
                }
                if(groupSort.order === "desc") { // 如果是降序则反转分类顺序
                    classList.reverse()
                }
                for(const classValue of classList) { // 遍历分类桶，生成分组结果
                    const bucket = classBuckets[classValue]
                    if(bucket.length > 0) { // 如果桶内有内容则添加分组
                        for(const rowId of bucket) {
                            tmpGroupTags[rowId].groupSpan = bucket.length // 设置分组跨度
                            groupedRows.push({ ...(sortedRows[rowId] as DataRow), ...tmpGroupTags[rowId]})
                        }
                    }
                }
            }
            switch(currentColumnInfo[groupSort.column].groupType) {
                case null:
                    throw new Error("Column group type is null.")
                case "alphabet": // 按字母分组
                    const alphabetList = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
                    const getFirstLetter = (oriValue: string) => languageTool.getFirstLetter(oriValue).toUpperCase() // 获取首字母函数
                    commonClassify(alphabetList, getFirstLetter)
                    break
                default: // 自定义分类分组
                    commonClassify(structuredClone(toRaw(currentColumnInfo[groupSort.column].groupType as unknown[])))
            }
        }
        if(global.isChildTable) {
            this.childGrouped = groupedRows as never[]
        } else {
            this.primaryGrouped = groupedRows as never[]
        }
    }
})

export default searchAndSort

// 监听过滤文本变化，触发搜索和排序
watch(() => global.databaseLoaded, (newStatus) => {
    if(newStatus === true) {
        searchAndSort.filterFunc()
    }
})
watch(() => [global.isChildTable, global.filterText, global.page], () => {
    if(global.databaseLoaded) {
        searchAndSort.filterFunc()
    }
})