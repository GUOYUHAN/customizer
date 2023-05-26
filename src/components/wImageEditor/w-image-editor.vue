<style scoped>
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #f1f2f4;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  height: 60px;
  font-size: 14px;
  font-weight: bold;
}
.main {
  position: relative;
  flex: 1;
  margin: auto;
  width: 95%;
  background: no-repeat center;
}
.footer {
  height: 80px;
}
.toolbar {
  display: flex;
  align-items: center;
  padding: 0 16px;
  width: 100%;
  height: 66px;
  background: #fff;
}

/* top */
.close {
  color: #454545;
  font-size: 18px;
}
.finish {
  color: #232323;
}

/* main */
.overlay {
  position: absolute;
  margin: auto;
  z-index: 1;
  touch-action: none;
  pointer-events: none;
}

/* toobar */
.tool {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20%;
  /* height: 100%; */
  text-align: center;
  color: #666;
}
.tool--active {
  color: #232323;
  font-weight: bold;
}
.tool--active:after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -6px;
  margin: auto;
  width: 5px;
  height: 5px;
  border-radius: 5px;
  background: #555;
}

/* footer */
.tab-panel {
  width: 100%;
  height: 100%;
}
.tab-pabel__flex {
  display: flex;
  align-items: center;
  justify-content: center;
}
/* 翻转 */
.btn__flip {
  width: 36px;
  height: 36px;
  background: no-repeat center/100%;
}
.btn__flip:not(:last-child) {
  margin-right: 40px;
}
.flip-x {
  background-image: url('https://pic.bbtkids.cn/FkF4_WV-ZIALZhXBOPqIV3r28hur');
}
.flip-y {
  background-image: url('https://pic.bbtkids.cn/FnxHJlsZ-wBM0yNfxBhNWRcm9zcH');
}
/* 旋转 */
.angle-bar {
  padding: 0 40px;
  height: 30px;
}
.angle {
  text-align: center;
  color: #787878;
  font-size: 13px;
}
.angle-progress {
  margin-top: 8px;
}
.rang-button {
  width: 6px;
  height: 20px;
  border-radius: 3px;
  background: #888;
}
.rotate-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px;
  height: 20px;
}
.btn__rotate {
  flex: 1;
  text-align: center;
  color: #888;
  font-size: 13px;
}
</style>

<template>
  <div class="container">
    <header class="header">
      <div class="close" @click.stop="close"><van-icon name="cross" /></div>

      <div class="finish" @click.stop="finish">完成</div>
    </header>

    <main class="main">
      <canvas id="c"></canvas>
      <div class="overlay" :style="[overlayStyle]"></div>
    </main>
    <footer class="footer">
      <div class="tab-panel tab-pabel__flex" v-show="curOp === 'flip'">
        <div class="btn__flip flip-x" @click="flipImage('X')"></div>
        <div class="btn__flip flip-y" @click="flipImage('Y')"></div>
      </div>
      <div class="tab-panel" v-show="curOp === 'rotate'">
        <!-- <div class="angle-bar">
          <p class="angle">{{ rotation }}°</p>
          <van-slider class="angle-progress" v-model="rotation" @input="setImageAngle" :min="0" :max="360" :step="1" bar-height="2px" active-color="#888">
            <template #button>
              <div class="rang-button"></div>
            </template>
          </van-slider>
        </div> -->
        <div class="rotate-footer">
          <div class="btn__rotate" @click="setImageAngle(rotation - 90)">逆时针 90 °</div>
          <div class="btn__rotate" @click="setImageAngle(0)">重置</div>
        </div>
      </div>
    </footer>
    <footer class="toolbar">
      <div v-for="(o, i) in tools" :key="i" class="tool" :class="{ 'tool--active': curOp === o.type }" @click="changeTool(o)">{{ o.label }}</div>
    </footer>
  </div>
</template>

<script>
import { fabric } from 'fabric'
import Hammer from 'hammerjs'
import { calcImageSize, calcOverlayImageSize, resizeImage } from '../../utils/image/image'

export default {
  data() {
    return {
      curOp: 'flip',
      tools: [
        {
          type: 'flip',
          label: '翻转'
        },
        {
          type: 'rotate',
          label: '旋转'
        }
      ],

      container: null,
      containerSize: null,

      canvasDOM: null,
      canvas: null,
      mc: null,

      maxScale: 100,
      minScale: 0,
      rotation: 0,
      img: null,
      outputSize: null,

      overlayImg: ''
    }
  },
  computed: {
    overlayStyle() {
      if (this.outputSize) {
        let { top, left, width, height } = this.outputSize
        return {
          top: top + 'px',
          left: left + 'px',
          width: width + 'px',
          height: height + 'px',
          background: `url(${this.overlayImg}) no-repeat center/100% 100%`
        }
      }
      return null
    }
  },
  methods: {
    changeTool(o) {
      this.curOp = o.type
    },

    // 设置预览效果（svg）
    setOverlayImage(overlayObj) {
      this.overlayImg = overlayObj.url
      let { outputSize } = calcOverlayImageSize(overlayObj, this.containerSize)
      console.log(outputSize)
      this.outputSize = outputSize
    },

    // 重置图片
    resetImage() {
      let { scale } = calcImageSize(this.img, this.outputSize)
      this.img.center()
      this.img.scale(scale)
      this.img.set('flipY', false)
      this.img.set('flipX', false)
      this.rotation = 0
      this.setImageAngle(0)
    },

    // 缩放：正数放大，负数缩小，缩放比例固定
    scaleImage(diff) {
      let { scaleX } = this.img
      let scale = scaleX
      scale *= 1 + (diff > 0.02 ? 0.02 : diff < -0.02 ? -0.02 : diff)
      scale = scale > this.maxScale ? this.maxScale : scale < this.minScale ? this.minScale : scale
      this.img.scale(scale)
      this.canvas.requestRenderAll()
    },

    _handleAngle(angle) {
      if (angle < 0) {
        angle = 360 + angle
      } else if (angle > 360) {
        angle = angle % 360
      }
      return angle | 0
    },

    // 旋转
    setImageAngle(angle) {
      if (angle !== undefined) {
        this.rotation = this._handleAngle(angle)
      }
      this.img.rotate(this.rotation)
      this.canvas.requestRenderAll()
    },

    // 旋转
    rotateImage(diff) {
      let { angle } = this.img
      angle += diff > 2 ? 2 : diff < -2 ? -2 : diff
      this.rotation = this._handleAngle(angle)
      this.img.rotate(angle)
      this.canvas.requestRenderAll()
    },

    // 翻转
    flipImage(direction = 'X') {
      direction = direction.toUpperCase()
      this.img.toggle(`flip${direction}`)
      this.canvas.requestRenderAll()
    },

    close() {
      this._dispose()
      this.$emit('close')
    },

    // 导出图片
    finish() {
      const dataURL = this.canvas.toDataURL({
        ...this.outputSize,
        format: 'png'
      })

      this.$emit('finish', {
        ...this.outputSize,
        dataURL
      })
    },

    // 主方法：初始化图片编辑
    openImageEditor(imgUrl, options = {}) {
      // 原来存在实例，则清除实例
      if (this.canvas) {
        this._dispose()
      }
      this._initComp()

      options.overlayObj && this.setOverlayImage(options.overlayObj)
      this._initializeCanvas()
      this._initializeGestures()
      this._initializeImage(imgUrl)
    },

    // 初始化 canvas
    _initializeCanvas() {
      this.canvas = new fabric.Canvas(this.canvasDOM, {
        selection: false,
        // centeredScaling: true,
        centeredRotation: true,
        backgroundColor: '#f3f3f3'
      })
      this._initializeEvent()
    },

    // 给 canas 添加事件
    _initializeEvent() {
      this.canvas.on({
        // 通过当前缩放比例决定缩放极限
        // 跟进图片、裁片尺寸设置可移动边界
        'after:render': () => {
          if (this.img) {
            let scale = this.img.scaleX
            this.maxScale = 5 * scale
            this.minScale = scale / 5

            this.canvas.off('after:render')
          }
        },
        // 限制缩放极限
        'object:scaling': e => {
          let scale = e.target.scaleX
          scale = Math.min(scale, this.maxScale)
          scale = Math.max(scale, this.minScale)
          this.img.scale(scale)
          this.canvas.requestRenderAll()
        },
        // 旋转图片时同步滑动条
        'object:rotating': e => e.target && (this.rotation = e.target.angle),
        // 始终保持图片的聚焦
        'mouse:down': e => !e.target && this.canvas.setActiveObject(this.img)
      })
    },

    // 手势监听 —— 缩放
    _initializeGestures() {
      const self = this
      const canvas = document.querySelector('.upper-canvas', '.main')
      const mc = (this.mc = new Hammer(canvas))

      const state = {
        scale: 0,
        rotation: 0,
        scaling: false,
        rotating: false
      }
      let diffS
      let diffR

      mc.get('pinch').set({ enable: true })
      mc.get('rotate').set({ enable: true })
      mc.on('pinchstart pinchend pinchmove rotatemove', e => {
        let { scale, rotation } = e
        switch (e.type) {
          case 'pinchstart':
            self.img.lockMovementX = true
            self.img.lockMovementY = true
            state.scale = scale
            state.rotation = rotation
            break
          case 'pinchend':
            setTimeout(() => {
              self.img.lockMovementX = false
              self.img.lockMovementY = false
            }, 200)
            break
          case 'pinchmove':
            diffS = scale - state.scale
            self.scaleImage(diffS)
            state.scale = scale
            break
          case 'rotatemove':
            diffR = rotation - state.rotation
            this.rotateImage(diffR)
            state.rotation = rotation
            break
        }
      })
    },

    // 加载图片
    _initializeImage(imgUrl, options = {}) {
      if (this.img) {
        this.canvas.remove(this.img)
      }

      // 预处理图片，将图片重新绘制成符合 canvas 尺寸的大小
      new Promise(resolve => {
        fabric.util.loadImage(imgUrl, resolve)
      })
        .then(img => {
          return resizeImage(img, this.outputSize)
        })
        .then(nImgUrl => {
          this._loadImage(nImgUrl, options)
        })
    },

    _loadImage(imgUrl, options = {}) {
      fabric.Image.fromURL(
        imgUrl,
        img => {
          let { scale } = calcImageSize(img, this.outputSize)
          img.scale(scale)
          img.setControlsVisibility({
            mb: false,
            ml: false,
            mr: false,
            mt: false
          })
          this.canvas.add(img).setActiveObject(img)
          img.center()
          this.img = img
        },
        {
          originX: 'center',
          originY: 'center',
          selectable: false,
          lockUniScaling: true,
          lockScalingFlip: true,
          // borderScaleFactor: 1.5,
          transparentCorners: false,
          cornerColor: '#fff',
          borderColor: '#666',
          cornerStrokeColor: '#666',
          ...options
        }
      )
    },

    // 初始化组件容器
    _initComp() {
      this.canvasDOM = document.querySelector('#c')
      this.container = this.canvasDOM.parentNode
      let { width, height } = (this.containerSize = this.container.getBoundingClientRect())
      this.canvasDOM.width = width
      this.canvasDOM.height = height

      fabric.Object.prototype.objectCaching = false
    },
    _dispose() {
      this.img && this.canvas.remove(this.img)
      this.canvas.off()
      this.canvas.clear()
      this.canvas.dispose()
      this.canvas = null
      this.img = null
      this.mc = null
    }
  },
  dispose() {
    this._dispose()
  }
}
</script>
