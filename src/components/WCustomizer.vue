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
import CustomizerView from './CustomizerView'
import OpBar from './OpBar'
import FontCustomizer from './FontCustomizer'
import ImageCustomizer from './ImageCustomizer'

export default {
  components: { FontCustomizer, ImageCustomizer, CustomizerView, OpBar },
}
