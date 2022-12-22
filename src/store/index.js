import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import customizer from './customizer'

export default new Vuex.Store({
  modules: {
    customizer,
  },
})
