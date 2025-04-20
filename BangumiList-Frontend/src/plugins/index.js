/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import { ref, reactive } from 'vue'
import vuetify from './vuetify'
// import router from '@/router'
import lang from '@/plugins/lang.js'
import http from '@/plugins/http.js'
import databaseList from '@/plugins/databaseList.js'
import viewOpt from '@/plugins/view.js'

export function registerPlugins (app) {
  app
    .use(vuetify)
    // .use(router)

  app.config.globalProperties.$lang = reactive(lang)
  app.config.globalProperties.$primaryColor = ref("blue")
  app.config.globalProperties.$isDatabase = ref(false)
  app.config.globalProperties.$communicationTool = http
  app.config.globalProperties.$tableData = reactive(databaseList)
  app.config.globalProperties.$viewOpt = reactive(viewOpt)
}