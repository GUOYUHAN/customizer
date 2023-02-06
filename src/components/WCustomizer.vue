<style>
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: #f1f2ed;
}
</style>

<template>
  <div class="container">
    <!-- loading界面 -->
    <async-loader :show="loading.show" :percentage="loading.percentage" />
    <!-- 顶部操作栏 -->
    <!-- <top-bar /> -->
    <!-- 3D 效果图 -->
    <customizer-view />
    <!-- 底部操作栏 -->
    <op-bar />
    <!-- 图片编辑 -->
    <image-customizer />
    <!-- 文字编辑 -->
    <font-customizer />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import TopBar from './TopBar'
import CustomizerView from './CustomizerView'
import OpBar from './OpBar'
import FontCustomizer from './FontCustomizer'
import ImageCustomizer from './ImageCustomizer'
import AsyncLoader from './common/AsyncLoader'

const { mapState } = createNamespacedHelpers('customizer')

export default {
  components: { FontCustomizer, ImageCustomizer, CustomizerView, OpBar, AsyncLoader },
  computed: {
    ...mapState(['loading'])
  },
  mounted() {}
}
</script>
