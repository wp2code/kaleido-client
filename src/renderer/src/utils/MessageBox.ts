import {
  ElMessageBox,
  ElMessage,
  ElNotification,
  messageType,
} from 'element-plus'

export interface MsgBoxOptions {
  ok: Boolean | Promise<Boolean> | Function
  successMsg?: string
  failMsg?: string
  showElMessage?: Boolean
  confirmButtonText?: string
  cancelButtonText?: string
  type?: messageType
}
const showElMessage = (isSuccess: Boolean, options?: MsgBoxOptions) => {
  if (isSuccess) {
    ElMessage({
      type: 'success',
      message: options['successMsg'],
    })
  } else {
    ElMessage({
      type: 'error',
      message: options['failMsg'],
    })
  }
}
const showElNotify = (
  msg: string,
  title: string,
  isShowClose: boolean,
  position: any = 'top-right',
  duration: number = 1000
) => {
  ElNotification.success({
    title: title,
    message: msg,
    showClose: isShowClose,
    duration: duration,
    position: position,
  })
}
class MsgBox {
  private static instance: MsgBox | null = null
  static make(): MsgBox {
    if (MsgBox.instance === null) {
      MsgBox.instance = new MsgBox()
    }
    return MsgBox.instance
  }
  /**
   *
   * @param msg
   */
  ok(msg: string = '操作成功') {
    showElMessage(true, { successMsg: msg } as MsgBoxOptions)
  }
  notify(msg: string = '成功') {
    showElNotify(msg, '', false, 'bottom-right')
  }
  /**
   *
   * @param msg
   */
  fail(msg: string = '操作失败') {
    showElMessage(false, { failMsg: msg } as MsgBoxOptions)
  }
  confirm(message: string, options: MsgBoxOptions) {
    ElMessageBox.confirm(message, '确认', {
      confirmButtonText: options.confirmButtonText || '确认',
      cancelButtonText: options.cancelButtonText || '取消',
      type: options.type || 'warning',
    }).then(() => {
      const okExe = options.ok
      const isShowElMessage = options.showElMessage || true
      if (
        okExe &&
        Object.prototype.toString.call(okExe) === '[object Promise]'
      ) {
        ;(<Promise<Boolean>>okExe).then((res) => {
          if (isShowElMessage) {
            showElMessage(res, options)
          }
        })
      } else if (typeof okExe === 'function') {
        okExe()
      } else {
        if (isShowElMessage) {
          showElMessage(<Boolean>okExe, options)
        }
      }
    })
  }
}
export default MsgBox.make()
