<style scoped>
.wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.65);
}

.close {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 60px;
  right: 20px;
  width: 50px;
  height: 50px;
  color: #ccc;
  font-size: 30px;
  border-radius: 50%;
  background: rgba(50, 50, 50, 1);
}
.font-win {
  position: absolute;
  top: 20vh;
  color: #fff;
  text-align: center;
}
.win__title {
  font-size: 20px;
  font-family: PingFangSC-Semibold, PingFangTC-Semibold, PingFangHK-Semibold, sans-serif;
  font-weight: bolder;
}
.win__desc {
  margin-top: 10px;
  color: rgba(245, 245, 245, 0.8);
}

.input__wrapper {
  display: flex;
  align-content: center;
  margin-top: 32px;
}
.input__el {
  flex: 1;
  width: 50%;
  margin: 0 10px;
}
.custom-font {
  padding: 0 10px;
  height: 50px;
  width: 100%;
  color: #fff;
  text-align: center;
  border-radius: 10px;
  border: 2px solid #fff;
  background: transparent;
}
.custom-font::-webkit-input-placeholder {
  color: #ccc;
}
.win__label {
  display: block;
  margin-top: 4px;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px auto 0;
  width: 100px;
  height: 40px;
  color: #000;
  border-radius: 20px;
  background: #fff;
}
.btn.disabled {
  background: #999;
}
</style>

<template>
  <van-overlay :show="fontCustomizerShow">
    <div class="wrapper" @click.stop>
      <div class="close" @click.stop="close"><van-icon name="cross" /></div>
      <div class="font-win">
        <div class="win__title">鞋跟文字</div>
        <div class="win__desc">数字与大写字母</div>
        <div class="input__wrapper">
          <div class="input__el">
            <input id="l" class="custom-font" v-model="selectedOptions.customFontL" type="text" placeholder="ABC123" maxlength="5" />
            <label class="win__label" for="l">左</label>
          </div>
          <div class="input__el">
            <input id="r" class="custom-font" v-model="selectedOptions.customFontR" type="text" placeholder="ABC123" maxlength="5" />
            <label class="win__label" for="r">右</label>
          </div>
        </div>
        <div class="btn" :class="{ disabled: !customFont }" @click="save">完成</div>
      </div>
    </div>
  </van-overlay>
</template>

<script>
import { Dialog } from 'vant'

import { createNamespacedHelpers } from 'vuex'
const { mapState, mapGetters, mapActions } = createNamespacedHelpers('customizer')

export default {
  data() {
    return {
      inputValueL: '',
      inputValueR: ''
    }
  },
  computed: {
    ...mapState(['fontCustomizerShow', 'selectedOptions', 'options']),
    ...mapGetters(['customFont'])
  },
  watch: {
    fontCustomizerShow(val) {
      if (val) {
        console.log('open')
        this.inputValueL = this.selectedOptions.customFontL
        this.inputValueR = this.selectedOptions.customFontR
      }
    },
    'selectedOptions.customFontR'(val) {
      this.selectedOptions.customFontR = val.replace(/[\W]/g, '').toUpperCase()
    },
    'selectedOptions.customFontL'(val) {
      this.selectedOptions.customFontL = val.replace(/[\W]/g, '').toUpperCase()
    },
    immediate: true
  },
  methods: {
    ...mapActions(['toggleCustomizer', 'clearCustomFont', 'setOptionsState', 'setOption']),
    close() {
      let p
      let clear = true,
        restore = false
      if (this.customFont) {
        if (this.inputValueL === this.selectedOptions.customFontL && this.inputValueR === this.selectedOptions.customFontR) {
          // 输入过文字，和上次一样
          clear = false
          p = Promise.resolve()
        } else {
          // 输入过文字，和上次不一样
          p = Dialog.confirm({
            message: '关闭页面会清空文字，确认关闭么？'
          })
        }
      } else {
        if (this.inputValueL || this.inputValueR) {
          // 没有输入文字，上次有文字
          clear = false
          restore = true
          p = Dialog.confirm({
            message: '将会还原上次的文字，确认关闭么？'
          })
        } else {
          // 没有输入文字，上次没有文字
          p = Promise.resolve()
        }
      }

      p.then(() => {
        console.log(clear)
        if (restore) {
          this.selectedOptions.customFontL = this.inputValueL
          this.selectedOptions.customFontR = this.inputValueR
        }
        if (clear) {
          this.clearCustomFont()
          this.setOptionsState({
            font: 1
          })
        }
        this.toggleCustomizer({ type: 'font', flag: false })
      })
    },
    save() {
      if (!this.customFont) return
      if (!this.selectedOptions.font) {
        let fontObj = this.options.filter(one => one.part === 'font')[0]
        if (fontObj) {
          let typeOpt = (fontObj.optionList || []).filter(one => one.optionType === 'customFont')[0]
          if (typeOpt) {
            this.setOption({
              part: 'font',
              type: 'customFont',
              option: typeOpt.options[0]
            })
          }
        }
      }
      this.toggleCustomizer({ type: 'font', flag: false })
    }
  }
}
</script>
