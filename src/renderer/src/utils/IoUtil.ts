import { AxiosResponse } from 'axios'
/**
 *
 * @param filePath
 * @param errFun
 * @returns
 */
const importData = (filePath: string, callback: Function) => {
  //@ts-ignore
  const fileData = JSON.parse(
    //@ts-ignore
    window.fs.readFileSync(filePath, 'utf-8', (err: any) => {
      if (callback) {
        callback(err)
      }
    })
  )
  return fileData ? fileData : ''
}
/**
 *
 * @param filePath
 * @param data
 * @param isJson
 * @param errFun
 * @returns
 */
const exportData = (
  filePath: string,
  data: any,
  isJson: boolean = false,
  callback: Function
) => {
  if (!data) {
    return
  }
  //@ts-ignore
  window.fs.writeFile(
    filePath,
    isJson ? data : JSON.stringify(data),
    'utf8',
    (err: any) => {
      if (callback) {
        callback(err)
      }
    }
  )
}
/**
 *
 * @param path
 * @param response
 * @returns
 */
const getExportFilePath = (path: String, response: AxiosResponse) => {
  const temp = response.headers['content-disposition']
    .split(';')[1]
    .split('filename=')[1]
  //@ts-ignore
  return window.path.join(path, decodeURIComponent(temp))
}
export default {
  importData,
  exportData,
  getExportFilePath,
}
