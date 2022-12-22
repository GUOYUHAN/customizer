import options from '../../data/options.json'

export default {
  namespaced: true,
  state: () => ({
    // 定制选项数据
    options,
    // 定制历史
    history: [],
    // 当前定制的选项
    selectedOptions: {
      customFontL: '',
      customFontR: '',
    },
    // 不同部分定制类型状态记录
    optionsState: {},
    // 浮层展示状态
    fontCustomizerShow: false,
    imageCustomizerShow: false,
  }),
  getters: {
    // 是否设置了刺绣文字
    customFont: (state) => state.selectedOptions.customFontL || state.selectedOptions.customFontR,
  },
  mutations: {},
  actions: {
    // 浮层控制
    toggleCustomizer({ state }, payload) {
      const { type, flag } = payload
      state[`${type}CustomizerShow`] = flag
    },

    // 清空刺绣文字
    clearCustomFont({ state }) {
      state.selectedOptions.customFontL = state.selectedOptions.customFontR = ''
    },

    // 不同部分定制类型的选择状态记录
    setOptionsState({ state }, optionsState) {
      state.optionsState = { ...optionsState }
    },

    // 设置具体样式
    setOption({ state }, payload) {
      state.history.push(payload)
      const { part, type, option } = payload
      delete option.style
      delete option.showName

      let selectedOptions = Object.assign({}, state.selectedOptions)
      selectedOptions[part] = selectedOptions[part] || {}
      selectedOptions[part] = {
        [type]: option,
      }
      state.selectedOptions = selectedOptions
    },
  },
}
