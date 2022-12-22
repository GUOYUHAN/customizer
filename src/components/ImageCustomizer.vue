<style scoped>
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
  width: 80%;
  height: 80%;
}

.image-win {
  width: 100%;
  height: 100%;
  background: #fff;
}
</style>

<template>
  <van-overlay :show="imageCustomizerShow" @click="toggleCustomizer({ type: 'image', flag: false })">
    <div class="wrapper" @click.stop>
      <div class="image-win">图片编辑</div>
    </div>
  </van-overlay>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapActions } = createNamespacedHelpers('customizer')

export default {
  computed: {
    ...mapState(['imageCustomizerShow']),
  },
  methods: {
    ...mapActions(['toggleCustomizer']),
  },
}
</script>
