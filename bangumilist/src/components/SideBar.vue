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
                        <n-button quaternary size="large" :disabled="!global.databaseLoaded || global.databaseSaved" @click="handleDatabaseSave(false)">
                            <template #icon>
                                <svg-icon type="mdi" :path="mdiContentSave"/>
                            </template>
                        </n-button>
                    </template>
                    {{ global.lang.getText("saveDatabase") }}
                </n-popover>
                <n-popover placement="right">
                    <template #trigger>
                        <n-button quaternary size="large" :disabled="!global.databaseLoaded || global.databaseSaved" @click="handleDatabaseSave(true)">
                            <template #icon>
                                <svg-icon type="mdi" :path="mdiContentSavePlus"/>
                            </template>
                        </n-button>
                    </template>
                    {{ global.lang.getText("saveDatabaseAs") }}
                </n-popover>
                <n-popover placement="right">
                    <template #trigger>
                        <n-button quaternary size="large" :disabled="!global.databaseLoaded" @click="handleDataBaseClose">
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
import { save } from "@tauri-apps/plugin-dialog"
import { invoke } from "@tauri-apps/api/core"
import { NButton, NFlex, NCard, NPopover, NPopselect, useDialog, useMessage } from "naive-ui"
import SvgIcon from "@jamescoyle/vue-icon"
import { mdiCog, mdiTranslate, mdiDatabasePlus, mdiContentSave, mdiContentSavePlus, mdiDatabaseRemove, mdiDatabaseCog } from "@mdi/js"
import global from "../plugins/global"

const dialog = useDialog()
const message = useMessage()

async function handleDatabaseSave(newPath: boolean) {
    if(newPath) {
        const newPath = await save({
            title: global.lang.getText("saveDatabaseAs"),
            defaultPath: global.databaseData!.path,
            filters: [{
                name: "",
                extensions: ["db"]
            }]
        })
        if(newPath === null) {
            global.errorDialog(dialog, "Error in Getting File Path")
            return
        } else {
            global.databaseData!.path = newPath
        }
    }
    try {
        await invoke("write_db", { dbData: global.databaseData })
        message.success(global.lang.getText("saveSuccess"))
    } catch(error) {
        global.errorDialog(dialog, error)
    }
    global.databaseSaved = true
}

function handleDataBaseClose() {
    if(global.databaseSaved) {
        global.databaseLoaded = false
    } else {
        dialog.warning({
            title: global.lang.getText("warning"),
            content: global.lang.getText("closeNotSaved"),
            positiveText: global.lang.getText("confirm"),
            closable: false,
            maskClosable: false
        })
    }
}
</script>