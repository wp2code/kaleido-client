// import { bind } from 'lodash-es'
import { Directive, DirectiveBinding, VNode } from 'vue'

//拖拽改变横向尺寸
const styleDirective = {
  // bind(el: any, binding: DirectiveBinding, vnode: VNode) {
  //   // el.oncontextmenu((_event) => {
  //   //   const X = el?.offsetLeft
  //   //   const Y = el?.offsetTop
  //   //   console.log('contextmenuDirective', `offsetLeft:${X},offsetTop:${Y}`)
  //   //   const menuData = binding.value
  //   //   console.log('contextmenuDirective', menuData)
  //   // })
  //   function handleContextMenu(e) {
  //     e.preventDefault()
  //     // 通过binding.value获取菜单数据
  //     const menuData = binding.value
  //     console.log('contextmenuDirective', menuData)
  //     // 创建菜单DOM
  //     const menu = document.createElement('div')
  //     menu.className = 'context-menu'
  //     menuData.forEach((item) => {
  //       const menuItem = document.createElement('div')
  //       menuItem.textContent = item.text
  //       menuItem.onclick = item.onclick
  //       menu.appendChild(menuItem)
  //     })
  //     // 将菜单添加到body
  //     document.body.appendChild(menu)
  //     // 设置菜单位置
  //     menu.style.left = `${e.clientX}px`
  //     menu.style.top = `${e.clientY}px`
  //     // 设置菜单显示
  //     menu.style.display = 'block'
  //   }
  //   el.addEventListener('contextmenu', handleContextMenu)
  //   // vnode.context.$once('hook:destroyed', () => {
  //   //   el.removeEventListener('contextmenu', handleContextMenu)
  //   // })
  // },
  created(el, binding, vnode) {
    el.addEventListener('contextmenu', () => {
      // 这会在 `mounted` 和 `updated` 时都调用
      console.log('color.directive', binding.value)
      el.style.color = binding.value.color
    })
  },
}

const style: Directive = styleDirective as Directive
export default style
