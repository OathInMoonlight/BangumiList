import type { Global } from "../types/types"
import { reactive } from "vue"
import languages from "./languages"

const global: Global = reactive({
    lang: languages,
    settingPage: false,
    globalZoom: 1,
    darkMode: null,
    primaryColor: "#2196F3",
    page: "open",

    databaseLoaded: false,
    databaseSaved: true,
    databaseData: null,
    isChildTable: false,

    contentslevel: "primary",
    contentsType: "table",
    gridSize: "default",
    filterText: "",

    errorDialog: (dialog, errorMessage) => {
        dialog.error({
            title: global.lang.getText("error"),
            content: String(errorMessage),
            positiveText: global.lang.getText("confirm"),
            closable: false,
        maskClosable: false
    })
}
})

export default global