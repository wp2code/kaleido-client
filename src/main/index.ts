import { app, BrowserWindow, ipcMain, net, dialog } from 'electron'
import { join, parse } from 'path'
import { optimizer, is } from '@electron-toolkit/utils'
let baseUrl = null
let isStopLoading = false
const createWindow = () => {
  return new Promise((resolve, _reject) => {
    const mainWindow = new BrowserWindow({
      width: 1150,
      height: 780,
      show: false,
      autoHideMenuBar: true,
      transparent: false,
      ...(process.platform === 'linux'
        ? { icon: join(__dirname, '../../resources/box.png?asset') }
        : {}),
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: true,
        allowRunningInsecureContent: true,
        scrollBounce: true,
        spellcheck: false,
        webviewTag: true,
        javascript: true,
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false,
      },
    })

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      const url = process.env['ELECTRON_RENDERER_URL']
      console.log('loadURL is', url)
      mainWindow.loadURL(url)
    } else {
      const filePath = join(__dirname, '../renderer/index.html')
      console.log('loadFile is', filePath)
      mainWindow.loadFile(filePath)
    }
    // const loadingWindow = new BrowserWindow({
    //   parent: mainWindow,
    //   show: false,
    //   frame: false,
    //   width: 500,
    //   height: 500,
    //   resizable: false,
    //   transparent: true,
    // })
    // loadingWindow.loadFile(join(__dirname, '../../resources/loading.html'))
    // loadingWindow.once('ready-to-show', (_log) => {
    //   loadingWindow.show()
    // })
    mainWindow.once('ready-to-show', (_log) => {
      mainWindow.show()
    })
    ipcMain.on('stop-loading', (_event, _log) => {
      console.log(isStopLoading, _log)
      if (isStopLoading) {
        return
      }
      isStopLoading = true
      // mainWindow.show()
      // loadingWindow.hide()
      // loadingWindow.destroy()
    })
    // mainWindow.webContents.openDevTools({ mode: 'right' })
    resolve(mainWindow)
  })
}
app.whenReady().then(() => {
  createWindow()
})
app.on('browser-window-created', (_, window) => {
  optimizer.watchWindowShortcuts(window)
})
app.on('window-all-closed', () => {
  if (baseUrl) {
    const request = net.request({
      method: 'GET',
      url: `${baseUrl}/v1/system/stop`,
    })
    console.log('stop server api', `${baseUrl}/v1/system/stop`)
    request.setHeader('Content-Type', 'application/json')
    request.write(JSON.stringify({}))
    request.on('response', (response) => {
      response.on('data', (res) => {
        let data = JSON.parse(res.toString())
        console.log('stop server', data)
      })
      response.on('end', () => {})
    })
    request.end()
  }
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
ipcMain.on('set-base-url', (_event, _baseUrl) => {
  baseUrl = _baseUrl
})
ipcMain.handle('get-product-name', (_event) => {
  const exePath = app.getPath('exe')
  const { name } = parse(exePath)
  return name
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
    properties: ['openFile'],
    ...params.options,
  })
  console.log('filePath---', filePath)
  return filePath === undefined ? undefined : filePath[0]
})
