<template>
    <v-card rounded="0" class="d-flex justify-space-between align-center pa-2">
        <!-- 搜索框 -->
        <v-responsive max-width="344">
            <v-text-field variant="solo-filled" density="compact"
                :label="global.lang.text.search[global.lang.currentLang]" clearable single-line hide-details
                v-model="global.tableData.filterText">
                <template v-slot:prepend-inner>
                    <v-icon icon="mdi-magnify" size="24" />
                </template>
            </v-text-field>
        </v-responsive>

        <div class="d-flex flex-row-reverse justify-space-between align-center">
            <!-- 视图切换 -->
            <v-btn-toggle v-if="global.tableData.gridView == true" density="compact" :color="global.primaryColor.value"
                mandatory v-model="global.viewOpt.viewType" class="ml-2">
                <v-tooltip :text="global.lang.text.gridView[global.lang.currentLang]">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" value="grid" size="36">
                            <v-icon icon="mdi-view-grid" size="24" />
                        </v-btn>
                    </template>
                </v-tooltip>
                <v-tooltip :text="global.lang.text.listView[global.lang.currentLang]">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" value="list" size="36">
                            <v-icon icon="mdi-view-list" size="28" />
                        </v-btn>
                    </template>
                </v-tooltip>
            </v-btn-toggle>

            <!-- 列表显示项 -->
            <v-select v-if="(global.viewOpt.viewType === 'list')" variant="solo-filled" density="compact" width="192"
                :placeholder="global.lang.text.listShowItems[global.lang.currentLang]"
                :no-data-text="global.lang.text.noData[global.lang.currentLang]" hide-details multiple
                :items="tableHeaderList" v-model="global.viewOpt.listShowItems" class="ml-2">
                <template v-slot:selection="{ index }">
                    <label v-if="index < 1">{{ global.lang.text.listShowItems[global.lang.currentLang] }}</label>
                </template>
            </v-select>

            <div v-if="(global.viewOpt.viewType === 'grid')"
                class="d-flex flex-row-reverse justify-space-between align-center">
                <!-- 网格大小 -->
                <v-btn-toggle density="compact" :color="global.primaryColor.value" mandatory divided
                    v-model="global.viewOpt.gridSize" class="ml-2">
                    <v-tooltip :text="global.lang.text.gridLarge[global.lang.currentLang]">
                        <template v-slot:activator="{ props }">
                            <v-btn v-bind="props" value="large" size="36">
                                <v-icon icon="mdi-square" size="20" />
                            </v-btn>
                        </template>
                    </v-tooltip>
                    <v-tooltip :text="global.lang.text.gridDefault[global.lang.currentLang]">
                        <template v-slot:activator="{ props }">
                            <v-btn v-bind="props" value="default" size="36">
                                <v-icon icon="mdi-view-grid" size="22" />
                            </v-btn>
                        </template>
                    </v-tooltip>
                    <v-tooltip :text="global.lang.text.gridSmall[global.lang.currentLang]">
                        <template v-slot:activator="{ props }">
                            <v-btn v-bind="props" value="small" size="36">
                                <v-icon icon="mdi-apps" size="24" />
                            </v-btn>
                        </template>
                    </v-tooltip>
                </v-btn-toggle>

                <!-- 排序 -->
                <v-select variant="solo-filled" :label="global.lang.text.sortBy[global.lang.currentLang]"
                    density="compact" width="192" :no-data-text="global.lang.text.noData[global.lang.currentLang]"
                    hide-details class="ml-2" />
            </div>
            <!-- 分组 -->
            <v-select variant="solo-filled" :label="global.lang.text.groupSortBy[global.lang.currentLang]"
                density="compact" :no-data-text="global.lang.text.noData[global.lang.currentLang]" width="192"
                hide-details :items="groupList" v-model="global.viewOpt.groupSortBy">
                <template v-slot:selection="{ item }">
                    <v-icon v-if="item.value.includes('asc')" icon="mdi-arrow-up" size="small" />
                    <v-icon v-else-if="item.value.includes('desc')" icon="mdi-arrow-down" size="small" />
                    <label class="text-no-wrap">{{ item.title }}</label>
                </template>
                <template v-slot:item="{ item, props }">
                    <v-list-item v-bind="props" title="">
                        <v-icon v-if="item.value.includes('asc')" icon="mdi-arrow-up" size="small" />
                        <v-icon v-else-if="item.value.includes('desc')" icon="mdi-arrow-down" size="small" />
                        <label class="text-no-wrap">{{ item.title }}</label>
                    </v-list-item>
                </template>
            </v-select>
        </div>
    </v-card>
</template>

<script setup>
import global from '@/plugins/global'
import { computed, watch } from 'vue';
import { GoToSymbol } from 'vuetify/lib/composables/goto.mjs';

// 显示列
const tableHeaderList = computed(() => { // 获取所有列
    const headerList = []
    global.tableData.keys.forEach(key => {
        headerList.push({ title: global.tableData.text[key][global.lang.currentLang], value: key })
    })
    return headerList
})
for (var key in global.tableData.shownColumns) { // 默认所有列显示
    if (global.tableData.shownColumns[key] == true) {
        global.viewOpt.listShowItems.push(key)
    }
}
watch(() => global.viewOpt.listShowItems, (newListShowItems) => { // 监听显示列变化
    for (var key in global.tableData.shownColumns) {
        global.tableData.shownColumns[key] = false
    }
    newListShowItems.forEach((item) => {
        global.tableData.shownColumns[item] = true
    })
})

// 分组
const groupList = computed(() => {
    const groupList = []
    groupList.push({ title: global.lang.text.noGroup[global.lang.currentLang], value: "none" })
    for (var key in global.tableData.group) {
        if (global.tableData.group[key] != "none") {
            groupList.push({ title: global.tableData.text[key][global.lang.currentLang], value: key + "-asc" })
            groupList.push({ title: global.tableData.text[key][global.lang.currentLang], value: key + "-desc" })
        }
    }
    return groupList
})
</script>