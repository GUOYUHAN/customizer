import axios from 'axios'
import ENV from '../config/env'

/**
 * 封装网络请求
 * @param {*} baseUrl 接口域名
 * @param {*} config 配置参数
 * @param {*} headers 请求头
 * @returns
 */
const requestHelper = (baseUrl, config, headers) => {
  const axios1 = axios.create({
    baseURL: baseUrl,
    timeout: 5000,
    headers: {
      //"Content-Type": "application/x-www-form-urlencoded",
      ...headers
    }
  })
  // 请求拦截
  axios1.interceptors.request.use(
    config => {
      //请求前需要做的处理，一般携带token等之类的处理
      return config
    },
    err => {
      if (err && err.request) {
        console.log('请求错误', err)
      } else {
        console.log('err: 链接服务器失败')
      }
      // 返回一个错误
      return Promise.reject()
    }
  )
  // 响应拦截
  axios1.interceptors.response.use(
    res => {
      // 处理响应成功的处理
      return res
    },
    err => {
      if (err && err.response) {
        console.log('响应错误')
      }
      // 返回一个错误
      return Promise.reject()
    }
  )
  return axios1(config)
}

export const request = {
  /**
   * 封装get/post方法
   * @param {*} url 接口地址
   * @param {*} params 传递的参数
   * @param {*} baseUrl 接口域名
   * @param {*} header 请求头
   * @returns
   */
  get: (url, params = {}, baseUrl = ENV.baseUrls, header = {}) => {
    return requestHelper(baseUrl, { url, params, method: 'get' }, header)
  },

  post: (url, data = {}, baseUrl = ENV.baseUrls, header = {}) => {
    return requestHelper(baseUrl, { url, data, method: 'post' }, header)
  }
}
