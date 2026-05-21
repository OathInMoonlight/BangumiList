<template>
    <n-card embedded style="height: calc(100% - 114px)" content-style="height: calc(100% - 114px)">
        <n-scrollbar trigger="none" style="height: 100%">
            <n-flex vertical :size="32" style="height: 100%">
                <n-flex justify="center">
                    <n-select v-model:value="column" :options="columnOptions" clearable :placeholder="global.lang.getText('selectColumn')" size="large" style="width: 256px"/>
                </n-flex>
                <n-flex justify="space-evenly" align="center">
                    <n-statistic v-if="selectedColumn !== null && selectedColumn.dataType === 'number'" :label="global.lang.getText('sum')" :value="numerical.sum"/>
                    <n-statistic v-if="selectedColumn !== null && selectedColumn.dataType === 'number'" :label="global.lang.getText('max')" :value="numerical.max"/>
                    <n-statistic v-if="selectedColumn !== null && selectedColumn.dataType === 'number'" :label="global.lang.getText('min')" :value="numerical.min"/>
                    <n-statistic v-if="selectedColumn !== null && selectedColumn.dataType === 'number'" :label="global.lang.getText('avg')" :value="numerical.avg"/>
                </n-flex>
                <n-flex v-if="selectedColumn !== null" justify="space-evenly" align="center" :size="16">
                    <div style="width: 50%">
                        <Bar :options="barOptions" :data="barData"/>
                    </div>
                    <div style="width: 30%">
                        <Doughnut :options="doughnutOptions" :data="doughnutData"/>
                    </div>
                </n-flex>
            </n-flex>
        </n-scrollbar>
    </n-card>
</template>

<script setup lang="ts">
import type { TooltipItem } from "chart.js"
import { NCard, NFlex, NSelect, NStatistic, NScrollbar } from "naive-ui"
import { computed, ref } from "vue"
import { Chart, BarController, BarElement, DoughnutController, ArcElement, CategoryScale, LinearScale, Tooltip, Legend, plugins } from "chart.js"
import { Bar, Doughnut } from "vue-chartjs"
import global from "../plugins/global"

Chart.register(BarController, BarElement, DoughnutController, ArcElement, CategoryScale, LinearScale, Tooltip, Legend, plugins)

const column = ref<null | number>(null)
const columnOptions = computed(() => {
    const tableInfo = global.isChildTable ? global.databaseData!.table2Info : global.databaseData!.table1Info
    const columns = []
    for(const col of tableInfo) {
        if(col.ifDisplay && (col.displayLang === "none" || col.displayLang === global.lang.currentLang) && col.dataType !== "text" && col.dataType !== "paragraph") {
            columns.push({ label: col.title[global.lang.currentLang], value: col.id })
        }
    }
    return columns
})

const selectedColumn = computed(() => {
    if(column.value === null) {
        return null
    }
    return (global.isChildTable ? global.databaseData!.table2Info : global.databaseData!.table1Info)[column.value]
})

const tableData = computed(() => global.isChildTable ?
    JSON.parse(global.databaseData!.tableData[global.selectedRow.primary as number][global.databaseData!.gridView ? 2 : 1] as string)
    : global.databaseData!.tableData)

const numerical = computed(() => {
    if(selectedColumn.value !== null && selectedColumn.value.dataType === "number") {
        let sum = 0, max = -Infinity, min = Infinity
        for(const row of tableData.value) {
            const value = row[column.value as number]
            sum += value
            if(value > max) {
                max = value
            }
            if(value < min) {
                min = value
            }
        }
        const avg = sum / tableData.value.length
        return { sum, max, min, avg }
    }
    return { sum: 0, max: 0, min: 0, avg: 0 }
})

const metaData = computed(() => {
    if(selectedColumn.value === null) {
        return null
    }
    const valueBuckets: { [key: string]: number } = {}
    let sum = 0
    for(const row of tableData.value) {
        let value = String(row[column.value as number])
        if(selectedColumn.value.dataType === "bool" && value === "undefined") {
            value = "false"
        }
        if(valueBuckets.hasOwnProperty(value)) {
            valueBuckets[value] += 1
        } else {
            valueBuckets[value] = 1
        }
        sum++
    }
    return { labels: Object.keys(valueBuckets), data: Object.values(valueBuckets), origin: valueBuckets, sum: sum }
})

const colorList = [ "#F44336", "#2196F3", "#00BCD4", "#8BC34A", "#FFC107", "#795548" ]

const barOptions = {
    responsive: true,
    plugins: {
        legend: {
            display: false
        }
    }
}
const doughnutOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: "bottom" as "bottom"
        },
        tooltip: {
            callbacks: {
                label: function(item: TooltipItem<"doughnut">) {
                    const value = item.raw as number
                    const percentage = ((value / metaData.value!.sum) * 100).toFixed(2)
                    return `${item.label}: ${value} (${percentage}%)`
                }
            }
        }
    }
}
const barData = computed(() => {
    if(metaData.value === null) {
        return {
            labels: [],
            datasets: [{ data: [] }]
        }
    }
    return {
        labels: metaData.value.labels,
        datasets: [{
            data: metaData.value.data,
            backgroundColor: Array.from(metaData.value.data, (_, i) => colorList[i % colorList.length])
        }]
    }
})
const doughnutData = computed(() => {
    if(metaData.value === null) {
        return {
            labels: [],
            datasets: [{ data: [] }]
        }
    }
    return {
        labels: metaData.value.labels.toSorted((a, b) => metaData.value!.origin[b] - metaData.value!.origin[a]),
        datasets: [{
            data: metaData.value.data.toSorted((a, b) => b - a),
            backgroundColor: Array.from(metaData.value.data, (_, i) => colorList[i % colorList.length])
        }]
    }
})
</script>