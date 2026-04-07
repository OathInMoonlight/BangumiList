import type { Global } from "../types/types"
import { reactive } from "vue"
import languages from "./languages"

const global: Global = reactive({
    lang: languages,
    globalZoom: 1,
    primaryColor: "#2196F3",
    contentsType: "table",
    gridSize: "default",
    filterText: "",
    settingPage: false
})

export default global