<template>
    <div id="backImg" :style="`--img-url: url(${img})`">
        <n-flex justify="space-between" align="center" style="padding: 8px">
            <n-flex align="center">
                <n-button quaternary size="large" circle @click="back" :disabled="editMode">
                    <template #icon>
                        <svg-icon type="mdi" :path="mdiChevronLeft"/>
                    </template>
                </n-button>
                <h3 style="margin: 0">{{ global.lang.getText("back") }}</h3>
            </n-flex>
            <n-flex align="center">
                <n-popover placement="bottom">
                    <template #trigger>
                        <n-button quaternary size="large" circle @click="resetEdit">
                            <template #icon>
                                <svg-icon type="mdi" :path="mdiPencil"/>
                            </template>
                        </n-button>
                    </template>
                    {{ global.lang.getText("edit") }}
                </n-popover>
                <n-popover placement="bottom">
                    <template #trigger>
                        <n-button quaternary circle size="large" :disabled="editMode && global.page === 'newRow'" @click="handleDelete">
                            <template #icon>
                                <svg-icon type="mdi" :path="mdiDelete"/>
                            </template>
                        </n-button>
                    </template>
                    {{ global.lang.getText("delete") }}
                </n-popover>
            </n-flex>
        </n-flex>
        <n-flex justify="space-evenly" size="large">
            <n-card embedded content-style="padding: 0" :style="`width: ${imgSize[0] + 2}px; height: ${imgSize[1] + 2}px; overflow: hidden;`">
                <n-image v-if="global.databaseData!.gridView" :src="img" object-fit="cover" :show-toolbar="false" :width="imgSize[0]" :height="imgSize[1]">
                    <template #error>
                        <n-flex justify="center" align="center" style="position: absolute; inset: 0; width: 100%; height: 100%">
                            <svg-icon type="mdi" :path="mdiImageBrokenVariant" size="72"/>
                        </n-flex>
                    </template>
                </n-image>
            </n-card>
            <n-flex vertical align="start" size="large">
                <n-flex v-for="column in global.isChildTable ? global.databaseData!.table2Info : global.databaseData!.table1Info" :key="column.id" align="center"style="max-width: 512px">
                    <p style="max-width: 100%">{{ column.title[global.lang.currentLang] }}: </p>
                    <div v-if="column.id === 0" style="max-width: 100%; word-wrap:break-word">
                        {{ currentRow[0] }}
                    </div>
                    <div v-else-if="global.databaseData!.dualTable && !global.isChildTable && column.id === (global.databaseData!.gridView ? 2 : 1)" style="max-width: 100%; word-wrap:break-word">
                        {{ currentRow[column.id] }}
                    </div>
                    <div v-else-if="editMode">
                        <n-input v-if="column.dataType === 'text' || column.dataType === 'paragraph'" v-model:value="newRowDef[column.id] as string | null" placeholder="" style="width: 256px"/>
                        <n-input-number v-if="column.dataType === 'number'" v-model:value="newRowDef[column.id] as number | null" placeholder="" style="width: 256px"/>
                        <n-select v-if="column.dataType === 'tag'" v-model:value="newRowDef[column.id] as string | null" :options="tagOptions(column)" filterable tag placeholder="" style="width: 256px"/>
                        <colored-switch v-if="column.dataType === 'bool'" v-model="newRowDef[column.id] as boolean" checked-label="" unchecked-label=""/>
                    </div>
                    <div v-else style="max-width: 100%">
                        <p v-if="column.dataType === 'number' || column.dataType === 'text' || column.dataType === 'paragraph'" style="word-wrap:break-word">{{ currentRow[column.id] }}</p>
                        <n-tag v-if="column.dataType === 'tag'" :color="column.valuePreset === 'none' ? undefined : column.valuePreset[currentRow[column.id] as string]">
                            {{ currentRow[column.id] }}
                        </n-tag>
                        <n-tag v-if="column.dataType === 'bool'" :type="currentRow[column.id] ? 'success' : 'error'">
                            {{ currentRow[column.id] }}
                            <template #icon>
                                <svg-icon type="mdi" :path="currentRow[column.id] ? mdiCheckCircle : mdiCloseCircle"/>
                            </template>
                        </n-tag>
                    </div>
                </n-flex>
            </n-flex>
        </n-flex>
        <n-divider v-if="editMode"/>
        <n-flex v-if="editMode" justify="space-evenly" align="center">
            <n-button size="large" @click="cancel" style="width: 512px">{{ global.lang.getText("cancel") }}</n-button>
            <n-button size="large" :color="global.primaryColor" @click="confirm" style="width: 512px">{{ global.lang.getText("confirm") }}</n-button>
        </n-flex>
    </div>
</template>

<style lang="css" scoped>
#backImg::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: var(--img-url);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    opacity: 0.5;
    filter: blur(32px);
    overflow: hidden;
    transform: scale(1.1);
}
</style>

<script setup lang="ts">
import type { ComputedRef } from "vue"
import type { Column, DataRow } from "../types/dataTypes"
import { NFlex, NCard, NImage, NInput, NInputNumber, NSelect, NTag, NPopover, NButton, NDivider, useDialog } from "naive-ui"
import SvgIcon from "@jamescoyle/vue-icon"
import { mdiChevronLeft, mdiImageBrokenVariant, mdiCheckCircle, mdiCloseCircle, mdiPencil, mdiDelete } from "@mdi/js"
import { computed, ref, toRaw } from "vue"
import ColoredSwitch from "./ColoredSwitch.vue"
import global from "../plugins/global"

const dialog = useDialog()

const editMode = ref(false)
const primaryRowPointer = computed(() => global.selectedRow.primary === null ? null : global.databaseData!.tableData[global.selectedRow.primary])
const childRowPointer = computed(() => global.databaseData!.dualTable ? primaryRowPointer.value![global.databaseData!.gridView ? 2 : 1] : null)
const currentRow = computed(() => {
    if(global.page === "newRow") {
        const newRow: DataRow = { 0: 0 }
        if(global.isChildTable) {
            for(const column of global.databaseData!.table2Info) {
                newRow[column.id] = null
            }
            newRow[0] = JSON.parse(childRowPointer.value as string).length + 1
        } else {
            for(const column of global.databaseData!.table1Info) {
                newRow[column.id] = null
            }
            newRow[0] = global.databaseData!.tableData.length + 1
            if(global.databaseData!.dualTable) {
                newRow[global.databaseData!.gridView ? 2 : 1] = "[]"
            }
        }
        editMode.value = true
        return newRow
    } else if(global.selectedRow.child === null) {
        return toRaw(primaryRowPointer.value)
    } else {
        return JSON.parse(childRowPointer.value as string)[global.selectedRow.child]
    }
})

const newRowDef = ref(structuredClone(toRaw(currentRow.value)))
function resetEdit() {
    newRowDef.value = structuredClone(toRaw(currentRow.value))
    editMode.value = true
}
function tagOptions(column: Column) {
    const option = []
    if(column.valuePreset !== 'none') {
        for(const key in column.valuePreset) {
            option.push({ label: column.valuePreset[key].title[global.lang.currentLang], value: key })
        }
    }
    return option
}

function back() {
    if(global.databaseData!.dualTable && !global.isChildTable) {
        global.isChildTable = true
    }
    global.page = "contents"
}
function cancel() {
    editMode.value = false
    if(global.page === "newRow") {
        global.page = "contents"
    }
}
function confirm() {
    if(global.page === "newRow") {
        if(global.isChildTable) {
            const tmpChild = JSON.parse(childRowPointer.value as string)
            tmpChild.push(toRaw(newRowDef.value))
            primaryRowPointer.value![global.databaseData!.gridView ? 2 : 1] = JSON.stringify(tmpChild)
            global.selectedRow.child = newRowDef.value[0] - 1
        } else {
            global.databaseData!.tableData.push(structuredClone(toRaw(newRowDef.value)))
            global.selectedRow.primary = newRowDef.value[0] - 1
        }
        global.page = "contents"
    } else {
        if(global.isChildTable) {
            const tmpChild = JSON.parse(childRowPointer.value as string)
            tmpChild[global.selectedRow.child as number] = toRaw(newRowDef.value)
            primaryRowPointer.value![global.databaseData!.gridView ? 2 : 1] = JSON.stringify(tmpChild)
        } else {
            global.databaseData!.tableData[global.selectedRow.primary as number] = structuredClone(toRaw(newRowDef.value))
        }
    }
    editMode.value = false
    global.databaseSaved = false
}
function handleDelete() {
    dialog.warning({
        title: global.lang.getText("warning"),
        content: `${global.lang.getText("deleteConfirm1")} ${global.lang.getText("column")}: ${currentRow.value[0]} ${global.lang.getText("deleteConfirm2")}`,
        positiveText: global.lang.getText("confirm"),
        negativeText: global.lang.getText("cancel"),
        closable: false,
        maskClosable: false,
        onPositiveClick: () => {
            if(global.isChildTable) {
                const tmpChild = JSON.parse(childRowPointer.value as string)
                tmpChild.splice(global.selectedRow.child, 1)
                for(let i = global.selectedRow.child as number; i < tmpChild.length; i++) {
                    tmpChild[i][0] = i + 1
                }
                primaryRowPointer.value![global.databaseData!.gridView ? 2 : 1] = JSON.stringify(tmpChild)
                global.selectedRow.child = null
            } else {
                global.databaseData!.tableData.splice(global.selectedRow.primary as number, 1)
                for(let i = global.selectedRow.primary as number; i < global.databaseData!.tableData.length; i++) {
                    global.databaseData!.tableData[i][0] = i + 1
                }
                global.selectedRow.primary = null
            }
            global.page = "contents"
        }
    })
}

const img = computed(() => {
    let image = undefined
    try {
        if(global.databaseData!.gridView) {
            if(global.databaseData!.dualTable && !global.isChildTable) {
                image = JSON.parse(childRowPointer.value as string)[currentRow.value[1] as number][1]
            } else {
                image = currentRow.value[1]
            }
        } else {
            return undefined
        }
    } catch(error) {
        return "Error Image"
    }
    if(image === null || image === undefined || typeof image !== "string" || image === "") {
        return "Error Image"
    } else {
        return image
    }
    // return "https://rimage.gnst.jp/livejapan.com/public/article/detail/a/00/00/a0000276/img/basic/a0000276_main.jpg"
}) as ComputedRef<string | undefined>
const imgSize = computed(() => {
    let size = [200, 300]
    switch(global.gridSize) {
        case "large":
            size = [400, 600]
            break
        case "small":
            size = [100, 150]
            break
    }
    return size
})
</script>