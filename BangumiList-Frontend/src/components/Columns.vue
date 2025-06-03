<template>
    <v-text-field v-model="localModels.key" variant="outlined"
                  :label="global.lang.text.columnKey[global.lang.currentLang]" hide-details :disabled="!editable[0]" />
    <v-select v-model="localModels.dataType" variant="outlined"
              :label="global.lang.text.columnType[global.lang.currentLang]" hide-details :disabled="!editable[1]"
              :items="items[0]" />
    <v-select v-model="localModels.sortMap" variant="outlined"
              :label="global.lang.text.columnSortMap[global.lang.currentLang]" hide-details :disabled="!editable[2]"
              :items="items[1]" />
    <v-text-field v-model="localModels.text.zh" variant="outlined"
                  :label="global.lang.text.columnNameZH[global.lang.currentLang]" hide-details :disabled="!editable[3]" />
    <v-text-field v-model="localModels.text.ja" variant="outlined"
                  :label="global.lang.text.columnNameJA[global.lang.currentLang]" hide-details :disabled="!editable[4]" />
    <v-text-field v-model="localModels.text.en" variant="outlined"
                  :label="global.lang.text.columnNameEN[global.lang.currentLang]" hide-details :disabled="!editable[5]" />
    <v-select v-model="localModels.width" variant="outlined"
              :label="global.lang.text.columnWidth[global.lang.currentLang]" hide-details :disabled="!editable[6]"
              :items="items[2]" />
    <v-select v-model="localModels.defaultShow" variant="outlined"
              :label="global.lang.text.columnDefaultShow[global.lang.currentLang]" hide-details :disabled="!editable[7]"
              :items="items[3]" />
</template>

<script setup>
import global from "@/plugins/global.js"

defineProps(["editable", "items"])
const localModels = defineModel()
</script>