<template>
    <div v-if="tableData.loading">
        <v-skeleton-loader type="table-thead" />
        <v-skeleton-loader type="table-tbody" />
    </div>
    <div id="fillHeightDiv" v-if="!tableData.loading">
        <v-table fixed-header hover class="fill-height">
            <thead>
                <label v-if="tableHeaders.length == 0" class="d-flex justify-center align-center ma-8">{{
                    $lang.text.noData[$lang.currentLang] }}</label>
                <tr>
                    <th v-for="header in tableHeaders" :width="header.width" class="border-e pa-0 fill-height">
                        <v-hover>
                            <template v-slot:default="{ isHovering, props }">
                                <v-btn v-bind="props" block variant="text" rounded="0" size="x-large"
                                    @click="clickHeader(header.key)" class="pl-2 pr-2">
                                    <label class="text-body-2">{{ header.text }}</label>
                                    <v-icon v-if="isHovering && (sortOfHeaders[header.key] == 'true')"
                                        icon="mdi-menu-swap" size="small" class="position-absolute right-0" />
                                    <v-icon v-if="sortOfHeaders[header.key] != 'true'"
                                        :icon="(sortOfHeaders[header.key] == 'up') ? 'mdi-menu-up' : 'mdi-menu-down'"
                                        size="small" class="position-absolute right-0" />
                                </v-btn>
                            </template>
                        </v-hover>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in filteredData" @click="selectRow(row[tableHeaders[0].value])">
                    <td v-for="header in tableHeaders" class="border-e pa-0">
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
    height: calc(100vh - 176px);
}

#tableItemText {
    word-break: break-word;
}
</style>

<script setup>
import { reactive, computed } from "vue"
import { useLang, useTableData } from "@/plugins/useGlobal.js"

const lang = useLang()
const tableData = useTableData()
const tableHeaders = computed(() => {
    var headers = []
    tableData.keys.forEach(hkey => {
        headers.push({
            key: hkey, value: tableData.values[hkey], text: tableData.text[hkey][lang.currentLang],
            align: tableData.align[hkey], width: tableData.computeWidth(hkey, lang.currentLang)
        })
    })
    return headers
})

var sortOfHeaders = reactive({})
tableData.keys.forEach(hkey => {
    sortOfHeaders[hkey] = "true"
})
function clickHeader(hkey) {
    for (var key in sortOfHeaders) {
        if (key != hkey) {
            sortOfHeaders[key] = "true"
        }
    }
    if (sortOfHeaders[hkey] == "true") {
        sortOfHeaders[hkey] = "up"
    }
    else if (sortOfHeaders[hkey] == "up") {
        sortOfHeaders[hkey] = "down"
    }
    else {
        sortOfHeaders[hkey] = "true"
    }
}

const filteredData = computed(() => {
    var tmpData = []
    if (tableData.filterText == null || tableData.filterText == "") {
        tmpData = tableData.data
    }
    else {
        for (var id in tableData.data) {
            var ifContain = false
            for (var key in tableData.data[id]) {
                if (tableData.data[id][key].toString().toLowerCase().includes(tableData.filterText.toLowerCase())) {
                    ifContain = true
                    break
                }
            }
            if (ifContain) {
                tmpData.push(tableData.data[id])
            }
        }
    }
    console.log(tmpData)
    for (var id in sortOfHeaders) {
        if (sortOfHeaders[id] == "true") {
            break
        }
        else if (sortOfHeaders[id] == "up") {
            tmpData.sort((a, b) => {
                let sortValue = tableData.values[tableData.sortMap[sortOfHeaders[id]]]
                if (a[sortValue] > b[sortValue]) return 1
                if (a[sortValue] < b[sortValue]) return -1
                return 0
            })
        }
        else {
            tmpData.sort((a, b) => {
                let sortValue = tableData.values[tableData.sortMap[sortOfHeaders[id]]]
                if (a[sortValue] < b[sortValue]) return 1
                if (a[sortValue] > b[sortValue]) return -1
                return 0
            })
        }
    }
    console.log(tmpData)
    return tmpData
})

var rowColor = reactive({})
function selectRow(id) {
    if (tableData.selectedRow != null) {
        rowColor[tableData.selectedRow] = "transparent"
    }
    tableData.selectedRow = id
    rowColor[id] = "#9E9E9E20"
}

tableData.updateReq()
</script>