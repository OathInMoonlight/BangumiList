<template>
    <n-flex justify="center" align="center" style="height: 100%">
        <n-upload directory-dnd style="width: 768px">
            <n-upload-dragger style="height: 256px">
                <n-flex vertical justify="space-evenly" align="center" style="height: 100%">
                    <svg-icon type="mdi" :path="mdiFileUpload" :size="64"/>
                    <h2 style="margin: 0">{{ global.lang.getText('openDatabase') }}</h2>
                </n-flex>
            </n-upload-dragger>
        </n-upload>
    </n-flex>
</template>

<script setup lang="ts">
import { NFlex, NUpload, NUploadDragger } from "naive-ui"
import SvgIcon from "@jamescoyle/vue-icon"
import { mdiFileUpload } from "@mdi/js"
import global from "../plugins/global";
</script>