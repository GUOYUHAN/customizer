<style scoped>
#view {
  flex: 1;
  width: 100%;
  height: calc(100vh - 260px);
  top: 0;
  left: 0;
}
#model-container {
  width: 100%;
  height: 100%;
}
</style>

<template>
  <div id="view">
    <!-- {{ selectedOptions }} -->
    <div id="model-container"></div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { initialLoad } from '../utils/customizer/load.js'

const { mapState } = createNamespacedHelpers('customizer')
let scene, ground

export default {
  data() {
    return {
      renderer: null,
      loader: null,
      controls: null
    }
  },
  mounted() {
    this.init()
  },
  computed: {
    ...mapState(['selectedOptions'])
  },
  methods: {
    async init() {
      scene = new THREE.Scene()
      this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / (window.innerHeight - 260), 0.1, 1000)

      this.renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        precision: 'highp'
      })
      this.renderer.setClearColor(0xffffff, 1.0)
      this.renderer.setClearAlpha(0.0)
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.setSize(window.innerWidth, window.innerHeight - 260)
      document.getElementById('model-container').appendChild(this.renderer.domElement)

      // helper
      const axesHelper = new THREE.AxesHelper(10)
      scene.add(axesHelper)

      // lights
      this.renderer.shadowMap.enabled = true
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap // default THREE.PCFShadowMap
      let light = new THREE.DirectionalLight(0xffffff, 0.4)
      light.position.set(0, 2, 0) //default; light shining from top
      light.castShadow = true // default false
      scene.add(light)

      light.shadow.mapSize.width = 2048 // default
      light.shadow.mapSize.height = 2048 // default
      light.shadow.camera.near = 0.5 // default
      light.shadow.camera.far = 500 // default

      let backLight = new THREE.DirectionalLight(0xffffff, 0.2)
      backLight.position.set(-2, 0, 0) //default; light shining from back
      scene.add(backLight)
      let leftLight = new THREE.DirectionalLight(0xffffff, 0.3)
      leftLight.position.set(0, 0, -2) //default; light shining from left
      scene.add(leftLight)
      let rightLight = new THREE.DirectionalLight(0xffffff, 0.2)
      rightLight.position.set(0, 0, 2) //default; light shining from right
      scene.add(rightLight)

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.55)
      scene.add(ambientLight)

      // create ground
      const geometry = new THREE.PlaneGeometry(10000, 10000)
      const material = new THREE.ShadowMaterial({ color: 0x000000, transparent: false })
      material.opacity = 1
      ground = new THREE.Mesh(geometry, material)

      ground.rotation.x = -0.5 * Math.PI
      ground.receiveShadow = true

      scene.add(ground)

      this.camera.position.set(1.5, 1, 3)
      this.camera.lookAt(0, 0.5, 0)
      this.camera.updateProjectionMatrix()

      // Enable this.controls
      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      this.controls.enablePan = true
      this.controls.enableDamping = true
      this.controls.dampingFactor = 0.05
      this.controls.zoomSpeed = 0.5
      this.controls.maxPolarAngle = THREE.MathUtils.degToRad(90)
      this.controls.maxDistance = 7
      this.controls.minDistance = 3
      this.controls.target = new THREE.Vector3(0, 0.5, 0)
      this.controls.update()

      const { models, textures } = await initialLoad()
      for (let i = 0; i < models.length; i++) {
        scene.add(models[i].scene)
      }
      console.log('ignore', textures)
      this.animate()
    },
    animate() {
      this.renderer.render(scene, this.camera)
      requestAnimationFrame(this.animate)
    }
  }
}
</script>
