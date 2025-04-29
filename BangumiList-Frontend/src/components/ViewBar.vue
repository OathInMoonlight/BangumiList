<template>
    <v-card rounded="0" class="d-flex justify-space-between align-center pa-2">
        <!-- 搜索框 -->
        <v-responsive max-width="344">
            <v-text-field variant="solo-filled" density="compact" :label="$lang.text.search[$lang.currentLang]"
                clearable single-line hide-details>
                <template v-slot:prepend-inner>
                    <v-icon icon="mdi-magnify" size="24" />
                </template>
            </v-text-field>
        </v-responsive>

        <div class="d-flex flex-row-reverse justify-space-between align-center">
            <!-- 视图切换 -->
            <v-btn-toggle density="compact" :color="$primaryColor.value" mandatory v-model="$viewOpt.viewType"
                class="ml-2">
                <v-tooltip :text="$lang.text.gridView[$lang.currentLang]">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" value="grid" size="36">
                            <v-icon icon="mdi-view-grid" size="24" />
                        </v-btn>
                    </template>
                </v-tooltip>
                <v-tooltip :text="$lang.text.listView[$lang.currentLang]">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" value="list" size="36">
                            <v-icon icon="mdi-view-list" size="28" />
                        </v-btn>
                    </template>
                </v-tooltip>
            </v-btn-toggle>

            <!-- 列表显示项 -->
            <v-select v-if="($viewOpt.viewType === 'list')" variant="solo-filled" density="compact" width="192"
                :placeholder="$lang.text.listShowItems[$lang.currentLang]"
                :no-data-text="$lang.text.noData[$lang.currentLang]" hide-details multiple
                v-model="$viewOpt.listShowItems">
                <template v-slot:selection="{ index }">
                    <label v-if="index < 1">{{ $lang.text.listShowItems }}</label>
                </template>
            </v-select>

            <div v-if="($viewOpt.viewType === 'grid')"
                class="d-flex flex-row-reverse justify-space-between align-center">
                <!-- 网格大小 -->
                <v-btn-toggle density="compact" :color="$primaryColor.value" mandatory divided
                    v-model="$viewOpt.gridSize" class="ml-2">
                    <v-tooltip :text="$lang.text.gridLarge[$lang.currentLang]">
                        <template v-slot:activator="{ props }">
                            <v-btn v-bind="props" value="large" size="36">
                                <v-icon icon="mdi-square" size="20" />
                            </v-btn>
                        </template>
                    </v-tooltip>
                    <v-tooltip :text="$lang.text.gridDefault[$lang.currentLang]">
                        <template v-slot:activator="{ props }">
                            <v-btn v-bind="props" value="default" size="36">
                                <v-icon icon="mdi-view-grid" size="22" />
                            </v-btn>
                        </template>
                    </v-tooltip>
                    <v-tooltip :text="$lang.text.gridSmall[$lang.currentLang]">
                        <template v-slot:activator="{ props }">
                            <v-btn v-bind="props" value="small" size="36">
                                <v-icon icon="mdi-apps" size="24" />
                            </v-btn>
                        </template>
                    </v-tooltip>
                </v-btn-toggle>

                <!-- 排序 -->
                <v-select variant="solo-filled" :label="$lang.text.sortBy[$lang.currentLang]" density="compact"
                    width="192" :no-data-text="$lang.text.noData[$lang.currentLang]" hide-details class="ml-2" />

                <!-- 分组 -->
                <v-select variant="solo-filled" :label="$lang.text.groupSortBy[$lang.currentLang]" density="compact"
                    :no-data-text="$lang.text.noData[$lang.currentLang]" width="192" hide-details />
            </div>
        </div>
    </v-card>
</template>

<script setup>
</script>