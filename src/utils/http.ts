
import axios, { AxiosInstance } from 'axios';
import { customCookie } from "./chrome";

const axionsInit: AxiosInstance = axios.create({
  timeout: 3000,
  withCredentials: true,
  baseURL: "/",
  headers: {

    // ...config?.headers,
  },

})
axionsInit.interceptors.request.use(async (config) => {
  const { url } = config
  const bln = /^\/boe/.test(url as string)

  const baseurl: string = bln ? "https://anycross.feishu-boe.cn" : "https://anycross.feishu.cn"
  config.baseURL = baseurl
  config.url = url?.replace(/^\/(boe|online)\//,'/')
  if (process.env.NODE_ENV !== "development") {
    const cookie = await customCookie(baseurl)
    config.headers["cookie"] = cookie
    return config 
  }
  return config 

}, (err) => Promise.reject(err))
axionsInit.interceptors.response.use((res) => {
  console.log(res, 'res');

  const {  data } = res

  if (typeof data === 'string') {
    try {
      return JSON.parse(data)
    } catch {
      //
    }
  }
  return data

}, (err) => Promise.reject(err))
interface HttpOptions {
  method?: RequestMethod
  url: string
  data?: any
  headers?: any
}
export type RequestMethod = 'get' | 'post' | 'put' | 'delete'

export const http = (opt: HttpOptions) => {
  const options: any = { ...opt }
  if (!options.method) {
    options.method = 'get'
  }
  if (options.method === 'get') {
    options.params = options.data || {}
    delete options.data
  }

  return axionsInit.request(options)
}

