/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import { ref, reactive } from 'vue'
import vuetify from './vuetify'
// import router from '@/router'

export function registerPlugins (app) {
  app
    .use(vuetify)
    // .use(router)
}