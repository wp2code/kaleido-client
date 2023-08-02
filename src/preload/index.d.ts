import { electronAPI, api, db } from "./index.ts";
//全局声明对象 
declare global {
  interface Window {
    electron: electronAPI;
    api: api;
    db: db;
  }
}
