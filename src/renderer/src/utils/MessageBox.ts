import { ElMessageBox, ElMessage } from 'element-plus'

export interface MsgBoxOptions {
  ok: () => void | Boolean | Promise<Boolean>
  successMsg?: string
  failMsg?: string
}

const showElMessage = (isSuccess: Boolean, options: MsgBoxOptions) => {
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
class MsgBox {
  private static instance: MsgBox | null = null
  static make(): MsgBox {
    if (MsgBox.instance === null) {
      MsgBox.instance = new MsgBox()
    }
    return MsgBox.instance
  }
  confirm(message: string, options: MsgBoxOptions) {
    ElMessageBox.confirm(message, '确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      const okExe = options['ok']()
      if (
        okExe &&
        Object.prototype.toString.call(okExe) === '[object Promise]'
      ) {
        ;(<Promise<Boolean>>okExe).then((res) => {
          showElMessage(res, options)
        })
      } else {
        showElMessage(<Boolean>okExe, options)
      }
    })
  }
}
export default MsgBox.make()
