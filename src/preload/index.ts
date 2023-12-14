import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import path from 'path'
import { JAVA_APP_NAME, JAVA_PATH } from './constants'
import * as db from '../repositories'
import { spawn } from 'child_process'
// export * from './proxy'
// Custom APIs for renderer
const winApi = {
  setTitle: (title) => ipcRenderer.send('set-title', title),
}
const serverApi = {
  startServerForSpawn: async () => {
    const javaPath = path.join(__dirname, '', `./static/${JAVA_APP_NAME}`)
    const productName = await ipcRenderer.invoke('get-product-name')
    const isTest = productName.match(/test$/i) !== null
    console.log('productName:', productName, isTest)
    const child = spawn(path.join(__dirname, '', `./static/${JAVA_PATH}`), [
      '-jar',
      '-Xmx512M',
      `-Dspring.profiles.active=${isTest ? 'test' : 'release'}`,
      '-Dserver.address=127.0.0.1',
      javaPath,
    ])
    child.stdout.on('data', (buffer) => {
      const data = buffer.toString('utf8')
      console.log(data)
      if (data.toString().indexOf('Started Application') !== -1) {
        console.log('load success')
      }
    })
    child.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`)
    })
    child.on('close', (code) => {
      console.log(`child process exited with code ${code}`)
    })
  },
}
// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electronApi', electronAPI)
    contextBridge.exposeInMainWorld('winApi', winApi)
    contextBridge.exposeInMainWorld('db', db)
    contextBridge.exposeInMainWorld('serverApi', serverApi)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electronApi = electronAPI
  // @ts-ignore (define in dts)
  window.winApi = api
  //@ts-ignore (define in dts)
  window.db = db
  //@ts-ignore (define in dts)
  window.serverApi = serverApi
}
export default { electronAPI, winApi, db, serverApi }
