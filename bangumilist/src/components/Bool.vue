<template>
    <n-icon v-if="props.valuePreset !== 'none' && ((props.valuePreset.hasOwnProperty('true')
        && props.valuePreset['true'].hasOwnProperty('icon')) || (props.valuePreset.hasOwnProperty('false')
        && props.valuePreset['false'].hasOwnProperty('icon')))" :color="color">
        <svg-icon type="mdi" :path="props.valuePreset[props.value === 'true' ? 'true' : 'false'].icon"/>
    </n-icon>
    <n-tag v-else :type="props.value === 'true' ? 'success' : 'error'">
        {{ title }}
        <template #icon>
            <svg-icon type="mdi" :path="props.value === 'true' ? mdiCheckCircle : mdiCloseCircle"/>
        </template>
    </n-tag>
</template>

<script setup lang="ts">
import type { ValuePresetType } from "../types/dataTypes"
import { NTag, NIcon } from "naive-ui"
import SvgIcon from "@jamescoyle/vue-icon"
import { mdiCheckCircle, mdiCloseCircle } from "@mdi/js"
import { computed } from "vue"
import global from "../plugins/global";

const props = defineProps<{
    valuePreset: ValuePresetType,
    value: string | null | undefined
}>()

const title = computed(() => {
    if(props.valuePreset !== 'none' && ((props.valuePreset.hasOwnProperty('true') && props.valuePreset['true'].hasOwnProperty('title'))
        || (props.valuePreset.hasOwnProperty('false') && props.valuePreset['false'].hasOwnProperty('title')))) {
            return props.valuePreset[props.value === 'true' ? 'true' : 'false'].title![global.lang.currentLang]
    } else if(typeof props.value === "string") {
        return props.value === "true" ? global.lang.getText("true") : global.lang.getText("false")
    }
    return global.lang.getText("false")
})

const color = computed(() => {
    if(props.valuePreset !== 'none' && ((props.valuePreset.hasOwnProperty('true') && props.valuePreset['true'].hasOwnProperty('color'))
        || (props.valuePreset.hasOwnProperty('false') && props.valuePreset['false'].hasOwnProperty('color')))) {
            return props.valuePreset[props.value === 'true' ? 'true' : 'false'].color
    }
    return undefined
})
</script>