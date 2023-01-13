import { request } from '../utils/request.js'

export const URL = {
  test: '/1.0/uiforum/xphTestDemo',
  getModelInfo: '',
  getOptionList: '',
  getSvgs: '',
  saveCustom: ''
}

const api = {
  getModelInfo: param => request.get(URL.getModels, param),
  getOptionList: param => request.get(URL.getModels, param),
  getSvgs: param => request.get(URL.getModels, param),
  saveCustom: param => request.post(URL.getModels, param),

  test: param => request.get(URL.test, param)
}

export default api
