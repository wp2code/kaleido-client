import { serverApi, electronAPI, winApi, initApi } from './index.ts'
//全局声明对象
declare global {
  interface Window {
    electronAPI: electronAPI
    winApi: winApi
    initApi: initApi
    // db: db
    serverApi: serverApi
    _BaseURL: string
  }
}
