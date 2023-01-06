<template>
  <van-overlay :show="imageCustomizerShow && fileSelected">
    <input v-show="false" ref="fileRef" type="file" id="userFile" @change="fileChange" />

    <div class="wrapper" :style="[{ '--bg': svgStyle }]">
      <div class="image-win" id="image-win" v-if="imageCustomizerShow"></div>
    </div>
  </van-overlay>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapActions } = createNamespacedHelpers('customizer')

import { appendDefaultEditor } from '../utils/pintura/pintura.js'
import '../utils/pintura/pintura.css'
import { loadTexture } from '../utils/customizer/load.js'
import { setMaterial } from '../utils/utils.js'
import { getFileSize, getCropProperty } from '../utils/customizer/imageTools'

import svgList from '../data/svgList.json'

export default {
  data() {
    return {
      fileSelected: false,
      fileCancel: false,
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
    imageCustomizerShow: {
      handler(newVal, oldVal) {
        if (newVal) {
          console.log('imageCustomizerShow')
          this.onUploadClick()
        }
      }
    }
  },
  mounted() {},
  methods: {
    ...mapActions(['toggleCustomizer', 'setOption']),
    onUploadClick() {
      this.fileCancel = true
      this.$refs.fileRef.dispatchEvent(new MouseEvent('click'))
      window.addEventListener(
        'focus',
        () => {
          setTimeout(() => {
            if (this.fileCancel) {
              this.toggleCustomizer({ type: 'image', flag: false })
            }
          }, 500)
        },
        { once: true }
      )
    },
    async fileChange(e) {
      console.log('file change', e.target.files[0])
      const file = e.target.files[0]

      this.fileCancel = false
      this.fileSelected = true
      const { width: imgW, height: imgH } = await getFileSize(file)
      const { cropRatio, cropX, cropY, cropW, cropH } = getCropProperty({ imgW, imgH, cropRatio: this.svgRatio })

      const pintura = appendDefaultEditor('#image-win', {
        src: e.target.files[0],
        imageBackgroundColor: [255, 255, 255],

        cropEnableInfoIndicator: true,
        cropEnableRotateMatchImageAspectRatio: 'always',

        cropEnableImageSelection: false,
        imageCropLimitToImage: false,
        imageCropAspectRatio: cropRatio
      })

      let manifest = 0
      pintura.on('loadpreview', imageData => {
        manifest = 100
      })
      pintura.on('update', e => {
        if (!e.crop) return
        if (imgW < 0) return
        if (manifest >= 100) return
        // console.log('update', e)
        if (manifest === 0) {
          e.crop = { x: cropX, y: cropY, width: cropW, height: cropH }
        }
      })

      pintura.on('process', async imageState => {
        let c = document.createElement('canvas')
        c.width = 1024
        c.height = 1024
        const userCanvas = await this.imageProcess(imageState, c, this.selectedOptions.currentPart)
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
        this.fileSelected = false
        this.toggleCustomizer({ type: 'image', flag: false })
      })
    },
    imageProcess(imageState, c, part) {
      return new Promise((resolve, reject) => {
        let ctx = c.getContext('2d')
        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 0, c.width, c.height)
        let reader = new FileReader()
        reader.readAsDataURL(imageState.dest)
        reader.onload = function (r) {
          let img = new Image()
          img.src = r.target.result
          img.onload = function () {
            if (part === 'vamp') {
              ctx.drawImage(img, 0, 0, 1024, (1024 / this.width) * this.height)
            } else if (part === 'quarters') {
              ctx.drawImage(img, 0, 0, 1024, (1024 / this.width) * this.height)
              ctx.drawImage(img, 0, 633, 1024, (1024 / this.width) * this.height)
              ctx.fillStyle = '#fff'
              ctx.fillRect(0, 391, c.width, 242)
            }
            resolve(c)
          }
        }
      })
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
  padding: 20px;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.customizer-svg {
  position: absolute;
  top: 33vh;
  width: 60%;
  height: 60%;
  opacity: 0.6;
  z-index: 4;
  pointer-events: none;
}

::v-deep(.PinturaStage) {
  background: var(--bg);
}

::v-deep(.PinturaRoot) {
  background: #fff !important;
}
</style>
