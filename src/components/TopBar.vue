<style scoped lang="scss">
.top-bar {
  position: absolute;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  width: 100%;
  height: 80px;
  z-index: 1;
}

.save-custom {
  width: 100px;
  height: 40px;
  margin-right: 20px;
  border-radius: 10px;
  background-color: #c9192e;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  color: #fff;
  letter-spacing: 2px;
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
    ...mapState(['selectedOptions', 'optionsState'])
  },
  methods: {
    async saveCustom() {
      console.log('save')
      await API.saveCustom()
    }
  },
  mounted() {}
}
</script>
