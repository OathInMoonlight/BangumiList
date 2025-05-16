import { ref, reactive } from "vue"
import lang from "@/plugins/lang.js"
import viewOpt from "@/plugins/view.js"
import databaseTable from "@/plugins/databaseTable.js"
import http from "@/plugins/http.js"

export default {
    lang: reactive(lang),
    primaryColor: ref("blue"),
  
    isDatabase: ref(false),
    viewOpt: reactive(viewOpt),

    tableData: reactive(databaseTable),
    comTool: http
}