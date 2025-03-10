/** @format */

import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { store } from '@/store'
import defaultSettings from '~/settings'
// 导入 Element Plus 中英文语言包
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import zhTw from 'element-plus/es/locale/lang/zh-tw'
//setup
export const useAppStore = defineStore('app', () => {
  // state
  // const device = useStorage('device', 'desktop')
  const size = useStorage<any>('size', defaultSettings.size)
  const language = useStorage('language', defaultSettings.language)
  /**
   * 根据语言标识读取对应的语言包
   */
  // const appState = toRefs(state)
  const locale = computed(() => {
    if (language?.value == 'en') {
      return en
    } else if (language?.value == 'zh-tw') {
      return zhTw
    } else {
      return zhCn
    }
  })
  const changeSize = (val: string) => {
    size.value = val
  }
  function changeLanguage(val: string) {
    language.value = val
  }

  return {
    language,
    locale,
    size,
    changeLanguage,
    changeSize,
  }
})
// 非setup
export function useAppStoreHook() {
  return useAppStore(store)
}
