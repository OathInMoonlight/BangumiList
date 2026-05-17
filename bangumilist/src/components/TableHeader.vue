<template>
    <n-button block text icon-placement="right" @click="toggleOrder">
        {{ props.columnTitle }}
        <template #icon>
            <svg-icon v-if="order === 'asc'" type="mdi" :path="mdiChevronUp"/>
            <svg-icon v-else-if="order === 'desc'" type="mdi" :path="mdiChevronDown"/>
            <n-icon v-else :depth="5">
                <svg-icon type="mdi" :path="mdiUnfoldMoreHorizontal"/>
            </n-icon>
        </template>
    </n-button>
</template>

<script setup lang="ts">
import { NButton, NIcon } from "naive-ui"
import SvgIcon from "@jamescoyle/vue-icon"
import { mdiChevronUp, mdiChevronDown, mdiUnfoldMoreHorizontal } from "@mdi/js"
import { ref, watch } from "vue"
import global from "../plugins/global"
import searchAndSort from "../plugins/searchAndSort"

const props = defineProps<{
    columnId: number,
    columnTitle: string
}>()

const order = ref("-")

watch(() => global.isChildTable ? global.databaseData!.sort2 : global.databaseData!.sort1, (newSort) => {
    order.value = props.columnId === newSort.column ? newSort.order : "-"
}, { immediate: true })

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
    global.databaseSaved = false
    searchAndSort.sortFunc()
}
</script>