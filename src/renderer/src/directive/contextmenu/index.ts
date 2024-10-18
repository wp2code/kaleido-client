import { Directive, DirectiveBinding, render, VNode } from 'vue'
import { isClient } from '@vueuse/core'
import { type MenuInfoType, type IMenuItemSvgType } from './type'
import SvgIcon from '../../components/SvgIcon/index.vue'
// 参照 import { ClickOutside } from 'element-plus'
const nodeList = /* @__PURE__ */ new Map()
let menu
if (isClient) {
  let startClick
  document.addEventListener('mousedown', (e) => (startClick = e))
  document.addEventListener('mouseup', (e) => {
    if (startClick) {
      for (const handlers of nodeList.values()) {
        for (const { documentHandler } of handlers) {
          documentHandler(e, startClick)
        }
      }
      startClick = void 0
    }
  })
}
const isElement = (e) => {
  if (typeof Element === 'undefined') return false
  return e instanceof Element
}

function createContextMenuHandler(
  clientX,
  clientY,
  _el: any,
  binding: DirectiveBinding
) {
  const menuInfo = binding.value as MenuInfoType
  if (menu) {
    menu.remove()
  }
  // 创建菜单DOM
  menu = document.createElement('div')
  menu.id = 'cm-menu'
  menu.className = menuInfo.className
    ? 'cm-menu ' + menuInfo.className
    : 'cm-menu'
  menuInfo.items.forEach((item) => {
    const menuItem = document.createElement('div')
    menuItem.className = 'cm-menu-item'
    if (item.icon) {
      const icon = document.createElement('div')
      let iconInfo = {} as IMenuItemSvgType
      if (typeof item.icon == 'string') {
        iconInfo.iconName = item.icon
      } else {
        iconInfo = item.icon
      }
      const svgIcon = h(SvgIcon, {
        iconName: iconInfo?.iconName,
        color: iconInfo?.color,
        size: iconInfo?.size,
      })
      render(svgIcon, icon)
      menuItem.appendChild(icon)
      const menuItemLink = document.createElement('div')
      menuItemLink.textContent = item.lable
      menuItem.appendChild(menuItemLink)
    } else {
      menuItem.textContent = item.lable
    }
    menuItem.onclick = (_e) => {
      return item.onclick(_e, menuInfo.data)
    }
    menu.appendChild(menuItem)
  })
  document.body.appendChild(menu)
  menu.style.left = `${clientX}px`
  menu.style.top = `${clientY}px`
  menu.style.display = 'block'
  menu.style.zIndex = '100'
  menu.style.position = 'absolute'
}
function createDocumentHandler(el, binding) {
  let excludes = []
  if (Array.isArray(binding.arg)) {
    excludes = binding.arg
  } else if (isElement(binding.arg)) {
    excludes.push(binding.arg)
  }
  return function (mouseup, mousedown) {
    const popperRef = binding.instance.popperRef
    const mouseUpTarget = mouseup.target
    const mouseDownTarget = mousedown == null ? void 0 : mousedown.target
    const isBound = !binding || !binding.instance
    const isTargetExists = !mouseUpTarget || !mouseDownTarget
    const isContainedByEl =
      el.contains(mouseUpTarget) || el.contains(mouseDownTarget)
    const isSelf = el === mouseUpTarget
    const isTargetExcluded =
      (excludes.length &&
        excludes.some((item) =>
          item == null ? void 0 : item.contains(mouseUpTarget)
        )) ||
      (excludes.length && excludes.includes(mouseDownTarget))
    const isContainedByPopper =
      popperRef &&
      (popperRef.contains(mouseUpTarget) || popperRef.contains(mouseDownTarget))
    if (
      isBound ||
      isTargetExists ||
      isContainedByEl ||
      isSelf ||
      isTargetExcluded ||
      isContainedByPopper
    ) {
      return
    }
    nextTick(() => {
      if (menu) {
        menu.style.display = 'none'
      }
    })
    // binding.value(mouseup, mousedown)
  }
}

const contextmenuDirective = {
  beforeMount(el, binding) {
    if (!nodeList.has(el)) {
      nodeList.set(el, [])
    }
    nodeList.get(el).push({
      documentHandler: createDocumentHandler(el, binding),
      // bindingFn: binding.value,
    })
  },
  mounted(el: any, binding: DirectiveBinding, _vnode: VNode) {
    el.addEventListener('contextmenu', (_event) => {
      _event.preventDefault()
      createContextMenuHandler(_event.clientX, _event.clientY, el, binding)
    })
  },
  updated(el, binding) {
    if (!nodeList.has(el)) {
      nodeList.set(el, [])
    }
    const handlers = nodeList.get(el)
    const oldHandlerIndex = handlers.findIndex(
      (item) => item.bindingFn === binding.oldValue
    )
    const newHandler = {
      documentHandler: createDocumentHandler(el, binding),
      // bindingFn: binding.value,
    }
    if (oldHandlerIndex >= 0) {
      handlers.splice(oldHandlerIndex, 1, newHandler)
    } else {
      handlers.push(newHandler)
    }
  },
  unmounted(el) {
    nodeList.delete(el)
  },
}
const contextmenu: Directive = contextmenuDirective as Directive
export { contextmenu as default }
