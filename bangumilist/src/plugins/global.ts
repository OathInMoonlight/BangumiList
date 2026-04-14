import type { Global } from "../types/types"
import { reactive } from "vue"
import languages from "./languages"

const global: Global = reactive({
    lang: languages,
    settingPage: false,
    globalZoom: 1,
    darkMode: null,
    primaryColor: "#2196F3",

    databaseLoaded: false,
    databaseSaved: true,
    databaseData: null,
    isChildTable: false,

    contentsType: "table",
    gridSize: "default",
    filterText: ""
})

export default global