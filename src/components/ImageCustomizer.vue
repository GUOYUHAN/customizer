<template>
  <div>
    <input v-show="false" ref="fileRef" type="file" id="userFile" @input="fileChange" accept="image/*" />

    <div v-if="editorShow" class="wrapper">
      <w-image-editor class="image-win" ref="imageEditor" @close="close" @finish="finish" />
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapActions } = createNamespacedHelpers('customizer')

import { loadTexture } from '../utils/customizer/load.js'
import { setMaterial } from '../utils/utils.js'
import { generateOutputImage } from '../utils/customizer/imageTools'

import svgList from '../data/svgList.json'

import WImageEditor from '@/components/wImageEditor/w-image-editor'

export default {
  components: {
    WImageEditor,
  },
  computed: {
    ...mapState(['imageCustomizerShow', 'selectedOptions', 'theModel']),
  },
  watch: {
    imageCustomizerShow(selectImage) {
      selectImage && this.selectImage()
    },
    immediate: true,
  },
  data() {
    return {
      editorShow: false,
    }
  },
  methods: {
    ...mapActions(['toggleCustomizer', 'setOption']),
    selectImage() {
      this.$refs.fileRef.dispatchEvent(new MouseEvent('click'))
      this.$nextTick(() => {
        this.toggleCustomizer({ type: 'image', flag: false })
      })
    },
    fileChange(e) {
      // TODO 鞋码暂时写死
      let overlayObj = svgList['4.0'][this.selectedOptions.currentPart]

      if (!e?.target?.files) return (this.editorShow = false)
      const file = e.target.files[0]
      if (!file) return

      this.editorShow = true
      this.$nextTick(() => {
        let imgUrl = URL.createObjectURL(file)
        this.$refs.imageEditor.openImageEditor(imgUrl, {
          overlayObj,
        })
        e.target.value = '' // 可重复上传相同文件
      })
    },
    close() {
      this.editorShow = false
    },
    async finish(imageData) {
      this.editorShow = false

      const userImgURL = await generateOutputImage(imageData, {width: 1024, height: 1024, part: this.selectedOptions.currentPart})

      const txtures = await loadTexture({
        map: {
          options: {
            repeat: [5, 5],
            flipY: false,
            offset: this.selectedOptions.currentPart === 'vamp' ? [0.6, -0.18] : [0, 0.25],
          },
          image_url: userImgURL,
        },
        normalMap: {
          options: {
            repeat: [28, 28],
          },
          image_url: 'https://pic.bbtkids.cn/FiQvFit0mQcImJR_W_YBXxlrAetl',
        },
      })

      let new_params = {
        ...txtures,
      }
      setMaterial(this.theModel.children[0], this.selectedOptions.currentPart, new_params, this.selectedOptions.currentType)
    },
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  position: fixed;
  top: 0;
  left: 0;

  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  z-index: 100;
}

.image-win {
  position: relative;
  width: 95%;
  height: 95%;
  border-radius: 2px;
}
</style>
