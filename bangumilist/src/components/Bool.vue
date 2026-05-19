<template>
    <n-icon v-if="icon !== null" :color="color">
        <svg-icon v-if="icon !== undefined" type="mdi" :path="icon"/>
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

const icon = computed(() => {
    if(props.valuePreset !== "none" && ((props.valuePreset.hasOwnProperty("true") && props.valuePreset["true"].hasOwnProperty("icon"))
        || (props.valuePreset.hasOwnProperty("false") && props.valuePreset["false"].hasOwnProperty("icon")))) {
        const value = props.value === "true" ? "true" : "false"
        if(props.valuePreset.hasOwnProperty(value)) {
            return props.valuePreset[value].icon
        } else {
            return undefined
        }
    }
    return null
})

const title = computed(() => {
    const value = props.value === "true" ? "true" : "false"
    if(props.valuePreset !== "none" && props.valuePreset.hasOwnProperty(value) && props.valuePreset[value].hasOwnProperty("title")) {
        return props.valuePreset[value].title![global.lang.currentLang]
    }
    return props.value === "true" ? global.lang.getText("true") : global.lang.getText("false")
})

const color = computed(() => {
    const value = props.value === "true" ? "true" : "false"
    if(props.valuePreset !== "none" && props.valuePreset.hasOwnProperty(value) && props.valuePreset[value].hasOwnProperty("color")) {
        return props.valuePreset[value].color
    }
    return undefined
})
</script>