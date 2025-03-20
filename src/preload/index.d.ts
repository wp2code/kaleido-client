import { serverApi, electronAPI, winApi, init } from './index.ts'
//全局声明对象
declare global {
  interface Window {
    electronAPI: electronAPI
    winApi: winApi
    initApi: init.initApi
    gitToolApi: init.gitToolApi
    serverApi: serverApi
    _BaseURL: string
  }
}
