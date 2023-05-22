<style scoped lang="scss">
.top-bar {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  width: 100%;
  height: 60px;
  z-index: 1;
}

.save-custom {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  padding: 0 16px;
  height: 36px;
  color: #fff;
  font-weight: 500;
  letter-spacing: 2px;
  border-radius: 18px;
  background-color: #f95555;
}
</style>

<template>
  <div class="top-bar">
    <div class="save-custom" @click="saveCustom">保存设计</div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapGetters, mapActions } = createNamespacedHelpers('customizer')
import API from '../api/api'

export default {
  data() {
    return {
      visible: true
    }
  },
  computed: {
    ...mapState(['selectedOptions', 'options'])
  },
  methods: {
    async saveCustom() {
      let customPartData = this.getCustomDataList()
      console.log('customPartData', customPartData)

      // await API.saveCustom()
    },
    getCustomDataList() {
      console.log('selectedOptions', this.selectedOptions)
      let resArr = []
      if (!this.options && this.options.length == 0) return
      for (let i = 0, len = this.options.length; i < len; i++) {
        let { part } = this.options[i]
        if (!this.selectedOptions[part]) break
        let currentPart = this.selectedOptions[part]
        let tempMap = {}
        tempMap['position'] = part
        for (let [key, value] of Object.entries(currentPart)) {
          value = value['value']
          tempMap[key] = value
        }
        resArr.push(tempMap)
      }
      return resArr
    }
  }
}
</script>
