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
      currentPart: 'vamp',
      currentType: 'color'
    },
    // 当前停留的部位
    selectedPart: '',
    // 当前点击模型选中的部位index
    clickedPartIndex: -1,
    // 是否为点击prev，next箭头
    arrowClicked: false,
    // 不同部分定制类型状态记录
    optionsState: {},
    // 浮层展示状态
    fontCustomizerShow: false,
    imageCustomizerShow: false,
    // 帆布鞋模型
    theModel: null
  }),
  getters: {
    // 是否设置了刺绣文字
    customFont: state => state.selectedOptions.customFontL || state.selectedOptions.customFontR
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

    // 更新模型
    setTheModel({ state }, theModel) {
      state.theModel = theModel
    },

    // 不同部分定制类型的选择状态记录
    setOptionsState({ state }, optionsState) {
      state.optionsState = { ...optionsState }
    },

    // 设置当前停留的部位
    setPart({ state }, part) {
      state.selectedPart = part
    },

    // 当前点击模型选中的部位index
    setClickedPartIndex({ state }, index) {
      state.clickedPartIndex = index
    },

    // 设置是否为点击prev，next箭头
    setArrowClicked({ state }, clicked) {
      state.arrowClicked = clicked
    },

    // 设置当前定制部位和类型
    setCurrent({ state }, payload) {
      const { part, type } = payload
      let selectedOptions = Object.assign({}, state.selectedOptions)
      selectedOptions.currentPart = part
      selectedOptions.currentType = type
      state.selectedOptions = selectedOptions
    },

    // 设置具体样式
    setOption({ state }, payload) {
      state.history.push(payload)
      const { part, type, option } = payload
      console.log('payload', payload)
      delete option.style
      delete option.showName

      let selectedOptions = Object.assign({}, state.selectedOptions)
      selectedOptions.currentPart = part
      selectedOptions.currentType = type
      selectedOptions[part] = selectedOptions[part] || {}
      selectedOptions[part] = {
        [type]: option
      }
      state.selectedOptions = selectedOptions
    }
  }
}
