<style scoped lang="scss">
.op-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: env(safe-area-inset-bottom);
  width: 100%;
  height: 260px;
  border-radius: 30px 30px 0 0;
  box-shadow: 0 0 10px rgba(200, 200, 200, 0.7);
  background-color: #fff;
  z-index: 1;
  touch-action: none;
}

.part {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 60px;
  font-size: 20px;
  font-weight: bold;
}
.part-name {
  width: 60%;
  text-align: center;
}
.part-prev,
.part-next {
  width: 60px;
  height: 60px;
  background: no-repeat center/32px;
}
.part-prev {
  background-image: url('https://pic.bbtkids.cn/FqTDW2nECuK7TiVy7mvE9PTS_HH0');
}
.part-next {
  background-image: url('https://pic.bbtkids.cn/FkAHg-muuLIdaSMzEZ0SQ9Gx6X5_');
}

.op-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}
.slide-enter,
.slide-leave-to {
  opacity: 0;
  margin-left: 100px;
}

.type-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
}
.type-empty {
  height: 30px;
}
.type__el {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 5px;
  width: 100px;
  height: 36px;
  color: #555;
  border-radius: 20px;
  border: 1px solid #aaa;
  cursor: pointer;
}
.type__el.active {
  color: #000;
  font-family: PingFangSC-Medium, PingFangTC-Medium, PingFangHK-Medium, sans-serif;
  font-weight: bold;
  border-color: #000;
}

.option-list {
  margin-top: 6px;
  padding: 0 20px 20px;
  width: 100%;
  text-align: center;
  white-space: nowrap;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
.option__el {
  display: inline-block;
  vertical-align: top;
  margin: 4px 20px 0 0;
}
.option__icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 4px solid #fff;
  background: no-repeat center/cover;
  box-shadow: 0 0 2px 0 #ccc;
}
.option__el.selected .option__icon {
  box-shadow: 0 0 2px 0 #000;
}
.option__name {
  margin: 5px 0 0;
  color: #555;
  font-size: 12px;
}
.option__el.selected .option__name {
  color: #000;
  font-family: PingFangSC-Medium, PingFangTC-Medium, PingFangHK-Medium, sans-serif;
  font-weight: bold;
}
</style>

<template>
  <div class="op-bar">
    <div class="part">
      <div class="part-prev" @click="changePartIndex(-1)"></div>
      <div class="part-name">{{ currentPartTitle }}</div>
      <div class="part-next" @click="changePartIndex(1)"></div>
    </div>
    <transition name="slide">
      <div v-if="visible" class="op-container">
        <div v-if="currentTypeList.length > 1" class="type-bar">
          <div v-for="(one, i) in currentTypeList" :key="i" class="type__el" :class="{ active: i === currentTypeIndex }" @click="changeTypeIndex(i)">{{ one.name }}</div>
        </div>
        <div v-else class="type-empty"></div>

        <div class="option-list">
          <div v-for="(one, i) in currentOptions" :key="i" class="option__el" :class="{ selected: one.selected }" @click="selectOption(one)">
            <div v-if="one.style" class="option__icon" :style="[one.style]"></div>
            <div v-if="one.name" class="option__name">{{ one.name }}</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapGetters, mapActions } = createNamespacedHelpers('customizer')

export default {
  data() {
    return {
      visible: true,
      currentPartIndex: 0
    }
  },
  computed: {
    ...mapState(['options', 'selectedOptions', 'optionsState']),
    ...mapGetters(['customFont']),
    // 定制部位数量
    partLen() {
      return this.options.length
    },
    // 定制部位最大索引
    partMaxIndex() {
      return this.partLen - 1
    },

    // 当前定制部位
    currentPart() {
      let r = this.currentPartObj
      if (!r) return ''
      return r.part
    },
    // 当前定制部位名称
    currentPartTitle() {
      let r = this.currentPartObj
      if (!r) return ''
      return `${r.partName} ${this.currentPartIndex + 1}/${this.partLen}`
    },
    // 当前部位可定制的项目
    currentPartObj() {
      return this.options[this.currentPartIndex]
    },

    // 当前定制的类别序号
    currentTypeIndex() {
      return this.optionsState[this.currentPart] || 0
    },
    // 当前定制的类别
    currentType() {
      let r = (this.currentTypeList || [])[this.currentTypeIndex]
      if (!r) return ''
      return r.type
    },
    // 当前可定制的类型列表
    currentTypeList() {
      if (!this.currentPartObj) return []
      let optionList = this.currentPartObj.optionList
      return optionList.map(one => ({
        name: one.optionName,
        type: one.optionType
      }))
    },

    // 当前定制类别对应的选项
    currentOptions() {
      if (!this.currentPartObj) return []
      let optionList = this.currentPartObj.optionList
      let option = optionList[this.currentTypeIndex]

      let selectedPart = this.selectedOptions[this.currentPart] || {}
      let selectedOption = selectedPart[this.currentType] || {}
      let selectedId = selectedOption.id

      return option.options.map(one => {
        one.selected = one.id === selectedId

        if (one.icon) {
          one.style = {
            backgroundImage: `url('${one.icon}')`
          }
        } else if (one.value) {
          one.style = {
            backgroundColor: one.value
          }
        }
        return one
      })
    }
  },
  methods: {
    ...mapActions(['toggleCustomizer', 'setOptionsState', 'setOption', 'setCurrent', 'setPart', 'clearCustomFont']),
    // 切换定制部位
    changePartIndex(step) {
      this.visible = false
      let index = this.currentPartIndex
      index += step
      if (index > this.partMaxIndex) {
        index = 0
      } else if (index < 0) {
        index = this.partMaxIndex
      }

      this.currentPartIndex = index
      this.restorePartType()
      setTimeout(() => {
        this.visible = true
      }, 100)
    },
    // 还原当前部位定制的类型
    restorePartType() {
      let index = this.optionsState[this.currentPart] || 0
      this.changeTypeIndex(index, { slient: true })
    },
    // 切换定制类型
    changeTypeIndex(i, opt = {}) {
      // 定制文字
      if (this.currentPart === 'font') {
        this.setCurrent({
          part: this.currentPart,
          type: 'customFont'
        })
        // 清空文字
        if (i === 1) {
          this.clearCustomFont()
        }
        // 设置刺绣文字
        else if (!opt.slient) {
          this.toggleCustomizer({ type: 'font', flag: true })
        }
        // 当前没有文字，且不是手动设置文字操作，此时自动切换到没有文字状态
        else if (!this.customFont) {
          i = 1
        }
      }

      let optionsState = this.optionsState || {}
      optionsState[this.currentPart] = i

      this.setOptionsState(optionsState)
      this.setPart(this.currentPart)
    },
    selectOption(option) {
      // 上传图片
      if (option.customImage) {
        this.setCurrent({
          part: this.currentPart,
          type: 'customImage'
        })
        this.toggleCustomizer({ type: 'image', flag: true })
        return
      }
      this.setOption({
        part: this.currentPart,
        type: this.currentType,
        option
      })
    }
  },
  mounted() {
    this.changePartIndex(0)
  }
}
</script>
