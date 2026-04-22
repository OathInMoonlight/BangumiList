<template>
    <n-flex style="margin: 6px 12px" @mouseover="ifHover = true" @mouseleave="ifHover = false">
        <n-flex vertical justify="center">
            <n-popover v-if="ifHover" placement="right">
                <template #trigger>
                    <n-button quaternary size="small" @click="props.moveUp" :disabled="props.disabled || props.editMode">
                        <template #icon>
                            <svg-icon type="mdi" :path="mdiChevronUp"/>
                        </template>
                    </n-button>
                </template>
                {{ global.lang.getText("moveForward") }}
            </n-popover>
            <n-popover placement="right">
                <template #trigger>
                    <n-button secondary @click="props.deleteColumn" :disabled="props.disabled">
                        <template #icon>
                            <svg-icon type="mdi" :path="mdiMinus"/>
                        </template>
                    </n-button>
                </template>
                {{ global.lang.getText("deleteColumn") }}
            </n-popover>
            <n-popover v-if="ifHover" placement="right">
                <template #trigger>
                    <n-button quaternary size="small" @click="props.moveDown" :disabled="props.disabled || props.editMode">
                        <template #icon>
                            <svg-icon type="mdi" :path="mdiChevronDown"/>
                        </template>
                    </n-button>
                </template>
                {{ global.lang.getText("moveBackward") }}
            </n-popover>
        </n-flex>
        <n-card embedded style="width: calc(100% - 58px); min-height: 104px" content-style="padding: 12px">
            <n-flex align="center" :wrap="false">
                <p style="white-space: nowrap">{{ global.lang.getText("column") }} {{ model?.id }}</p>
                <n-flex>
                    <n-input-group style="width: auto">
                        <n-input-group-label>{{ global.lang.getText("columnType") }}</n-input-group-label>
                        <n-select v-model:value="model!.dataType" :options="dataTypeOptions" :placeholder="global.lang.getText('columnType')" :disabled="props.disabled || props.editMode" style="width: 128px"/>
                    </n-input-group>
                    <n-input-group style="width: auto">
                        <n-input-group-label>{{ global.lang.getText("columnName") }}</n-input-group-label>
                        <n-input v-model:value="model!.title.zh" :placeholder="global.lang.getText('columnNameZH')" :disabled="props.disabled" style="width: 192px"/>
                        <n-input v-model:value="model!.title.ja" :placeholder="global.lang.getText('columnNameJA')" :disabled="props.disabled" style="width: 192px"/>
                        <n-input v-model:value="model!.title.en" :placeholder="global.lang.getText('columnNameEN')" :disabled="props.disabled" style="width: 192px"/>
                    </n-input-group>
                    <n-input-group style="width: auto">
                        <n-input-group-label>{{ global.lang.getText("columnSortMap") }}</n-input-group-label>
                        <n-input-number v-model:value="model!.sortMap" button-placement="both" :min="0" :max="props.sortMapMax" :disabled="props.disabled" style="width: 128px"/>
                    </n-input-group>
                    <n-input-group style="width: auto">
                        <n-input-group-label>{{ global.lang.getText("columnGroupType") }}</n-input-group-label>
                        <n-select v-model:value="model!.groupType" :options="groupTypeOptions" filterable tag :placeholder="global.lang.getText('columnGroupType')" :disabled="props.disabled" style="width: 256px"/>
                    </n-input-group>
                    <n-input-group style="width: auto">
                        <n-input-group-label>{{ global.lang.getText("columnDisplayAsLang") }}</n-input-group-label>
                        <n-select v-model:value="model!.displayLang" :options="displayLangOptions" :placeholder="global.lang.getText('columnDisplayAsLang')" :disabled="props.disabled" style="width: 192px"/>
                    </n-input-group>
                    <n-input-group style="width: auto">
                        <n-input-group-label>{{ global.lang.getText("columnFrameColor") }}</n-input-group-label>
                        <n-select v-model:value="model!.tagColor" :options="frameColorOptions" filterable tag :placeholder="global.lang.getText('columnFrameColor')" :disabled="props.disabled" style="width: 256px"/>
                    </n-input-group>
                    <n-flex align="center">
                        <colored-switch v-model="model!.ifDisplay" :checked-label="global.lang.getText('columnDisplay')" :unchecked-label="global.lang.getText('columnNotDisplay')" :disabled="props.disabled"/>
                    </n-flex>
                </n-flex>
            </n-flex>
        </n-card>
    </n-flex>
</template>

<script setup lang="ts">
import type { DataType, Column } from "../types/dataTypes"
import { NFlex, NPopover, NButton, NCard, NInputGroup, NInputGroupLabel, NSelect, NInput, NInputNumber } from "naive-ui"
import SvgIcon from "@jamescoyle/vue-icon"
import { mdiChevronUp, mdiMinus, mdiChevronDown } from "@mdi/js"
import { computed, ref } from "vue"
import global from "../plugins/global"
import ColoredSwitch from "./ColoredSwitch.vue"

const props = defineProps<{
    moveUp: () => void,
    moveDown: () => void,
    deleteColumn: () => void,
    sortMapMax: number,
    editMode?: boolean,
    disabled?: boolean
}>()

const model = defineModel<Omit<Column, "dataType" | "tagColor"> & { dataType: DataType | null, tagColor: string }>()

const ifHover = ref(false)
const dataTypeOptions = computed(() => [
    { label: global.lang.getText("bool"), value: "bool" },
    { label: global.lang.getText("tag"), value: "tag" },
    { label: global.lang.getText("number"), value: "number" },
    { label: global.lang.getText("text"), value: "text" },
    { label: global.lang.getText("paragraph"), value: "paragraph" }
])
const groupTypeOptions = computed(() => [
    { label: global.lang.getText("noGroup"), value: "none" },
    { label: global.lang.getText("alphabet"), value: "alphabet" }
])
const displayLangOptions = computed(() => [
    { label: global.lang.getText("notDisplayAsLang"), value: "none" },
    ...global.lang.langList
])
const frameColorOptions = computed(() => [
    { label: global.lang.getText("noFrameColor"), value: "none" }
])
</script>