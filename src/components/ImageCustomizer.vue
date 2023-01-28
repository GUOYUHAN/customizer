<template>
  <van-overlay :show="imageCustomizerShow && fileSelected">
    <input v-show="false" ref="fileRef" type="file" id="userFile" @change="fileChange" accept="image/*" />

    <div class="wrapper" :style="[{ '--bg': svgStyle }]">
      <div class="image-win" id="image-win" v-if="fileSelected">
        <div class="top-nav">
          <div class="current-step">{{ step + '. ' + selectedOptions.currentPart }}</div>
        </div>

        <div class="w-editor" v-if="step === '1'"><div class="w-editor__container" id="w-editor__container"></div></div>

        <div class="confirm" v-if="step === '2'">确认你的设计</div>

        <div class="next-step" @click="step === '1' ? next() : confirm()">{{ step === '1' ? '下 一 步 ->' : '完成' }}</div>
      </div>
    </div>
  </van-overlay>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapActions } = createNamespacedHelpers('customizer')

import { appendDefaultEditor, processImage } from '../utils/pintura/pintura.js'
import '../utils/pintura/pintura.css'
import { loadTexture } from '../utils/customizer/load.js'
import { setMaterial } from '../utils/utils.js'
import { imageProcess, checkBoundingBox, getFileSize, getCropProperty } from '../utils/customizer/imageTools'

import svgList from '../data/svgList.json'
import { Dialog } from 'vant'

export default {
  data() {
    return {
      pintura: null,
      fileSelected: false,
      fileCancel: false,
      step: '1',
      imgW: 0,
      imgH: 0,
      size: ''
    }
  },
  computed: {
    ...mapState(['imageCustomizerShow', 'selectedOptions', 'theModel']),
    svgUrl() {
      return svgList[0][this.selectedOptions.currentPart]?.url || ''
    },
    svgRatio() {
      return svgList[0][this.selectedOptions.currentPart].width / svgList[0][this.selectedOptions.currentPart].height
    },
    svgStyle() {
      return `url(${this.svgUrl}) no-repeat center/100% auto`
    }
  },
  watch: {
    imageCustomizerShow(val) {
      console.log('show', val)
      if (val) {
        this.onUploadClick()
      }
    },
    immediate: true
  },
  mounted() {},
  methods: {
    ...mapActions(['toggleCustomizer', 'setOption']),
    onUploadClick() {
      if (!this.fileSelected) {
        this.fileCancel = true
        this.$refs.fileRef.dispatchEvent(new MouseEvent('click'))
        this.toggleCustomizer({ type: 'image', flag: false })
      }
      // this.fileCancel = true
      // this.$refs.fileRef.dispatchEvent(new MouseEvent('click'))
      // window.addEventListener(
      //   'focus',
      //   () => {
      //     alert('focus')
      //     setTimeout(() => {
      //       if (this.fileCancel && !this.fileSelected) {
      //         this.fileCancel = false
      //         document.getElementById('userFile').value = ''
      //         this.toggleCustomizer({ type: 'image', flag: false })
      //       }
      //     }, 700)
      //   },
      //   { once: true }
      // )
    },
    async fileChange(e) {
      console.log('file change', e.target.files[0])
      const file = e.target.files[0]
      this.toggleCustomizer({ type: 'image', flag: true })

      this.fileCancel = false
      this.fileSelected = true
      let fileSize = await getFileSize(file)
      this.imgW = fileSize.width
      this.imgH = fileSize.height

      this.createEditor(file)
    },
    createEditor(file) {
      const { cropRatio, cropX, cropY, cropW, cropH } = getCropProperty({ imgW: this.imgW, imgH: this.imgH, cropRatio: this.svgRatio })

      this.pintura = appendDefaultEditor('#w-editor__container', {
        src: file,
        imageBackgroundColor: [255, 255, 255],

        cropEnableInfoIndicator: true,
        cropEnableRotateMatchImageAspectRatio: 'always',

        cropEnableImageSelection: false,
        imageCropLimitToImage: false,
        imageCropAspectRatio: cropRatio,

        utils: ['crop', 'filter', 'finetune', 'annotate', 'frame'],
        enableButtonRevert: false,
        enableButtonExport: false
      })

      let manifest = 0
      this.pintura.on('loadpreview', imageData => {
        manifest = 100
      })
      this.pintura.on('update', e => {
        // console.log(e.crop)
        if (!e.crop) return
        if (this.imgW < 0) return
        if (manifest >= 100) return
        if (manifest === 0) {
          e.crop = { x: cropX, y: cropY, width: cropW, height: cropH }
        }
      })
    },
    next() {
      let d = Promise.resolve()

      const params = {
        W: this.imgW,
        H: this.imgH,
        cropW: this.pintura.imageCropSize.width,
        cropH: this.pintura.imageCropSize.height,
        x: this.pintura.imageState.crop.x,
        y: this.pintura.imageState.crop.y,
        deg: this.pintura.imageState.rotation
      }

      if (!checkBoundingBox(params)) {
        d = Dialog.confirm({
          message: '看起来您的设计没有填满模板或已超出范围,您可以后退并使用工具移动或缩放您的设计来填满模板或者选择维持原样，由您决定！'
        })
      }

      d.then(() => {
        this.pintura.processImage().then(async imageState => {
          let c = document.createElement('canvas')
          c.width = 1024
          c.height = 1024
          const userCanvas = await imageProcess(imageState, c, this.selectedOptions.currentPart)
          const userImgURL = userCanvas.toDataURL('image/jpeg')
          const txtures = await loadTexture({
            map: {
              options: {
                repeat: [5, 5],
                flipY: false,
                offset: this.selectedOptions.currentPart === 'vamp' ? [0.6, -0.18] : [0, 0.25]
              },
              image_url: userImgURL
            },
            normalMap: {
              options: {
                repeat: [28, 28]
              },
              image_url: 'https://pic.bbtkids.cn/FiQvFit0mQcImJR_W_YBXxlrAetl'
            }
          })

          let new_params = {
            ...txtures
          }
          setMaterial(this.theModel.children[0], this.selectedOptions.currentPart, new_params, this.selectedOptions.currentType)

          document.getElementById('userFile').value = ''
          this.step = '2'
        })
      })
    },
    confirm() {
      this.fileSelected = false
      this.toggleCustomizer({ type: 'image', flag: false })
      this.step = '1'
    }
  }
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
  position: relative;
  width: 90%;
  max-width: 480px;
  height: 90%;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.top-nav {
  width: 100%;
  height: 5%;
  border-bottom: 1px solid rgb(200, 200, 200);
  display: flex;
  justify-content: center;
  align-items: center;
}

.current-step {
  font-weight: 600;
}

.w-editor {
  width: 100%;
  height: 85%;
  padding: 20px;
}

.w-editor__container {
  width: 100%;
  height: 100%;
}

.next-step {
  width: 100%;
  height: 7%;
  background: #c9192e;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5em;
  font-weight: 500;
  color: #fff;
}

.confirm {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2em;
  font-weight: 600;
}

::v-deep(.PinturaStage) {
  background: var(--bg);
  // transform: scaleX(-1);
}

::v-deep(.PinturaRoot) {
  background: #fff !important;
  // overflow: auto !important;
}
</style>
