import {
  ElMessageBox,
  ElMessage,
  ElNotification,
  messageType,
  Action,
} from 'element-plus'

export interface MsgBoxOptions {
  ok: Boolean | Promise<Boolean> | Function
  cancel?: Function
  successMsg?: string
  duration?: number
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
      grouping: true,
      repeatNum: 1,
    })
  } else {
    ElMessage({
      type: 'error',
      message: options['failMsg'],
      grouping: true,
      repeatNum: 1,
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
  fail(msg: string = '操作失败', duration: number = 3000) {
    showElMessage(false, { failMsg: msg, duration } as MsgBoxOptions)
  }
  confirm(message: string, options: MsgBoxOptions, title: string = '确认') {
    ElMessageBox.confirm(message, title, {
      confirmButtonText: options.confirmButtonText || '确认',
      cancelButtonText: options.cancelButtonText || '取消',
      type: options.type || 'warning',
    })
      .then((action: Action) => {
        const cancelExe = options.cancel
        if (action === 'close') {
          if (typeof cancelExe === 'function') {
            cancelExe()
          }
        }
        // 这里虽然是取消按钮的回调 上方按钮互换了名称
        else if (action === 'cancel') {
          if (typeof cancelExe === 'function') {
            cancelExe()
          }
        } else {
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
        }
      })
      .catch((action: Action) => {
        const cancelExe = options.cancel
        if (action === 'close') {
          if (typeof cancelExe === 'function') {
            cancelExe()
          }
        }
        // 这里虽然是取消按钮的回调 上方按钮互换了名称
        else if (action === 'cancel') {
          if (typeof cancelExe === 'function') {
            cancelExe()
          }
        }
      })
  }
}
export default MsgBox.make()
