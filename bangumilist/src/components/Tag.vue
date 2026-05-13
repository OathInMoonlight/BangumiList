<template>
    <n-tag v-if="typeof props.value === 'string'" :color="color">
        {{ title }}
    </n-tag>
</template>

<script setup lang="ts">
import type { ValuePresetType } from "../types/dataTypes"
import { NTag } from "naive-ui"
import { computed } from "vue"
import global from "../plugins/global";

const props = defineProps<{
    valuePreset: ValuePresetType,
    value: string | null | undefined
}>()

const title = computed(() => (props.valuePreset === "none" || typeof props.value !== "string" ||
    !props.valuePreset.hasOwnProperty(props.value) || !props.valuePreset[props.value].hasOwnProperty("title")) ?
    props.value : props.valuePreset[props.value].title![global.lang.currentLang])

const color = computed(() => {
    const colorValue = (props.valuePreset === "none" || typeof props.value !== "string" ||
        !props.valuePreset.hasOwnProperty(props.value) || !props.valuePreset[props.value].hasOwnProperty("color")) ?
        undefined : props.valuePreset[props.value].color
    return {
        color: "#00000000",
        borderColor: colorValue,
        textColor: colorValue
    }
})
</script>