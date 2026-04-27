<template>
    <n-button secondary size="small" color="red" @click="handleWindowClose">
        <template #icon>
        <svg-icon type="mdi" :path="mdiClose"/>
        </template>
    </n-button>
</template>

<script setup lang="ts">
import { NButton, useDialog } from "naive-ui"
import SvgIcon from "@jamescoyle/vue-icon"
import { mdiClose } from "@mdi/js"
import global from "../plugins/global"

const props = defineProps<{
    close: () => void
}>()

const dialog = useDialog()

function handleWindowClose() {
  if(global.databaseLoaded && !global.databaseSaved) {
    dialog.warning({
      title: global.lang.getText("warning"),
      content: global.lang.getText("closeNotSaved"),
      positiveText: global.lang.getText("confirm"),
      negativeText: global.lang.getText("closeWithoutSaving"),
      closable: false,
      maskClosable: false,
      onNegativeClick: () => {
        props.close()
      }
    })
  } else {
    props.close()
  }
}
</script>