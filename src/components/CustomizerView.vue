<style scoped>
#view {
  flex: 1;
}
</style>

<template>
  <div id="view">
    {{ selectedOptions }}
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('customizer')

export default {
  computed: {
    ...mapState(['selectedOptions']),
  },
}
</script>
