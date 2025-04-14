<template>
    <v-toolbar density="comfortable">
        <div class="w-100 d-flex flex-row justify-space-between align-center">
            <div class="d-flex align-center ml-4">
                <label v-if="!$isDatabase.value" class="text-h6">{{ $lang.text.databaseList }}</label>
                <v-tooltip v-else :text="$lang.text.backToList">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" variant="outlined">{{ $isDatabase }}</v-btn>
                    </template>
                </v-tooltip>
            </div>
            <div class="d-flex align-center mr-2">
                <v-tooltip :text="$lang.text.plus">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" icon="mdi-plus"/>
                    </template>
                </v-tooltip>
                <v-tooltip :text="$lang.text.import">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" icon="mdi-import"/>
                    </template>
                </v-tooltip>
                <v-tooltip :text="$lang.text.export">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" icon="mdi-export"/>
                    </template>
                </v-tooltip>
                <v-tooltip :text="$lang.text.delete">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" icon="mdi-delete"/>
                    </template>
                </v-tooltip>
                <v-tooltip :text="$lang.text.edit">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" icon="mdi-square-edit-outline"/>
                    </template>
                </v-tooltip>
            </div>
        </div>
    </v-toolbar>
</template>

<script setup>

</script>