import {
  BrowserWindow,
  dialog,
  Menu,
  nativeImage,
  net,
  Notification,
  Tray,
} from 'electron'
// import { is } from '@electron-toolkit/utils'
import { join } from 'path'
import { format, UrlObject } from 'url'
import { getBaseUrl } from './store'
const isMac = process.platform == 'darwin'
const isDev = process.env.NODE_ENV == 'development'
const AppId = 'com.lzx.Kaleido'
const AppTitle = 'Kaleido'
const AppFeedUrl = 'https://github.com/wp2code/kaleido-client/releases'
const icon = nativeImage.createFromPath(
  join(__dirname, '../..', './build/logo.ico')
)
let appTray = null
let rememberOption = null
const stopServer = () => {
  const baseUrl = getBaseUrl()
  if (baseUrl && !isDev) {
    const request = net.request({
      method: 'GET',
      url: `${baseUrl}/v1/system/stop`,
    })
    request.setHeader('Content-Type', 'application/json')
    request.write(JSON.stringify({}))
    request.on('response', (response) => {
      response.on('data', (_res) => {})
      response.on('end', () => {})
    })
    request.end()
  }
}
const loadMainResource = (mainWindow: BrowserWindow, defaultPath?: string) => {
  if (isDev && process.env.ELECTRON_RENDERER_URL) {
    let url = process.env.ELECTRON_RENDERER_URL
    if (defaultPath && defaultPath.length > 0) {
      url = url + '/#' + defaultPath
    }
    mainWindow.loadURL(url)
  } else {
    const filePath = join(__dirname, `../`, `./renderer/index.html`)
    const options = {
      pathname: filePath,
      protocol: 'file',
      slashes: true,
    } as UrlObject
    if (defaultPath && defaultPath.length > 0) {
      options.hash = defaultPath
      let url = format(options)
      mainWindow.loadURL(url)
    } else {
      let url = format(options)
      mainWindow.loadURL(url)
    }
  }
}
export function updaterNotification(info, mainWindow: BrowserWindow) {
  const n = new Notification({
    title: '更新通知',
    body: `发现新的版本${info.version}`,
  })
  n.on('click', () => {
    loadMainResource(mainWindow, '/setting/setting')
  })
  //延迟10秒通知
  setTimeout(() => {
    n.show()
  }, 10000)
}
const createTrayIfAbent = (mainWindow: BrowserWindow) => {
  if (!appTray) {
    const trayIcon = new Tray(icon)
    const contextMenu = Menu.buildFromTemplate([
      {
        icon: nativeImage.createFromPath(
          join(__dirname, '../../build/open.png')
        ),
        label: '打开',
        click: () => {
          winShow(mainWindow)
        },
      },
      {
        icon: nativeImage.createFromPath(
          join(__dirname, '../../build/quit.png')
        ),
        label: '强制退出',
        click: () => {
          mainWindow.destroy()
        },
      },
    ])
    trayIcon.setToolTip('kaleido')
    trayIcon.setContextMenu(contextMenu)
    trayIcon.on('click', () => {
      winShow(mainWindow)
    })
    appTray = trayIcon
  }
}

const confirmQuitApp = (
  mainWindow: BrowserWindow,
  isQuitAndInstall: boolean = false
) => {
  if (isQuitAndInstall) {
    mainWindow.destroy()
  } else {
    if (rememberOption != null) {
      selectOption(rememberOption, mainWindow)
    } else {
      dialog
        .showMessageBox({
          type: 'question',
          title: '确认退出',
          defaultId: 0,
          message: '确定要退出吗？',
          buttons: ['最小化', '直接退出'],
          checkboxLabel: '不在提醒',
          cancelId: 2,
          noLink: true,
        })
        .then((res) => {
          const opt = res.response
          if (res.checkboxChecked && opt != 2) {
            rememberOption = opt
          }
          selectOption(res.response, mainWindow)
        })
    }
  }
}
const selectOption = (opt: number, mainWindow: BrowserWindow) => {
  if (opt == 0) {
    createTrayIfAbent(mainWindow)
    mainWindow.hide()
    mainWindow.setSkipTaskbar(true)
  } else if (opt == 1) {
    mainWindow.destroy()
  }
}
const setIcon = (mainWindow: BrowserWindow) => {
  mainWindow.setIcon(icon)
}
const winShow = (mainWindow: BrowserWindow) => {
  if (mainWindow.isVisible()) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore()
      mainWindow.focus()
    } else {
      mainWindow.focus()
    }
  } else {
    !isMac && mainWindow.minimize()
    mainWindow.show()
    mainWindow.setSkipTaskbar(false)
  }
}
export {
  stopServer,
  loadMainResource,
  confirmQuitApp,
  setIcon,
  isMac,
  isDev,
  AppId,
  AppTitle,
  AppFeedUrl,
}
