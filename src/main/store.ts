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
export { store, setWindowBounds, getWindowBounds, setBaseUrl, getBaseUrl }
