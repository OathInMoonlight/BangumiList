<template>
    <n-flex align="center" style="margin: 8px">
        <n-tooltip placement="bottom">
            <template #trigger>
                <n-button quaternary size="large" circle @click="global.settingPage = false">
                    <template #icon>
                        <svg-icon type="mdi" :path="mdiChevronLeft"/>
                    </template>
                </n-button>
            </template>
            <label>{{ global.lang.getText("back") }}</label>
        </n-tooltip>
        <h3 style="margin: 0">{{ global.lang.getText("settings") }}</h3>
    </n-flex>
</template>

<script setup lang="ts">
import { NTooltip, NButton, NFlex } from "naive-ui"
import SvgIcon from "@jamescoyle/vue-icon"
import { mdiChevronLeft } from "@mdi/js"
import global from "../plugins/global"
</script>