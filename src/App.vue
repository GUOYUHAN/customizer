<style lang="scss">
html,
body {
  height: 100%;
}
#app {
  width: 100%;
  height: 100%;
}
</style>

<template>
  <div id="app">
    <w-customizer />
  </div>
</template>

<script>
import './styles/app.css'
import 'vant/lib/index.css'
import WCustomizer from './components/WCustomizer'

export default {
  name: 'App',
  components: {
    WCustomizer
  }
}
</script>
