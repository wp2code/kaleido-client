import { createApp } from 'vue'
import App from './App.vue'
import { setupStore } from '@/store'
import router from '@/router'
import { setupDirective } from '@/directive'
//路由守卫
import '@/permission'
// 本地SVG图标
import 'virtual:svg-icons-register'
// 国际化
import i18n from '@/i18n/index'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import '@/styles/index.scss'
import 'uno.css'
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
import MsgBoxUtil from '@/utils/MessageBox'
app.config.globalProperties.$msgBoxUtil = MsgBoxUtil
// 全局注册 自定义指令(directive)
setupDirective(app)
// 全局注册 状态管理(store)
setupStore(app)
app.use(router).use(i18n).mount('#app')
