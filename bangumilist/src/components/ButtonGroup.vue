<template>
    <n-button-group>
        <n-popover v-for="button in props.items" placement="bottom">
            <template #trigger>
                <n-button :color="model === button.value ? global.primaryColor : undefined" :disabled="button.disabled === true" @click="model = button.value">
                    <template #icon>
                        <svg-icon type="mdi" :path="button.icon"/>
                    </template>
                </n-button>
            </template>
            {{ global.lang.getText(button.tooltip) }}
        </n-popover>
    </n-button-group>
</template>

<script setup lang="ts">
import { NButtonGroup, NPopover, NButton } from "naive-ui"
import SvgIcon from "@jamescoyle/vue-icon"
import global from "../plugins/global"

const props = defineProps<{
    items: {
        icon: string,
        tooltip: string,
        disabled?: boolean,
        value: string
    }[]
}>()
const model = defineModel()
</script>