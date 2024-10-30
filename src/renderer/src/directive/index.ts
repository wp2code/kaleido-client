/** @format */

import type { App } from 'vue'

import dragSize from './dragSize'
import contextmenu from './contextmenu'
import style from './style'
import { ClickOutside } from 'element-plus'
// import Clickoutside from 'element-ui/src/utils/Clickoutside'
// 全局注册 directive
export function setupDirective(app: App<Element>): void {
  app
    .directive('dragSize', dragSize)
    .directive('contextmenu', contextmenu)
    .directive('clickoutside', ClickOutside)
    .directive('style', style)
}
