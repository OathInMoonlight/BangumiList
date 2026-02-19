<template>
    <div class="d-flex flex-row align-center ga-2 mt-2">
        <label>{{ global.lang.getText("column") }} {{ colIndex }}:</label>
        <v-container>
            <v-row>
                <v-col>
                    <v-text-field v-model="localModels.key" variant="outlined" hide-details
                                  :label="global.lang.getText('columnKey')" :disabled="!isEditable[0]" />
                </v-col>
                <v-col>
                    <v-text-field v-model="localModels.text.zh" variant="outlined" hide-details
                                  :label="global.lang.getText('columnNameZH')" :disabled="!isEditable[4]" />
                </v-col>
                <v-col>
                    <v-select v-model="localModels.textAlign" variant="outlined" hide-details
                              :label="global.lang.getText('leftAlign')" :disabled="!isEditable[5]"
                              :items="selections[1]" />
                </v-col>
                <v-col>
                    <v-combobox v-model="frameColorValue" variant="outlined" hide-details
                                :label="global.lang.getText('columnFrameColor')"
                                :disabled="localModels.displayType !== 'text'"
                                :items="[ { title: global.lang.getText('noFrameColor'), value: null } ]" />
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-select v-model="localModels.dataType" variant="outlined" hide-details
                              :label="global.lang.getText('columnType')" :disabled="!isEditable[1]"
                              :items="selections[0]" />
                </v-col>
                <v-col>
                    <v-text-field v-model="localModels.text.ja" variant="outlined" hide-details
                                  :label="global.lang.getText('columnNameJA')" :disabled="!isEditable[4]" />
                </v-col>
                <v-col>
                    <v-select v-model="localModels.widthType" variant="outlined" hide-details
                              :label="global.lang.getText('columnWidthType')" :disabled="!isEditable[6]"
                              :items="selections[2]" />
                </v-col>
                <v-col>
                    <v-combobox v-model="groupTypeValue" variant="outlined" hide-details
                                :label="global.lang.getText('columnGroupType')" :disabled="!isEditable[8]"
                                :items="[ { title: global.lang.getText('noGroup'), value: null },
                                          { title: global.lang.getText('alphabet'), value: 'alphabet' } ]" />
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-number-input v-model="localModels.sortMap" variant="outlined" hide-details
                                    :label="global.lang.getText('columnSortMap')" :disabled="!isEditable[2]"
                                    control-variant="split" :min="-1" :max="maxIndex" />
                </v-col>
                <v-col>
                    <v-text-field v-model="localModels.text.en" variant="outlined" hide-details
                                  :label="global.lang.getText('columnNameEN')" :disabled="!isEditable[4]" />
                </v-col>
                <v-col>
                    <v-select v-model="localModels.displayType" variant="outlined" hide-details
                              :label="global.lang.getText('columnDisplayType')" :disabled="!isEditable[7]"
                              :items="selections[3]" />
                </v-col>
                <v-col>
                    <v-number-input v-model="localModels.displayIndex" variant="outlined" hide-details
                                    :label="global.lang.getText('columnDisplayIndex')" :disabled="!isEditable[9]"
                                    control-variant="split" :min="-1" :max="maxIndex" />
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script setup lang="ts">
import type { Column } from "@/plugins/transportTypes"
import { ref, watch } from "vue"
import global from "@/plugins/global"

const props = defineProps<{
    colIndex: number,
    isEditable: boolean[],
    maxIndex: number,
    selections: { title: string, value: string }[][]
}>()
const localModels = defineModel<Column>({ default: {
    id: props.colIndex,
    key: "",
    dataType: "TEXT NOT NULL",
    sortMap: props.colIndex,
    text: { zh: "", ja: "", en: "" },
    textAlign: "center",
    widthType: "tight",
    displayType: "text",
    frameColor: null,
    groupType: null,
    displayIndex: props.colIndex
} })

const frameColorValue = ref(null)
watch(frameColorValue, (newFrameColorValue) => {
    localModels.value.frameColor = newFrameColorValue === null ? null : JSON.parse(newFrameColorValue)
})
const groupTypeValue = ref(null)
watch(groupTypeValue, (newGroupTypeValue) => {
    localModels.value.groupType = newGroupTypeValue === null ? null :
        (newGroupTypeValue === "alphabet" ? "alphabet" : JSON.parse(newGroupTypeValue))
})
</script>