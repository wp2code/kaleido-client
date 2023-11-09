/** @format */

import type { App } from 'vue'

// import { hasPerm } from './permission'
import dragSize from './dragSize'

// 全局注册 directive
export function setupDirective(app: App<Element>): void {
  // 使 v-hasPerm 在所有组件中都可用
  app.directive('dragSize', dragSize)
}
