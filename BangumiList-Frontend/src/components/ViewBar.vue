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
                :items="tableHeaderList" v-model="global.viewOpt.listShowItems">
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

                <!-- 分组 -->
                <v-select variant="solo-filled" :label="global.lang.text.groupSortBy[global.lang.currentLang]"
                    density="compact" :no-data-text="global.lang.text.noData[global.lang.currentLang]" width="192"
                    hide-details />
            </div>
        </div>
    </v-card>
</template>

<script setup>
import global from '@/plugins/global'
import { computed, watch } from 'vue';

// 获取所有列
const tableHeaderList = computed(() => {
    const headerList = []
    global.tableData.keys.forEach(key => {
        headerList.push({title:global.tableData.text[key][global.lang.currentLang], value:key})
    })
    return headerList
})
// 默认所有列显示
for (var key in global.tableData.shownColumns) {
    if (global.tableData.shownColumns[key] == true) {
        global.viewOpt.listShowItems.push(key)
    }
}
// 监听显示列变化
watch(() => global.viewOpt.listShowItems, (newListShowItems) => {
    for(var key in global.tableData.shownColumns){
        global.tableData.shownColumns[key] = false
    }
    newListShowItems.forEach((item) => {
        global.tableData.shownColumns[item] = true
    })
})
</script>