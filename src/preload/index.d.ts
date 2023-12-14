import { serverApi, electronAPI, api, dbApi } from './index.ts'
//全局声明对象
declare global {
  interface Window {
    electronApi: electronAPI
    winApi: winApi
    db: db
    serverApi: serverApi
  }
}
