<template>
    <v-dialog v-model="addTableDialog">
        <NewTableForm />
    </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import NewTableForm from "@/components/DataOperation/NewTableForm.vue"

const addTableDialog = ref(true)
</script>