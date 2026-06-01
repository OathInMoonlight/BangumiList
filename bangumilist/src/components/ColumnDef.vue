<template>
    <n-flex style="margin: 6px 12px" @mouseover="ifHover = true" @mouseleave="ifHover = false">
        <n-flex vertical justify="center">
            <n-popover v-if="ifHover" placement="right">
                <template #trigger>
                    <n-button quaternary size="small" @click="props.moveUp" :disabled="model!.id <= props.indexMin || model!.id < props.userIndexMin">
                        <template #icon>
                            <svg-icon type="mdi" :path="mdiChevronUp"/>
                        </template>
                    </n-button>
                </template>
                {{ global.lang.getText("moveForward") }}
            </n-popover>
            <n-popover placement="right">
                <template #trigger>
                    <n-button secondary @click="props.deleteColumn" :disabled="model!.id < props.indexMin || model!.id < props.userIndexMin">
                        <template #icon>
                            <svg-icon type="mdi" :path="mdiMinus"/>
                        </template>
                    </n-button>
                </template>
                {{ global.lang.getText("deleteColumn") }}
            </n-popover>
            <n-popover v-if="ifHover" placement="right">
                <template #trigger>
                    <n-button quaternary size="small" @click="props.moveDown" :disabled="model!.id < props.indexMin || model!.id >= props.indexMax || model!.id < props.userIndexMin">
                        <template #icon>
                            <svg-icon type="mdi" :path="mdiChevronDown"/>
                        </template>
                    </n-button>
                </template>
                {{ global.lang.getText("moveBackward") }}
            </n-popover>
        </n-flex>
        <n-card embedded style="width: calc(100% - 58px); min-height: 106px" content-style="padding: 12px">
            <n-flex align="center" :wrap="false">
                <p style="white-space: nowrap">{{ global.lang.getText("column") }} {{ model?.id }}</p>
                <n-flex align="center">
                    <n-input-group style="width: auto">
                        <n-input-group-label>{{ global.lang.getText("columnType") }}</n-input-group-label>
                        <n-select v-model:value="model!.dataType" :options="dataTypeOptions" :placeholder="global.lang.getText('columnType')" :disabled="model!.id < props.indexMin || model!.id < props.userIndexMin" style="width: 128px"/>
                    </n-input-group>
                    <n-input-group style="width: auto">
                        <n-input-group-label>{{ global.lang.getText("columnName") }}</n-input-group-label>
                        <n-input v-model:value="model!.title.zh" :placeholder="global.lang.getText('columnNameZH')" :disabled="model!.id < props.indexMin" style="width: 192px"/>
                        <n-input v-model:value="model!.title.ja" :placeholder="global.lang.getText('columnNameJA')" :disabled="model!.id < props.indexMin" style="width: 192px"/>
                        <n-input v-model:value="model!.title.en" :placeholder="global.lang.getText('columnNameEN')" :disabled="model!.id < props.indexMin" style="width: 192px"/>
                    </n-input-group>
                    <n-input-group style="width: auto">
                        <n-input-group-label>{{ global.lang.getText("columnSortMap") }}</n-input-group-label>
                        <n-input-number v-model:value="model!.sortMap" :min="0" :max="props.indexMax" :disabled="model!.id < props.indexMin" style="width: 128px"/>
                    </n-input-group>
                    <n-input-group style="width: auto">
                        <n-input-group-label>{{ global.lang.getText("columnGroupType") }}</n-input-group-label>
                        <n-select v-model:value="model!.groupType" :options="groupTypeOptions" filterable tag clearable :placeholder="global.lang.getText('columnGroupType')" :disabled="model!.id < props.indexMin" style="width: 256px"/>
                        <n-popover placement="top">
                            <template #trigger>
                                <n-input-group-label>
                                    <n-flex align="center" style="height: 100%">
                                        <svg-icon type="mdi" :path="mdiHelpCircleOutline"/>
                                    </n-flex>
                                </n-input-group-label>
                            </template>
                            unknown[]
                        </n-popover>
                    </n-input-group>
                    <n-input-group style="width: auto">
                        <n-input-group-label>{{ global.lang.getText("columnDisplayAsLang") }}</n-input-group-label>
                        <n-select v-model:value="model!.displayLang" :options="displayLangOptions" :placeholder="global.lang.getText('columnDisplayAsLang')" :disabled="model!.id < props.indexMin" style="width: 192px"/>
                    </n-input-group>
                    <n-input-group style="width: auto">
                        <n-input-group-label>{{ global.lang.getText("columnValuePreset") }}</n-input-group-label>
                        <n-select v-model:value="model!.valuePreset" :options="valuePresetOptions" filterable tag clearable :placeholder="global.lang.getText('columnValuePreset')" :disabled="model!.id < props.indexMin" style="width: 256px"/>
                        <n-popover placement="top">
                            <template #trigger>
                                <n-input-group-label>
                                    <n-flex align="center" style="height: 100%">
                                        <svg-icon type="mdi" :path="mdiHelpCircleOutline"/>
                                    </n-flex>
                                </n-input-group-label>
                            </template>
                            {["key": string]: {"title?": {"zh": string, "ja": string, "en": string}, "color?": string, "icon?": string}}
                        </n-popover>
                    </n-input-group>
                    <n-flex align="center">
                        <colored-switch v-model="model!.ifDisplay" :checked-label="global.lang.getText('columnDisplayOn')" :unchecked-label="global.lang.getText('columnDisplayOff')"/>
                    </n-flex>
                </n-flex>
            </n-flex>
        </n-card>
    </n-flex>
</template>

<script setup lang="ts">
import type { InputColumn } from "../types/dataTypes"
import { NFlex, NPopover, NButton, NCard, NInputGroup, NInputGroupLabel, NSelect, NInput, NInputNumber } from "naive-ui"
import SvgIcon from "@jamescoyle/vue-icon"
import { mdiChevronUp, mdiMinus, mdiChevronDown, mdiHelpCircleOutline } from "@mdi/js"
import { computed, ref } from "vue"
import global from "../plugins/global"
import ColoredSwitch from "./ColoredSwitch.vue"

const props = defineProps<{
    moveUp: () => void,
    moveDown: () => void,
    deleteColumn: () => void,
    indexMin: number,
    indexMax: number,
    userIndexMin: number
}>()

const model = defineModel<InputColumn>()

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
const valuePresetOptions = computed(() => [
    { label: global.lang.getText("noValuePreset"), value: "none" }
])
</script>