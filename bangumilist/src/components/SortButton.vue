<template>
    <n-button circle text @click="toggleOrder">
        <template #icon>
            <svg-icon v-if="order === 'asc'" type="mdi" :path="mdiChevronUp"/>
            <svg-icon v-else-if="order === 'desc'" type="mdi" :path="mdiChevronDown"/>
            <svg-icon v-else type="mdi" :path="mdiUnfoldMoreHorizontal"/>
        </template>
    </n-button>
</template>

<script setup lang="ts">
import { NButton } from "naive-ui"
import SvgIcon from "@jamescoyle/vue-icon"
import { mdiChevronUp, mdiChevronDown, mdiUnfoldMoreHorizontal } from "@mdi/js"
import { ref, watch } from "vue"
import global from "../plugins/global"
import searchAndSort from "../plugins/searchAndSort"

const props = defineProps<{
    columnId: number
}>()

const order = ref("-")

watch(() => global.isChildTable, (newStatus) => {
    const sort = newStatus ? global.databaseData!.sort2 : global.databaseData!.sort1
    if(props.columnId === sort.column) {
        order.value = sort.order
    }
})
watch(() => global.isChildTable ? global.databaseData!.sort2 : global.databaseData!.sort1, (newSort) => {
    if(props.columnId !== newSort.column) {
        order.value = "-"
    }
})

function toggleOrder() {
    switch(order.value) {
        case "-":
            order.value = "asc"
            break
        case "asc":
            order.value = "desc"
            break
        default:
            order.value = "-"
    }
    if(global.isChildTable) {
        global.databaseData!.sort2 = { column: props.columnId, order: order.value as "asc" | "desc" | "-" }
    } else {
        global.databaseData!.sort1 = { column: props.columnId, order: order.value as "asc" | "desc" | "-" }
    }
    searchAndSort.sortFunc()
}
</script>