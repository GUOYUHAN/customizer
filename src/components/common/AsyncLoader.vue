<style lang="scss" scoped>
.queue__panel {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 50px 40px;
  width: 100%;
  height: 100%;
  text-align: center;
  background: #fff;
  z-index: 2;
}

.queue__title {
  font-size: 20px;
  font-family: PingFangSC-Medium, PingFangTC-Medium, PingFangHK-Medium, sans-serif;
  font-weight: bold;
  margin-top: 30vh;
}

.queue__txt {
  margin-top: 16px;
  font-size: 1em;
}

.queue__process {
  position: relative;
  margin-top: 32px;
  height: 10px;
  border-radius: 11px;
  background: #eee;
}

.queue__process__now {
  position: absolute;
  top: 0;
  left: 0;
  height: 10px;
  border-radius: 11px;
  background: #f95555;
  // transition-property: width;
  // transition: width 0.2s;
}
</style>

<template>
  <div class="queue__panel" v-if="show">
    <div class="queue__title">{{ parseInt(percentage) }}%...</div>
    <div class="queue__txt">资源正在努力记载中，请勿离开！</div>
    <div class="queue__process">
      <div class="queue__process__now" :style="asyncStyle"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: Boolean,
    percentage: Number
  },
  computed: {
    asyncStyle() {
      if (!this.show) return ''
      let width = this.percentage + '%'
      let transitionDuration = (100 - this.percentage) / 100 + 's'
      if (width === '100%') {
        transitionDuration = '0.2s'
      }
      return `width: ${width};`
      // return `width: ${width};-webkit-transition-duration: ${transitionDuration};transition-duration: ${transitionDuration}`
    }
  }
}
</script>
