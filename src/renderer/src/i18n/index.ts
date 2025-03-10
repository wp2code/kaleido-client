import { createI18n } from 'vue-i18n'
import { useAppStoreHook } from '@/store/modules/app'

import type { App } from 'vue'
const appStore = useAppStoreHook()
import messages from '@intlify/unplugin-vue-i18n/messages'
// 创建 i18n 实例
const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式（Vue 3）
  locale: appStore!.language, // 默认语言
  fallbackLocale: 'en', // 回退语言
  messages,
  missingWarn: true, // 开启 key 缺失警告
  fallbackWarn: false, // 开启回退警告
  globalInstall: true,
})
export function setupI18n(app: App<Element>) {
  app.use(i18n)
}

export function changeLanguage(lang: string) {
  appStore.changeLanguage(lang)
  i18n.global.locale.value = lang
}
export function activeLanguage() {
  return i18n.global.locale.value
}
export default i18n
