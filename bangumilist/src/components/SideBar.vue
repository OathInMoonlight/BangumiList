<template>
    <n-card embedded style="height: 100%" content-style="padding: 0">
        <n-flex vertical justify="space-between" style="height:100%">
            <n-flex vertical align="center">
                <n-popover placement="right">
                    <template #trigger>
                        <n-button quaternary size="large">
                            <template #icon>
                                <svg-icon type="mdi" :path="mdiDatabasePlus"/>
                            </template>
                        </n-button>
                    </template>
                    {{ global.lang.getText("newDatabase") }}
                </n-popover>
                <n-popover placement="right">
                    <template #trigger>
                        <n-button quaternary size="large">
                            <template #icon>
                                <svg-icon type="mdi" :path="mdiDatabaseCog"/>
                            </template>
                        </n-button>
                    </template>
                    {{ global.lang.getText("editDatabase") }}
                </n-popover>
                <n-popover placement="right">
                    <template #trigger>
                        <n-button quaternary size="large">
                            <template #icon>
                                <svg-icon type="mdi" :path="mdiContentSave"/>
                            </template>
                        </n-button>
                    </template>
                    {{ global.lang.getText("saveDatabase") }}
                </n-popover>
                <n-popover placement="right">
                    <template #trigger>
                        <n-button quaternary size="large">
                            <template #icon>
                                <svg-icon type="mdi" :path="mdiContentSavePlus"/>
                            </template>
                        </n-button>
                    </template>
                    {{ global.lang.getText("saveDatabaseAs") }}
                </n-popover>
                <n-popover placement="right">
                    <template #trigger>
                        <n-button quaternary size="large" @click="handleDataBaseClose">
                            <template #icon>
                                <svg-icon type="mdi" :path="mdiDatabaseRemove"/>
                            </template>
                        </n-button>
                    </template>
                    {{ global.lang.getText("closeDatabase") }}
                </n-popover>
            </n-flex>
            <n-flex vertical justify="end" align="center" style="margin-bottom:8px">
                <n-popover placement="right">
                    <template #trigger>
                        <n-popselect v-model:value="global.lang.currentLang" :options="global.lang.langList" placement="right" size="large" trigger="click">
                            <n-button quaternary size="large">
                                <template #icon>
                                    <svg-icon type="mdi" :path="mdiTranslate"/>
                                </template>
                            </n-button>
                        </n-popselect>
                    </template>
                    {{ global.lang.getText("language") }}
                </n-popover>
                <n-popover placement="right">
                    <template #trigger>
                        <n-button quaternary size="large" @click="global.settingPage = !global.settingPage">
                            <template #icon>
                                <svg-icon type="mdi" :path="mdiCog"/>
                            </template>
                        </n-button>
                    </template>
                    {{ global.lang.getText("settings") }}
                </n-popover>
            </n-flex>
        </n-flex>
    </n-card>
</template>

<script setup lang="ts">
import { NButton, NFlex, NCard, NPopover, NPopselect, useDialog } from "naive-ui"
import SvgIcon from "@jamescoyle/vue-icon"
import { mdiCog, mdiTranslate, mdiDatabasePlus, mdiContentSave, mdiContentSavePlus, mdiDatabaseRemove, mdiDatabaseCog } from "@mdi/js"
import global from "../plugins/global"

const dialog = useDialog()

function warningDialog() {
    dialog.error({
        title: global.lang.getText("warning"),
        content: global.lang.getText("closeNotSaved"),
        positiveText: global.lang.getText("confirm"),
        closable: false,
        maskClosable: false
    })
}

function handleDataBaseClose() {
    if(global.databaseSaved) {
        global.databaseLoaded = false
    } else {
        warningDialog()
    }
}
</script>