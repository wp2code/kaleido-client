import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { useUserStoreHook } from '@/store/modules/user'
import { debounce } from 'lodash-es'
import MessageBox from '@/utils/MessageBox'
//退出登录
const Logout = debounce((fullPath) => {
  localStorage.clear()
  window.location.href = fullPath
}, 600)
const _BASEURL = import.meta.env.RD_VITE_API_HOST
axios.defaults.baseURL = _BASEURL
// 创建 axios 实例
const requestInstance = axios.create({
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    [import.meta.env.RD_VITE_ACCESS_APP_ID]: import.meta.env
      .RD_VITE_ACCESS_APP_ID_VALUE,
  },
})
// 请求拦截器
requestInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userStore = useUserStoreHook()
    if (userStore.token) {
      config.headers[import.meta.env.RD_VITE_ACCESS_TOKEN] = userStore.token
    }
    return config
  },
  (error: any) => {
    return Promise.reject(error)
  }
)
// 响应拦截器
requestInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // token 过期,重新登录
    if (response.status === 401) {
      MessageBox.confirm('当前页面已失效，请重新登录', {
        ok: () => {
          Logout('/')
        },
      })
    }
    if (response.status !== 200) {
      MessageBox.fail('请求响应异常：' + response.status)
      return
    }
    // 响应数据为二进制流处理(Excel导出)
    if (
      response.data instanceof ArrayBuffer ||
      response.data instanceof Blob ||
      response.headers['content-disposition']
    ) {
      return response
    }
    const { code, message } = response.data
    if (code === 'success') {
      return response.data
    }
    MessageBox.fail(message || '系统出错')
    return Promise.reject(message || '系统出错')
  },
  (error: any) => {
    if (error.response.data) {
      const { message } = error.response.data
      MessageBox.fail(message || '系统出错')
    }
    return Promise.reject(error.message)
  }
)
export default requestInstance
