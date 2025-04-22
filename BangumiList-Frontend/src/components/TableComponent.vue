<template>
    <div v-if="loading">
        <v-skeleton-loader type="table-thead" />
        <v-skeleton-loader type="table-tbody" />
    </div>
    <div ref="ch" v-if="!loading" class="fill-height">
        <div class="flex-grow-1">
            <v-table fixed-header height="100%">
                <thead>
                    <label v-if="tableHeaders.length == 0" class="d-flex justify-center align-center ma-8">{{
                        $lang.text.noData[$lang.currentLang] }}</label>
                    <tr>
                        <th v-for="header in tableHeaders" :width="header.width">
                            <label :class="'d-flex justify-' + header.align">{{ header.text }}</label>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="row in tableData">
                        <td v-for="header in tableHeaders">
                            <label :class="'d-flex justify-' + header.align">{{ row[header.key] }}</label>
                        </td>
                    </tr>
                </tbody>
            </v-table>
        </div>
    </div>
</template>

<script setup>
import {ref, nextTick} from "vue"

const ch = ref(0)
nextTick(() => {
    console.log(ch.value.scrollHeight)
})
// const { loading = false, tableHeaders = [], tableData = [] } = defineProps(["loading", "tableHeaders", "tableData"])
const loading = false
const tableHeaders = [
    {
        text: 'Dessert (100g serving)',
        key: 'name',
        value: 'name',
        align: 'center',
        width: '256'
    },
    {
        text: 'Calories',
        key: 'calories',
        value: 'calories',
        align: 'left',
        width: null
    },
]
const tableData = [
    {
        calories: 159,
        name: 'Frozen Yogurt',
    },
    {
        name: 'Ice cream sandwich',
        calories: 237,
    },
    {
        name: 'Eclair',
        calories: 262,
    },
    {
        name: 'Cupcake',
        calories: 305,
    },
    {
        name: 'Gingerbread',
        calories: 356,
    },
    {
        name: 'Jelly bean',
        calories: 375,
    },
    {
        name: 'Lollipop',
        calories: 392,
    },
    {
        name: 'Honeycomb',
        calories: 408,
    },
    {
        name: 'Donut',
        calories: 452,
    },
    {
        name: 'KitKat',
        calories: 518,
    },
]
</script>