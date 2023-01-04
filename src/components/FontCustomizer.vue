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
            <input id="l" class="custom-font" v-model="selectedOptions.customFontL" type="text" placeholder="ABC123" onkeyup="value=value.replace(/[\W]/g,'').toUpperCase().slice(0,5)" />
            <label class="win__label" for="l">左</label>
          </div>
          <div class="input__el">
            <input id="r" class="custom-font" v-model="selectedOptions.customFontR" type="text" placeholder="ABC123" onkeyup="value=value.replace(/[\W]/g,'').slice(0,5).toUpperCase()" />
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
  computed: {
    ...mapState(['fontCustomizerShow', 'selectedOptions', 'options']),
    ...mapGetters(['customFont'])
  },
  methods: {
    ...mapActions(['toggleCustomizer', 'clearCustomFont', 'setOptionsState', 'setOption']),
    close() {
      let p
      if (this.customFont) {
        // 输入过文字，弹出用户提示
        p = Dialog.confirm({
          message: '关闭页面会清空文字，确认关闭么？'
        })
      } else {
        // 没有输入文字，直接关闭
        p = Promise.resolve()
      }
      p.then(() => {
        this.clearCustomFont()
        this.setOptionsState({
          font: 1
        })
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
