// GlobalComponents for Volar
import { I18n, I18nGlobal } from 'vue-i18n'
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $msgBoxUtil: typeof import('@/utils/MessageBox').default
    $t: I18nGlobal['t']
    $i18n: I18n
  }
}
export {}
