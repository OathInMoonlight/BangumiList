import { getCurrentInstance } from 'vue'

export function useLang() {
  return getCurrentInstance().appContext.config.globalProperties.$lang
}