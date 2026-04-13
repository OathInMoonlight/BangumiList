<template>
    <n-flex vertical>
        <n-card embedded content-style="padding: 4px">
            <n-flex justify="space-between" align="center">
                <n-flex align="center" size="small">
                    <n-popover placement="bottom">
                        <template #trigger>
                            <n-button quaternary circle size="large">
                                <template #icon>
                                    <svg-icon type="mdi" :path="mdiPlus"/>
                                </template>
                            </n-button>
                        </template>
                        {{ global.lang.getText("plus") }}
                    </n-popover>
                    <n-popover placement="bottom">
                        <template #trigger>
                            <n-button quaternary circle size="large">
                                <template #icon>
                                    <svg-icon type="mdi" :path="mdiImport"/>
                                </template>
                            </n-button>
                        </template>
                        {{ global.lang.getText("import") }}
                    </n-popover>
                    <n-popover placement="bottom">
                        <template #trigger>
                            <n-button quaternary circle size="large">
                                <template #icon>
                                    <svg-icon type="mdi" :path="mdiPencil"/>
                                </template>
                            </n-button>
                        </template>
                        {{ global.lang.getText("edit") }}
                    </n-popover>
                    <n-popover placement="bottom">
                        <template #trigger>
                            <n-button quaternary circle size="large">
                                <template #icon>
                                    <svg-icon type="mdi" :path="mdiExport"/>
                                </template>
                            </n-button>
                        </template>
                        {{ global.lang.getText("export") }}
                    </n-popover>
                    <n-popover placement="bottom">
                        <template #trigger>
                            <n-button quaternary circle size="large">
                                <template #icon>
                                    <svg-icon type="mdi" :path="mdiDelete"/>
                                </template>
                            </n-button>
                        </template>
                        {{ global.lang.getText("delete") }}
                    </n-popover>
                </n-flex>
                <n-flex align="center" size="small">
                    <n-select :placeholder="global.lang.getText('groupSortBy')" style="width: 192px">
                        <template #empty>
                            <n-empty :description="global.lang.getText('noData')"/>
                        </template>
                    </n-select>
                    <n-select v-if="global.contentsType === 'grid'" :placeholder="global.lang.getText('sortBy')" style="width: 192px">
                        <template #empty>
                            <n-empty :description="global.lang.getText('noData')"/>
                        </template>
                    </n-select>
                    <button-group v-if="global.contentsType === 'grid'" v-model="global.gridSize" :items="[
                        { icon: mdiSquare, tooltip: 'gridLarge', value: 'large' },
                        { icon: mdiViewGrid, tooltip: 'gridDefault', value: 'default' },
                        { icon: mdiApps, tooltip: 'gridSmall', value: 'small' }
                    ]"/>
                    <n-popselect v-if="global.contentsType === 'table'" multiple scrollable width="trigger">
                        <n-select :placeholder="global.lang.getText('tableDisplayItems')" :show="false" style="width: 192px"/>
                        <template #empty>
                            <n-empty :description="global.lang.getText('noData')"/>
                        </template>
                    </n-popselect>
                    <button-group v-model="global.contentsType" :items="[
                        { icon: mdiViewGrid, tooltip: 'gridView', value: 'grid' },
                        { icon: mdiViewList, tooltip: 'tableView', value: 'table' },
                        { icon: mdiChartLine, tooltip: 'statisticView', value: 'statistic' }
                    ]"/>
                </n-flex>
            </n-flex>
        </n-card>
        <n-flex justify="center" align="center">
            <n-input v-model:value="global.filterText" :placeholder="global.lang.getText('search')" clearable style="width: 512px">
                <template #suffix>
                    <svg-icon type="mdi" :path="mdiMagnify"/>
                </template>
            </n-input>
        </n-flex>
    </n-flex>
</template>

<script setup lang="ts">
import { NFlex, NCard, NPopover, NButton, NPopselect, NSelect, NEmpty, NInput } from "naive-ui"
import SvgIcon from "@jamescoyle/vue-icon"
import { mdiPlus, mdiImport, mdiPencil, mdiExport, mdiDelete, mdiViewGrid, mdiViewList, mdiChartLine, mdiApps, mdiSquare, mdiMagnify } from "@mdi/js"
import global from "../plugins/global"
import ButtonGroup from "./ButtonGroup.vue"
</script>