<template>
    <n-flex align="center" style="padding: 12px">
        <n-card id="selectCover" embedded :bordered="false" @click="handleClick" style="width: fit-content" content-style="padding: 0; width: fit-content">
            <n-flex vertical align="center">
                <n-card embedded content-style="padding: 0" :style="`width: ${imgSize[0] + 2}px; height: ${imgSize[1] + 2}px; overflow: hidden`">
                    <n-image :src="img" object-fit="cover" :preview-disabled="true" :width="imgSize[0]" :height="imgSize[1]">
                        <template #error>
                            <n-flex justify="center" align="center" style="position: absolute; inset: 0; width: 100%; height: 100%">
                                <svg-icon type="mdi" :path="mdiImageBrokenVariant" size="72"/>
                            </n-flex>
                        </template>
                    </n-image>
                    <n-icon v-if="coverIcon !== undefined" id="coverIcon" :color="coverIconColor">
                        <svg-icon type="mdi" :path="coverIcon"/>
                    </n-icon>
                </n-card>
                <p v-if="coverTitle !== undefined" :style="`margin: 0; padding-bottom: 8px; text-align: center; white-space: pre-line; word-wrap: break-word; width: ${imgSize[0] - 16}px`">
                    {{ coverTitle }}
                </p>
            </n-flex>
        </n-card>
    </n-flex>
</template>

<style scoped>
#selectCover {
    cursor: pointer;
}
#selectCover:hover {
    transform: scale(1.05);
    transition: transform 0.2s ease;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
}
#coverIcon {
    position: absolute;
    bottom: 8px;
    right: 8px;
    stroke: #808080;
    stroke-width: 1px;
}
</style>

<script setup lang="ts">
import type { ComputedRef } from "vue"
import type { GroupInfoDataRow } from "../types/types"
import { NFlex, NCard, NImage, NIcon } from "naive-ui"
import SvgIcon from "@jamescoyle/vue-icon"
import { mdiImageBrokenVariant } from "@mdi/js"
import { computed } from "vue"
import global from "../plugins/global"

const props = defineProps<{
    displayRow: GroupInfoDataRow
}>()

const img = computed(() => {
    let image = undefined
    try {
        if(global.databaseData!.gridView) {
            if(global.databaseData!.dualTable && !global.isChildTable) {
                image = JSON.parse(props.displayRow[2] as string)[props.displayRow[1] as number][1]
            } else {
                image = props.displayRow[1]
            }
            if(image === null || image === undefined || typeof image !== "string" || image === "") {
                return "Error Image"
            } else {
                return image
            }
        } else {
            return undefined
        }
    } catch(error) {
        return "Error Image"
    }
}) as ComputedRef<string | undefined>
const imgSize = computed(() => {
    let size = [150, 225]
    switch(global.gridSize) {
        case "large":
            size = [300, 450]
            break
        case "small":
            size = [75, 112.5]
            break
    }
    return size
})

const coverTitle = computed(() => {
    if(global.isChildTable && global.databaseData!.table2Title !== null) {
        let title = undefined
        for(const columnId of global.databaseData!.table2Title) {
            const column = global.databaseData!.table2Info[columnId]
            if(column.ifDisplay && (column.displayLang === "none" || column.displayLang === global.lang.currentLang)) {
                title = String(props.displayRow[columnId])
                break
            }
        }
        return title
    } else if(global.databaseData!.table1Title !== null) {
        let title = undefined
        for(const columnId of global.databaseData!.table1Title) {
            const column = global.databaseData!.table1Info[columnId]
            if(column.ifDisplay && (column.displayLang === "none" || column.displayLang === global.lang.currentLang)) {
                title = String(props.displayRow[columnId])
                break
            }
        }
        return title
    }
    return undefined
})

const coverIcon = computed(() => {
    if(global.isChildTable && global.databaseData!.table2Label !== null) {
        const valuePreset = global.databaseData!.table2Info[global.databaseData!.table2Label].valuePreset
        const value = String(props.displayRow[global.databaseData!.table2Label])
        if(valuePreset === "none" || !valuePreset.hasOwnProperty(value) || !valuePreset[value].hasOwnProperty("icon")) {
            return undefined
        }
        return valuePreset[value].icon
    } else if(global.databaseData!.table1Label !== null) {
        const valuePreset = global.databaseData!.table1Info[global.databaseData!.table1Label].valuePreset
        const value = String(props.displayRow[global.databaseData!.table1Label])
        if(valuePreset === "none" || !valuePreset.hasOwnProperty(value) || !valuePreset[value].hasOwnProperty("icon")) {
            return undefined
        }
        return valuePreset[value].icon
    }
    return undefined
})

const coverIconColor = computed(() => {
    if(global.isChildTable && global.databaseData!.table2Label !== null) {
        const valuePreset = global.databaseData!.table2Info[global.databaseData!.table2Label].valuePreset
        const value = String(props.displayRow[global.databaseData!.table2Label])
        if(valuePreset === "none" || !valuePreset.hasOwnProperty(value) || !valuePreset[value].hasOwnProperty("color")) {
            return undefined
        }
        return valuePreset[value].color
    } else if(global.databaseData!.table1Label !== null) {
        const valuePreset = global.databaseData!.table1Info[global.databaseData!.table1Label].valuePreset
        const value = String(props.displayRow[global.databaseData!.table1Label])
        if(valuePreset === "none" || !valuePreset.hasOwnProperty(value) || !valuePreset[value].hasOwnProperty("color")) {
            return undefined
        }
        return valuePreset[value].color
    }
    return undefined
})

function handleClick() {
    if(global.isChildTable) {
        global.selectedRow.child = props.displayRow[0] - 1
        global.page = "row"
    } else {
        global.selectedRow.primary = props.displayRow[0] - 1
        if(global.databaseData!.dualTable) {
            global.isChildTable = true
        } else {
            global.page = "row"
        }
    }
}
</script>