/** @format */

import { ElectronAPI } from "@electron-toolkit/preload";
import { Api } from "./index.ts";
//全局声明对象 例如  window.api.setTitle(title)
declare global {
  interface Window {
    electron: ElectronAPI;
    api: Api;
  }
}
