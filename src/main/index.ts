import {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
  globalShortcut,
  shell,
} from 'electron'
import { join } from 'path'
import { getWindowBounds, setWindowBounds, setBaseUrl } from './store'
import {
  loadMainResource,
  stopServer,
  confirmQuitApp,
  setIcon,
  isMac,
} from './util'
let mainWindow = null
let isStopLoading = false
const locked = app.requestSingleInstanceLock()
if (!locked) {
  app.quit
} else {
  app.on('second-instance', (_event, _commandLine, _workingDirectory) => {
    // 当尝试再次打开一个新实例时，将焦点回到已打开的窗口
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}
function createWindow() {
  const { width, height, x, y } = getWindowBounds()
  const options = {
    x,
    y,
    width: width,
    height: height,
    minWidth: 1150,
    minHeight: 780,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      webSecurity: false,
      spellcheck: false,
      sandbox: false,
      preload: join(__dirname, '../preload/index.js'),
    },
  }
  mainWindow = new BrowserWindow(options)
  setIcon(mainWindow)
  mainWindow.setMenu(null)
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })
  //加载应用
  loadMainResource(mainWindow)
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
  mainWindow.on('resize', () => {
    setWindowBounds(mainWindow.getBounds())
  })
  mainWindow.on('move', () => {
    setWindowBounds(mainWindow.getBounds())
  })
  mainWindow.on('close', (event) => {
    event.preventDefault()
    confirmQuitApp(mainWindow)
  })
}
app.whenReady().then(() => {
  app.setUserTasks([])
  createWindow()
})

app.setAppUserModelId('com.lzx.Kaleido')
app.on('browser-window-created', (_, window) => {
  // optimizer.watchWindowShortcuts(window)
  // 注册快捷键Ctrl+Shift+I打开开发者工具
  globalShortcut.register('CommandOrControl+Shift+I', () => {
    window.webContents.openDevTools()
  })
})
app.on('activate', () => {
  if (!mainWindow) {
    createWindow()
  } else {
    if (mainWindow.isMinimized()) {
      mainWindow.restore()
    }
    if (mainWindow.isVisible()) {
      mainWindow.focus()
    } else {
      mainWindow.show()
    }
  }
})
app.on('before-quit', () => {
  stopServer()
})
app.on('window-all-closed', () => {
  mainWindow = null
  if (!isMac) {
    app.quit()
  }
})
ipcMain.on('stop-loading', (_event, _log) => {
  if (isStopLoading) {
    return
  }
  isStopLoading = true
})
ipcMain.on('set-base-url', (_event, baseUrl) => {
  setBaseUrl(baseUrl)
})
ipcMain.handle('get-downloads-path', (_event) => {
  const downloadPath = app.getPath('downloads')
  return downloadPath
})
ipcMain.handle('open-save-dialog', (_event, params): any => {
  const properties = [
    'createDirectory',
    'showOverwriteConfirmation',
    'showHiddenFiles',
  ]
  const path = dialog.showSaveDialogSync({
    properties: properties,
    ...params.options,
  })
  return path === undefined ? undefined : path
})
ipcMain.handle('open-file-dialog', (_event, params): any => {
  const properties = ['openFile']
  if (params.multiSelections) {
    properties.push('multiSelections')
  }
  const filePath = dialog.showOpenDialogSync({
    properties: properties,
    ...params.options,
  })
  return filePath === undefined ? undefined : filePath[0]
})
ipcMain.handle('open-dir-dialog', (_event, params): any => {
  const filePath = dialog.showOpenDialogSync({
    properties: ['openDirectory'],
    ...params.options,
  })
  return filePath === undefined ? undefined : filePath[0]
})
