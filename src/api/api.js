import { request } from '../utils/request.js'

export const URL = {
  test: '/1.0/uiforum/xphTestDemo',
  getModels: ''
}

const api = {
  getModels: param => request.get(URL.getModels, param),
  test: param => request.get(URL.test, param)
}

export default api
