import { contextBridge, ipcRenderer, clipboard, shell } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import * as db from '../repositories'
import path from 'path'
import fs from 'fs'
import os from 'os'
import initApi from './init'
const winApi = {
  openSaveDialog: (options = {}) => {
    return ipcRenderer.invoke('open-save-dialog', { options })
  },
  openFileDialog: (multiSelections: boolean = false, options = {}) => {
    return ipcRenderer.invoke('open-file-dialog', { multiSelections, options })
  },
  copy: (text: string) => clipboard.writeText(text),
  openPath: (path: string) => shell.openPath(path),
  setBaseURL: (baseUrl: string) => {
    ipcRenderer.send('set-base-url', baseUrl)
  },
  getDownloadPath: async (filename: string) => {
    const downloadPath = await ipcRenderer.invoke('get-downloads-path')
    const filePath = path.join(downloadPath, filename)
    return filePath
  },
}
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electronAPI', electronAPI)
    contextBridge.exposeInMainWorld('winApi', winApi)
    contextBridge.exposeInMainWorld('db', db)
    contextBridge.exposeInMainWorld('fs', fs)
    contextBridge.exposeInMainWorld('os', os)
    contextBridge.exposeInMainWorld('path', path)
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
  window.fs = fs
  //@ts-ignore (define in dts)
  window.os = os
  //@ts-ignore (define in dts)
  window.path = path
}
export default { electronAPI, winApi, db, initApi }
