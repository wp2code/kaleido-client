import { contextBridge, ipcRenderer } from 'electron'
import { join } from 'path'
import { JAVA_APP_NAME, JAVA_HOME } from './constants'
import { spawn } from 'child_process'
const isDev = process.env.NODE_ENV == 'development'
const initApi = {
  stopLoading: (res?: string) => {
    ipcRenderer.send('stop-loading', res)
  },
  startServerForSpawn: () => {
    return new Promise(async (resolve, reject) => {
      if (isDev) {
        //模拟启动时间
        setTimeout(() => {
          resolve('isDev')
        }, 3000)
      }
      try {
        const javaApp = join(
          __dirname,
          '../../..',
          `./server/app/${JAVA_APP_NAME}`
        )
        const libPath = join(__dirname, '../../..', `./server/app/lib`)
        const jrePath = join(__dirname, '../../..', `./server/${JAVA_HOME}`)
        console.log(
          `root path is ${__dirname} javaApp is ${javaApp}  jrePath is ${jrePath} libPath is ${libPath}`
        )
        const child = spawn(jrePath, [
          '-Xmx512M',
          `-Dspring.profiles.active=${isDev ? 'dev' : 'prod'}`,
          '-Dserver.address=127.0.0.1',
          '-Djava.awt.headless=true',
          `-Dloader.path=${libPath}`,
          '-jar',
          javaApp,
        ])
        child.stdout.on('data', (buffer) => {
          const data = buffer.toString('utf8')
          console.log(data)
          if (data.toString().indexOf('Started StartApplication') !== -1) {
            console.log('>>>>>>>>>load success<<<<<<<<<<<')
            resolve(data)
          }
        })
        child.stderr.on('data', (data) => {
          reject(data)
          console.error(`stderr:`, data)
        })
        child.on('close', (code) => {
          console.log(`child process exited with code ${code}`)
          resolve(code)
        })
      } catch (error) {
        console.error('startting error', error)
        reject(error)
      }
    })
  },
}
if (process.contextIsolated) {
  contextBridge.exposeInMainWorld('initApi', initApi)
} else {
  //@ts-ignore (define in dts)
  window.initApi = initApi
}
export default { initApi }
