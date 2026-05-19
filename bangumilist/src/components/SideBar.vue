<template>
    <n-card embedded style="height: 100%" content-style="padding: 0">
        <n-flex vertical justify="space-between" style="height:100%">
            <n-flex vertical align="center">
                <n-popover placement="right">
                    <template #trigger>
                        <n-button quaternary size="large" :disabled="global.databaseLoaded" @click="global.page = 'edit'">
                            <template #icon>
                                <svg-icon type="mdi" :path="mdiDatabasePlus"/>
                            </template>
                        </n-button>
                    </template>
                    {{ global.lang.getText("newDatabase") }}
                </n-popover>
                <n-popover placement="right">
                    <template #trigger>
                        <n-button quaternary size="large" :disabled="!global.databaseLoaded" @click="global.page = 'edit'">
                            <template #icon>
                                <svg-icon type="mdi" :path="mdiDatabaseCog"/>
                            </template>
                        </n-button>
                    </template>
                    {{ global.lang.getText("editDatabase") }}
                </n-popover>
                <n-popover placement="right">
                    <template #trigger>
                        <n-button quaternary size="large" :disabled="!global.databaseLoaded || global.databaseSaved" @click="handleDatabaseSave(global.databaseData!.path === '')">
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
    <n-modal v-model:show="saveModal" :trap-focus="false" :close-on-esc="false" :mask-closable="false">
        <n-flex vertical justify="center" align="center">
            {{ global.lang.getText("saving") }}
            <n-spin size="large"/>
        </n-flex>
    </n-modal>
</template>

<script setup lang="ts">
import { save } from "@tauri-apps/plugin-dialog"
import { invoke } from "@tauri-apps/api/core"
import { NButton, NFlex, NCard, NPopover, NPopselect, useDialog, useMessage, NModal, NSpin } from "naive-ui"
import SvgIcon from "@jamescoyle/vue-icon"
import { mdiCog, mdiTranslate, mdiDatabasePlus, mdiContentSave, mdiContentSavePlus, mdiDatabaseRemove, mdiDatabaseCog } from "@mdi/js"
import { ref } from "vue"
import global from "../plugins/global"

const dialog = useDialog()
const message = useMessage()

const saveModal = ref(false)

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
    saveModal.value = true
    try {
        await invoke("write_db", { dbData: {
            path: global.databaseData!.path,
            gridView: global.databaseData!.gridView,
            dualTable: global.databaseData!.dualTable,
            table1Label: global.databaseData!.table1Label,
            table2Label: global.databaseData!.table2Label,
            table1Title: JSON.stringify(global.databaseData!.table1Title),
            table2Title: JSON.stringify(global.databaseData!.table2Title),
            table1Info: global.databaseData!.table1Info.map(column => ({
                ...column, title: JSON.stringify(column.title), groupType: JSON.stringify(column.groupType), valuePreset: JSON.stringify(column.valuePreset)
            })),
            table2Info: global.databaseData!.table2Info.map(column => ({
                ...column, title: JSON.stringify(column.title), groupType: JSON.stringify(column.groupType), valuePreset: JSON.stringify(column.valuePreset)
            })),
            tableData: global.databaseData!.tableData,
            sort1: JSON.stringify(global.databaseData!.sort1),
            sort2: JSON.stringify(global.databaseData!.sort2),
            groupSort1: JSON.stringify(global.databaseData!.groupSort1),
            groupSort2: JSON.stringify(global.databaseData!.groupSort2)
        }})
        saveModal.value = false
        message.success(global.lang.getText("saveSuccess"))
        global.databaseSaved = true
    } catch(error) {
        saveModal.value = false
        global.errorDialog(dialog, error)
    }
}

function handleDataBaseClose() {
    const close = () => {
        global.databaseData = null
        global.databaseLoaded = false
        global.page = "open"
        global.databaseSaved = true
        global.isChildTable = false
        global.contentsType = "table"
    }
    if(!global.databaseSaved) {
        dialog.warning({
            title: global.lang.getText("warning"),
            content: global.lang.getText("closeNotSaved"),
            positiveText: global.lang.getText("confirm"),
            negativeText: global.lang.getText("closeWithoutSaving"),
            closable: false,
            maskClosable: false,
            onNegativeClick: close
        })
    } else {
        close()
    }
}
</script>