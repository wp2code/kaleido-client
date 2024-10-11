import { BrowserWindow, dialog, Menu, nativeImage, net, Tray } from 'electron'
// import { is } from '@electron-toolkit/utils'
import { join } from 'path'
import { format } from 'url'
import { getBaseUrl } from './store'
const isMac = process.platform == 'darwin'
const isDev = process.env.NODE_ENV == 'development'
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

const loadMainResource = (mainWindow: BrowserWindow) => {
  if (isDev && process.env.ELECTRON_RENDERER_URL) {
    const url = process.env.ELECTRON_RENDERER_URL
    mainWindow.loadURL(url)
  } else {
    const filePath = join(__dirname, `../`, `./renderer/index.html`)
    mainWindow.loadURL(
      format({
        pathname: filePath,
        protocol: 'file',
        slashes: true,
      })
    )
  }
}

const createTrayIfAbent = (mainWindow: BrowserWindow) => {
  if (!appTray) {
    const trayIcon = new Tray(icon)
    const contextMenu = Menu.buildFromTemplate([
      {
        label: '打开',
        click: () => {
          winShow(mainWindow)
        },
      },
      {
        label: '退出',
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

const confirmQuitApp = (mainWindow: BrowserWindow) => {
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
export { stopServer, loadMainResource, confirmQuitApp, setIcon, isMac, isDev }
