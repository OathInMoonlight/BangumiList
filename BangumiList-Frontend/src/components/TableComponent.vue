<template>
    <div v-if="loading">
        <v-skeleton-loader type="table-thead" />
        <v-skeleton-loader type="table-tbody" />
    </div>
    <div id="fillHeightDiv" v-if="!loading">
        <v-table fixed-header hover class="fill-height">
            <thead>
                <label v-if="tableHeaders.length == 0" class="d-flex justify-center align-center ma-8">{{
                    $lang.text.noData[$lang.currentLang] }}</label>
                <tr>
                    <th v-for="header in tableHeaders" :width="header.width" class="border-e pa-0 fill-height">
                        <v-btn block variant="text" rounded="0" size="x-large" class="pl-2 pr-2">
                            <label class="text-body-2">{{ header.text }}</label>
                        </v-btn>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in tableData" @click="selectRow(row[tableHeaders[0].value])">
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
const { loading = false, tableHeaders = [], tableData = [] } = defineProps(["loading", "tableHeaders", "tableData"])
const emit = defineEmits(["selectRow"])
import { reactive } from "vue"

var selectedRow = null
var rowColor = reactive({})
tableData.forEach(row => {
    rowColor[row[tableHeaders[0].value]] = "transparent"
})

function selectRow(id) {
    if(selectedRow != null){
        rowColor[selectedRow] = "transparent"
    }
    selectedRow = id
    rowColor[id] = "#9E9E9E11"
    emit("selectRow", id)
}
</script>