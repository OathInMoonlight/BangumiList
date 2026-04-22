<template>
    <n-switch v-model:value="model" :round="false" :rail-style="switchStyle" :disabled="props.disabled">
        <template #checked>
            {{ props.checkedLabel }}
        </template>
        <template #unchecked>
            {{ props.uncheckedLabel }}
        </template>
    </n-switch>
</template>

<script setup lang="ts">
import { NSwitch } from "naive-ui"
import { CSSProperties } from "vue"
import global from "../plugins/global"

const props = defineProps<{
    checkedLabel: string,
    uncheckedLabel: string,
    disabled?: boolean
}>()

const model = defineModel<boolean>()

function switchStyle({ focused, checked }: { focused: boolean, checked: boolean }) {
  const style: CSSProperties = {}
  if (checked) {
    style.background = global.primaryColor
    if (focused) {
      style.boxShadow = '0 0 0 2px #d0305040'
    }
  }
  return style
}
</script>