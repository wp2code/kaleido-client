import { Rectangle } from 'electron'
import Store from 'electron-store'
const store = new Store()
const setWindowBounds = (rectangle: Rectangle) => {
  store.set('windowBounds', rectangle)
}
const getWindowBounds = (): Rectangle => {
  return store.get('windowBounds', { width: 1150, height: 780 }) as Rectangle
}
const setBaseUrl = (baseUrl: string) => {
  store.set('baseUrl', baseUrl)
}
const getBaseUrl = (): string => {
  return store.get('baseUrl') as string
}
const setUpdateVersion = (version: string) => {
  store.set('Up-version', version)
}
const getUpdateVersion = (): string => {
  return store.get('Up-version') as string
}
const deleteUpVersion = () => {
  store.delete('Up-version')
}
const setQuitAndInstall = (isQuitAndInstall: boolean = false) => {
  return store.set('Up-quitAndInstall', isQuitAndInstall)
}
const isQuitAndInstall = () => {
  return (store.get('Up-quitAndInstall') || false) as boolean
}
const deleteByKey = (k: string) => {
  if (k) {
    store.delete(k)
  }
}
export {
  store,
  deleteUpVersion,
  deleteByKey,
  setWindowBounds,
  getWindowBounds,
  setBaseUrl,
  getBaseUrl,
  setUpdateVersion,
  getUpdateVersion,
  setQuitAndInstall,
  isQuitAndInstall,
}
