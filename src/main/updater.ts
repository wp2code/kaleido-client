import { BrowserWindow, IpcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
import { isDev, updaterNotification } from './util'
import logger from 'electron-log'
import { setUpdateVersion, setQuitAndInstall } from './store'
// 自动下载更新
autoUpdater.autoDownload = false
// 退出时自动安装更新
autoUpdater.autoInstallOnAppQuit = false
autoUpdater.logger = logger
let cancellationToken = null
let isManual = false
export default (
  mainWindow: BrowserWindow,
  ipcMain: IpcMain,
  feedURL?: string
) => {
  if (isDev) {
    autoUpdater.forceDevUpdateConfig = true
    return
  }
  if (feedURL) {
    autoUpdater.setFeedURL(feedURL)
  }
  const checkForUpdates = async (manual: boolean) => {
    try {
      isManual = manual
      const res = await (manual
        ? autoUpdater.checkForUpdates()
        : autoUpdater.checkForUpdatesAndNotify())
      setUpdateVersion(res.updateInfo.version)
      cancellationToken = res.cancellationToken
      return {
        success: true,
        version: res.updateInfo.version,
        manual,
      }
    } catch (e) {
      logger.error('更新异常', e)
      return {
        success: false,
        error: e,
        manual,
      }
    }
  }
  const downloadUpdate = async (isCancel: boolean) => {
    try {
      const res = await (isCancel && cancellationToken
        ? autoUpdater.downloadUpdate(cancellationToken)
        : autoUpdater.downloadUpdate())
      return {
        success: true,
        files: res,
      }
    } catch (error) {
      logger.error('手动下载异常', error)
      return {
        success: false,
        error,
      }
    }
  }
  setQuitAndInstall(false)
  //自动检查版本
  checkForUpdates(false)

  //手动检查更新
  ipcMain.handle('checkForUpdateVersion', (_event, manual: boolean) => {
    return checkForUpdates(manual)
  })
  //手动下载
  ipcMain.handle('sendDownloadUpdate', (_event, isCancel: boolean) => {
    return downloadUpdate(isCancel)
  })
  //退出并且安装应用
  ipcMain.on('quitAndInstallApp', (_event) => {
    logger.log('退出并且安装应用...')
    setQuitAndInstall(true)
    setTimeout(() => {
      autoUpdater.quitAndInstall()
    }, 600)
  })
  autoUpdater.on('checking-for-update', () => {
    logger.log('正在检查更新...')
    sendUpdateMessage('up-check', true)
  })
  // 有新版本时
  autoUpdater.on('update-available', (info) => {
    logger.log('发现有新的版本...')
    if (!isManual) {
      updaterNotification(info, mainWindow)
    }
    sendUpdateMessage('up-available', true, {
      version: info.version,
    })
  })
  // 没有新版本时
  autoUpdater.on('update-not-available', (info) => {
    logger.info('没有新的版本更新')
    sendUpdateMessage('up-unavailable', true, {
      version: info.version,
    })
  })
  let percent = null
  // 监听下载进度
  autoUpdater.on('download-progress', (prog) => {
    logger.info('监听下载进度。。。')
    const percentValue = Math.ceil(prog.percent)
    let percentV = null
    if (percent && percent > percentValue) {
      percentV = percent
    } else {
      percentV = percentValue
      percent = percentValue
    }
    sendUpdateMessage('up-progress', true, {
      speed:
        prog && prog.bytesPerSecond
          ? prog?.bytesPerSecond / 1000000 > 1
            ? Math.ceil(prog?.bytesPerSecond / 1000000) + 'M/s'
            : Math.ceil(prog?.bytesPerSecond / 1000) + 'K/s'
          : '', // 网速
      percent: percentV, // 百分比
    })
  })
  // 更新下载完毕
  autoUpdater.on('update-downloaded', (res) => {
    logger.info('更新下载完成。。。')
    sendUpdateMessage('up-downloaded', true, {
      ...res,
    })
  })
  // 更新发生错误
  autoUpdater.on('error', (error) => {
    logger.error('下载更新异常', error)
    sendUpdateMessage('up-error', false, {}, error)
  })

  function sendUpdateMessage(
    cmd: string,
    success: boolean,
    data: any = {},
    error?: any
  ) {
    mainWindow.webContents.send('up-app-message', {
      cmd,
      success,
      data,
      error,
    })
  }
}
