<template>
    <div v-if="loading">
        <v-skeleton-loader type="table-thead" />
        <v-skeleton-loader type="table-tbody" />
    </div>
    <div id="fillHeightDiv" v-if="!loading">
        <v-table fixed-header class="fill-height">
            <thead>
                <label v-if="tableHeaders.length == 0" class="d-flex justify-center align-center ma-8">{{
                    $lang.text.noData[$lang.currentLang] }}</label>
                <tr>
                    <th v-for="header in tableHeaders" :max-width="header.width">
                        <label :class="'d-flex justify-' + header.align">{{ header.title }}</label>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in tableData">
                    <td v-for="header in tableHeaders">
                        <label :class="'d-flex justify-' + header.align">{{ row[header.value] }}</label>
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
</style>

<script setup>
const { loading = false, tableHeaders = [], tableData = [] } = defineProps(["loading", "tableHeaders", "tableData"])
</script>