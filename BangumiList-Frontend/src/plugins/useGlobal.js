import { getCurrentInstance } from 'vue'

export function useLang() {
  return getCurrentInstance().appContext.config.globalProperties.$lang
}

export function useHttp() {
  return getCurrentInstance().appContext.config.globalProperties.$communicationTool
}

export function useTableData() {
  return getCurrentInstance().appContext.config.globalProperties.$tableData
}