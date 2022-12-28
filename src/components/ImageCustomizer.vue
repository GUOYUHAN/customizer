<template>
  <van-overlay :show="imageCustomizerShow && fileSelected" @click="toggleCustomizer({ type: 'image', flag: false })">
    <input v-show="false" ref="fileRef" type="file" @change="fileChange" />

    <div class="wrapper">
      <div class="image-win" id="image-win"></div>
    </div>
  </van-overlay>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapActions } = createNamespacedHelpers('customizer')

import { appendDefaultEditor } from '../utils/pintura/pintura.js'
import '../utils/pintura/pintura.css'

export default {
  data() {
    return {
      fileSelected: false,
      w: 0,
      h: 0,
    }
  },
  computed: {
    ...mapState(['imageCustomizerShow']),
  },
  watch: {
    imageCustomizerShow: {
      handler() {
        console.log('imageCustomizerShow')
        this.$refs.fileRef.dispatchEvent(new MouseEvent('click'))
      },
    },
  },
  mounted() {},
  methods: {
    ...mapActions(['toggleCustomizer']),
    fileChange(e) {
      console.log('file change', e)
      // let reader = new FileReader()
      // reader.readAsDataURL(e.target.files[0])
      // reader.onload = function (r) {
      //   let image = new Image()
      //   image.src = r.target.result
      //   image.onload = function () {
      //     this.w = this.width
      //     this.h = this.height
      //   }
      // }
      this.fileSelected = true

      const pintura = appendDefaultEditor('#image-win', {
        src: e.target.files[0],
        resizeSizePresetOptions: [
          [undefined, 'Auto'],
          [[128, 128], 'Small'],
          [[512, 512], 'Medium'],
          [[1024, 1024], 'Large'],
        ],

        cropSelectPresetOptions: [
          [
            'Crop',
            [
              [undefined, 'Custom'],
              [1, 'Square'],
              [4 / 3, 'Landscape'],
              [3 / 4, 'Portrait'],
            ],
          ],
        ],
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
  width: 100%;
  height: 100%;
}

.image-win {
  width: 90%;
  height: 90%;
  padding: 20px;
  background: #fff;
}

::v-deep(.PinturaRoot) {
  background: #fff !important;
}
</style>
