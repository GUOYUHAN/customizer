<template>
  <van-overlay :show="imageCustomizerShow && fileSelected">
    <input v-show="false" ref="fileRef" type="file" id="userFile" @change="fileChange" />

    <div class="wrapper">
      <div class="image-win" id="image-win" v-if="imageCustomizerShow">
        <div class="customizer-svg" :class="selectedOptions.currentPart === 'vamp' ? 'vamp' : 'quarters'"></div>
      </div>
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
import {getFileSize} from '../utils/customizer/imageTools'


export default {
  data() {
    return {
      fileSelected: false,
      fileCancel: false,
      w: 0,
      h: 0,
    }
  },
  computed: {
    ...mapState(['imageCustomizerShow', 'selectedOptions', 'theModel']),
  },
  watch: {
    imageCustomizerShow: {
      handler(newVal, oldVal) {
        if (newVal) {
          console.log('imageCustomizerShow')
          this.onUploadClick()
        }
      },
    },
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
              console.log('cancellalalal')
              this.toggleCustomizer({ type: 'image', flag: false })
            }
          }, 500)
        },
        { once: true }
      )
    },
    fileChange(e) {
      const file = e.target.files[0]

      console.log('file change', file)

      this.fileCancel = false
      this.fileSelected = true

      getFileSize(file).then((res) => {
        let {width: imgW, height: imgH} = res

        const pintura = appendDefaultEditor('#image-win', {
          src: file,
          resizeSizePresetOptions: [
            [undefined, 'Auto'],
            [[128, 128], 'Small'],
            [[512, 512], 'Medium'],
            [[1024, 1024], 'Large'],
          ],
          cropEnableImageSelection: false,
          imageCropLimitToImage: false,
          imageCropAspectRatio: 1.5,
        })

        let manifest = 0
        pintura.on('loadpreview', (imageData) => {
          console.log('loadpreview', imageData) // imageData
          manifest = 100
        })

        pintura.on('load', (e) => {
          // e.size.width = imgW
          // e.size.height = imgH
        })

        pintura.on('update', (e) => {
          if (!e.crop) return
          if (imgW < 0) return
          if (manifest >= 100) {
            console.log('update', e)
            // e.crop = {x: 40, y: -93, width: 619, height: 478}
            return
          }
          console.log('update', e)
          if (manifest === 0) {
            e.imageSize = {
              width: imgW,
              height: imgH
            }
            // e.crop = {x: 0, y: 0, width: 723, height: 482}
            e.crop = {x: 0, y: 0, width: 750, height: 500}
            console.log(e, '>>>>>>>')
            // manifest = 1
          } else if (manifest === 1) {
            console.log(e, '<<<<<<<')
            manifest = 2
          }
        })

        pintura.on('process', async (imageState) => {
          // new ObjectUrl(imageState.dest)

          let c = document.createElement('canvas')
          c.width = 1024
          c.height = 1024
          const userCanvas = await this.imageProcess(imageState, c, this.selectedOptions.currentPart)
          const userImgURL = userCanvas.toDataURL('image/jpeg')
          // console.log(userImgURL)

          // TODO
          document.querySelector('#before').src = URL.createObjectURL(imageState.dest)
          document.querySelector('#after').src = userImgURL

          const txtures = await loadTexture({
            map: {
              options: {
                repeat: [5, 5],
                flipY: false,
                offset: this.selectedOptions.currentPart === 'vamp' ? [0.6, -0.2] : [0, 0.25],
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
          document.getElementById('userFile').value = ''
          this.fileSelected = false
          this.toggleCustomizer({ type: 'image', flag: false })
        })
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
              ctx.drawImage(img, 0, 391.5, 1024, (1024 / this.width) * this.height)
              ctx.fillStyle = '#fff'
              ctx.fillRect(0, 391.5, c.width, 241)
            }
            resolve(c)
          }
        }
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
  display: flex;
  justify-content: center;
  align-items: center;
}

.customizer-svg {
  position: absolute;
  top: 15vh;
  width: 100%;
  height: 100%;
  transform: scale(0.6, 0.6);
  opacity: 0.6;
  z-index: 4;
  pointer-events: none;
}
.customizer-svg.vamp {
  background: url('https://pic.wanwustore.cn/ww_customizer/vamp.svg') no-repeat;
}
.customizer-svg.quarters {
  background: url('https://pic.wanwustore.cn/ww_customizer/quarters.svg') no-repeat;
}

::v-deep(.PinturaRoot) {
  background: #fff !important;
}
</style>
