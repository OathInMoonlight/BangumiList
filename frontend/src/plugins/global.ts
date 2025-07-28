import { ref, reactive } from "vue"
import languages from "@/plugins/languages"
import mainData from "@/plugins/mainData"
import userData from "@/plugins/userData"
import http from "@/plugins/http"
import type { Languages, DynamicDBData, Http } from "@/plugins/types"
import type { Ref } from "vue"

interface VisionOptions {
    elementSize: "small" | "default" | "large",
    primaryColor: string,
    contentsType: "grid" | "table",
    sortColumn: number | null,
    sortOrder: "asc" | "desc",
    groupSortColumn: number | null,
    groupSortOrder: "asc" | "desc"
}

interface Global {
    lang: Languages,
    view: VisionOptions,

    isMain: Ref<boolean, boolean>,
    mainData: DynamicDBData,
    userData: DynamicDBData,

    trans: Http
}

const global: Global = {
    lang: reactive(languages),
    view: reactive({
        elementSize: "default",
        primaryColor: "blue",
        contentsType: "grid",
        sortColumn: null,
        sortOrder: "asc",
        groupSortColumn: null,
        groupSortOrder: "asc"
    }),

    isMain: ref(true),
    mainData: reactive(mainData),
    userData: reactive(userData),

    trans: reactive(http)
}

export default global