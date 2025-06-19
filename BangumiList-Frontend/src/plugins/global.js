import { ref, reactive } from "vue"
import lang from "@/plugins/lang.js"
import viewOpt from "@/plugins/view.js"
import mainTable from "@/plugins/mainTable.js"
import userTable from "@/plugins/userTable.js"
import http from "@/plugins/http.js"

export default {
    lang: reactive(lang),
    primaryColor: ref("blue"),
  
    isMain: ref(true),
    viewOpt: reactive(viewOpt),

    isTableReady: ref(false),
    tableData: reactive(mainTable),
    comTool: http
}