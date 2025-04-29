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
                                    <v-icon v-if="isHovering && (hoverOnHeaders[header.key] == 'true')"
                                        icon="mdi-menu-swap" size="small" class="position-absolute right-0" />
                                    <v-icon v-if="hoverOnHeaders[header.key] != 'true'"
                                        :icon="(hoverOnHeaders[header.key] == 'up') ? 'mdi-menu-up' : 'mdi-menu-down'"
                                        size="small" class="position-absolute right-0" />
                                </v-btn>
                            </template>
                        </v-hover>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in tableData.data" @click="selectRow(row[tableHeaders[0].value])">
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

var hoverOnHeaders = reactive({})
tableData.keys.forEach(hkey => {
    hoverOnHeaders[hkey] = "true"
})
function clickHeader(hkey) {
    for (var key in hoverOnHeaders) {
        if (key != hkey) {
            hoverOnHeaders[key] = "true"
        }
    }
    if (hoverOnHeaders[hkey] == "true") {
        hoverOnHeaders[hkey] = "up"
        tableData.data.sort((a, b) => {
            let sortValue = tableData.values[tableData.sortMap[hkey]]
            if (a[sortValue] > b[sortValue]) return 1
            if (a[sortValue] < b[sortValue]) return -1
            return 0
        })
    }
    else if (hoverOnHeaders[hkey] == "up") {
        hoverOnHeaders[hkey] = "down"
        tableData.data.sort((a, b) => {
            let sortValue = tableData.values[tableData.sortMap[hkey]]
            if (a[sortValue] < b[sortValue]) return 1
            if (a[sortValue] > b[sortValue]) return -1
            return 0
        })
    }
    else {
        hoverOnHeaders[hkey] = "true"
        tableData.data.sort((a, b) => {
            let sortValue = tableHeaders.value[0].value
            if (a[sortValue] > b[sortValue]) return 1
            if (a[sortValue] < b[sortValue]) return -1
            return 0
        })
    }
}

var rowColor = reactive({})
tableData.data.forEach(row => {
    rowColor[row[tableHeaders[0].value]] = "transparent"
})
function selectRow(id) {
    if (tableData.selectedRow != null) {
        rowColor[tableData.selectedRow] = "transparent"
    }
    tableData.selectedRow = id
    rowColor[id] = "#9E9E9E20"
}

tableData.updateReq()
</script>