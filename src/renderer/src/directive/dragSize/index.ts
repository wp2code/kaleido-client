import { Directive, DirectiveBinding } from 'vue'

//拖拽改变横向尺寸
const dragSizeDirective = {
  //自定义指令
  bind(el: any, binding: DirectiveBinding) {
    let endx, differenceX
    el.onmousedown = (e) => {
      if (e.target.className.indexOf('bar') == -1) {
        return
      }
      const X = el.offsetLeft
      const Y = el.offsetTop
      const parentW = el.parentNode.offsetWidth
      var box = document.createElement('div')
      box.style.borderLeft = `1px solid #409eff`
      box.style.width = `0px`
      box.style.height = `${binding.value}`
      box.style.position = `absolute`
      box.style.left = X + 'px'
      box.style.top = Y + 'px'
      box.style.cursor = `w-resize`
      box.style.zIndex = `100000`
      el.parentNode.appendChild(box)
      /*ie9+*/
      /*禁止选择*/
      document.body.onselectstart = function () {
        return false
      }
      document.onmousemove = (e) => {
        document.body.style.cursor = `w-resize`
        //differenceX为bar的宽度加margin
        differenceX =
          el.nextElementSibling.getBoundingClientRect().left -
          el.getBoundingClientRect().left
        endx = e.clientX - el.parentNode.getBoundingClientRect().left
        //设置边界，根据min-width: 20%;跟max-width: 80%来判断
        if (el.nextElementSibling.className === 'container-right') {
          if (endx < parentW * 0.2 - differenceX) {
            endx = parentW * 0.2 - differenceX
          }
          if (endx > parentW * 0.8 - differenceX) {
            endx = parentW * 0.8 - differenceX
          }
        }
        //设置边界，根据min-width: 14px;跟max-width: 4%来判断
        if (el.nextElementSibling.className === 'container-text') {
          if (endx > parentW - 14 - differenceX) {
            endx = parentW - 14 - differenceX
          }
          if (endx < parentW * 0.96 - differenceX) {
            endx = parentW * 0.96 - differenceX
          }
        }
        box.style.left = endx + 'px'
      }
      document.onmouseup = () => {
        if (endx && differenceX) {
          el.nextElementSibling.style.width = `${
            parentW - endx - differenceX
          }px`
        }
        document.onmousemove = null
        document.onmouseup = null
        document.body.onselectstart = null
        endx = null
        differenceX = null
        document.body.style.cursor = `default`
        el.parentNode.removeChild(box)
      }
    }
  },
}
const dragSize: Directive = dragSizeDirective as Directive
export default dragSize
