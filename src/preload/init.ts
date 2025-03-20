import { contextBridge, ipcRenderer } from 'electron'
import { join } from 'path'
import { JAVA_APP_NAME, JAVA_HOME } from './constants'
import { spawn } from 'child_process'
import { simpleGit, SimpleGit, CleanOptions } from 'simple-git'
import { existsSync, readdirSync, rmSync } from 'fs'

const git: SimpleGit = simpleGit().clean(CleanOptions.FORCE)
const isDev = process.env.NODE_ENV == 'development'
export declare interface InitApi {
  stopLoading: (res?: string) => void
  startServerForSpawn: () => Promise<Object>
}
export declare interface GitToolApi {
  cloneRepository: (
    repoUrl: string,
    localPath: string,
    auth?: { username: string; password: string },
    force?: boolean
  ) => Promise<Number>
}

const initApi: InitApi = {
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
const gitToolApi: GitToolApi = {
  cloneRepository: async (
    repoUrl: string,
    localPath: string,
    auth?: { username: string; password: string },
    force: boolean = false
  ): Promise<Number> => {
    try {
      let finalRepoUrl = repoUrl
      if (auth) {
        const encodedUsername = encodeURIComponent(auth.username)
        const encodedPassword = encodeURIComponent(auth.password)
        finalRepoUrl = `https://${encodedUsername}:${encodedPassword}@${repoUrl.replace(
          'https://',
          ''
        )}`
      }
      // 检查目标路径是否存在且是否为空
      if (force && existsSync(localPath)) {
        const files = readdirSync(localPath)
        if (files.length > 0) {
          // 如果目录不为空，可以选择删除目录
          rmSync(localPath, { recursive: true, force: true })
          console.log(`Directory ${localPath} has been deleted.`)
        }
      }
      await git.clone(finalRepoUrl, localPath)
      return 0
    } catch (error) {
      console.error(error.message)
      if (
        error.message.includes('already exists and is not an empty directory')
      ) {
        return -2
      }
      return -1
    }
  },
}
if (process.contextIsolated) {
  contextBridge.exposeInMainWorld('initApi', initApi)
  contextBridge.exposeInMainWorld('gitToolApi', gitToolApi)
} else {
  //@ts-ignore (define in dts)
  window.initApi = initApi
  //@ts-ignore (define in dts)
  window.gitToolApi = gitToolApi
}
export default { initApi, gitToolApi }
