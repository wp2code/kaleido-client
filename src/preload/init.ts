import { contextBridge, ipcRenderer, clipboard, shell } from 'electron'
import path from 'path'
import { JAVA_APP_NAME, JAVA_HOME } from './constants'
import { spawn } from 'child_process'
const initApi = {
  stopLoading: (res: string) => {
    ipcRenderer.send('stop-loading', res)
  },
  startServerForSpawn: () => {
    return new Promise(async (resolve, reject) => {
      console.log('startting.....')
      // const javaPath =
      //   'D:\\wp2code\\github\\kaleido\\kaleido-start\\target\\kaleido-start-1.0.0-SNAPSHOT.jar'
      const javaPath = path.join(__dirname, '', `./static/${JAVA_APP_NAME}`)
      console.log('java jar path is ', javaPath)
      const productName = await ipcRenderer.invoke('get-product-name')
      const isProd = productName.match(/prod$/i) !== null
      console.log('productName:', productName, isProd)
      const jrePath = path.join(__dirname, '../..', `./static/${JAVA_HOME}`)
      const child = spawn(
        'D:\\Program Files\\Chat2DB\\resources\\app\\static\\jre\\bin\\java',
        [
          '-Xmx1024M',
          `-Dspring.profiles.active=${isProd ? 'prod' : 'dev'}`,
          '-Dserver.address=127.0.0.1',
          '-Djava.awt.headless=true',
          '-jar',
          javaPath,
        ]
      )
      child.stdout.on('data', (buffer) => {
        const data = buffer.toString('utf8')
        console.log(data)
        if (data.toString().indexOf('Started StartApplication') !== -1) {
          console.log('>>>>>>>>>load success<<<<<<<<<<<')
          resolve(data)
          return
        }
      })
      child.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`)
        reject(data)
      })
      child.on('close', (code) => {
        console.log(`child process exited with code ${code}`)
      })
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
