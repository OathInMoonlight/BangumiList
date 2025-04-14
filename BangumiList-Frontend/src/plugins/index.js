/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import { ref, reactive } from 'vue'
import vuetify from './vuetify'
// import router from '@/router'
import Lang from '@/plugins/lang.js'
import viewOpt from '@/plugins/view.js'

export function registerPlugins (app) {
  app
    .use(vuetify)
    // .use(router)

  app.config.globalProperties.$lang = reactive(new Lang())
  //绑定changeLang方法到$lang
  app.config.globalProperties.$lang.changeLang = app.config.globalProperties.$lang.changeLang.bind(app.config.globalProperties.$lang)
  app.config.globalProperties.$primaryColor = ref("blue")
  app.config.globalProperties.$isDatabase = ref(false)
  app.config.globalProperties.$viewOpt = reactive(viewOpt)
}