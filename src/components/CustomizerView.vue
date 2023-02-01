<style scoped>
#view {
  flex: 1;
  width: 100%;
  height: 20%;
  height: -webkit-calc(100vh - 260px);
  height: calc(100vh - 260px);
  top: 0;
  left: 0;
  touch-action: none;
}
#model-container {
  width: 100%;
  height: 100%;
}
.hide-slow {
  width: 220px;
  height: 60px;
  position: absolute;
  top: 33vh;
  left: calc(50% - 110px);
  background: #ffffff;
  color: rgb(0, 0, 0);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2em;
  font-weight: 600;
  animation: hidetip 1s 1;
  animation-fill-mode: both;
  animation-delay: 4s;
  -webkit-animation: hidetip 1s 1;
  -webkit-animation-fill-mode: both;
  -webkit-animation-delay: 4s;
}

@keyframes hidetip {
  from {
    opcity: 1;
  }
  to {
    opacity: 0;
  }
}
@-webkit-keyframes hidetip {
  from {
    opcity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>

<template>
  <div id="view">
    <div id="model-container"></div>
    <div class="hide-slow">拖动鞋子, 360度旋转</div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import * as THREE from 'three'
import CameraControls from 'camera-controls'
import gsap from 'gsap'
import { initialLoad, loadTexture, loadPersonalization } from '../utils/customizer/load.js'
import { setMaterial, getTextCanvas } from '../utils/utils.js'
import { debounce } from '../utils/tools.js'
import API from '../api/api'

const { mapState, mapActions } = createNamespacedHelpers('customizer')
let scene, ground

export default {
  data() {
    return {
      renderer: null,
      loader: null,
      controls: null,
      raycaster: null,
      pointer: new THREE.Vector2(),
      INTERSECTED: null,
      clock: null,
      personalization: null,
      blinkDelay: 4,
      default_vamp_txt: null
    }
  },
  mounted() {
    this.draw()
  },
  computed: {
    ...mapState(['selectedOptions', 'theModel', 'selectedPart', 'arrowClicked'])
  },
  watch: {
    selectedOptions: {
      async handler(newVal, oldVal) {
        console.log('oldVal', oldVal)
        console.log('newVal', newVal)
        let new_params
        if (newVal.currentType === 'color') {
          new_params = {
            map: null,
            normalMap: this.default_vamp_txt.normalMap,
            mesh_options: {
              color: newVal[newVal.currentPart].color.value
            }
          }
        } else if (newVal.currentType === 'image') {
          if (newVal[newVal.currentPart].image.clear) {
            new_params = {
              map: null,
              mesh_options: newVal[newVal.currentPart].image.mesh_options || {}
            }
          } else {
            const txtures = await loadTexture(newVal[newVal.currentPart].image.textures)
            new_params = {
              ...txtures,
              mesh_options: newVal[newVal.currentPart].image.mesh_options || {}
            }
          }
        } else if (newVal.currentType === 'material') {
          if (newVal[newVal.currentPart].material.clear) {
            new_params = {
              map: null,
              normalMap: this.default_vamp_txt.normalMap,
              mesh_options: newVal[newVal.currentPart].material.mesh_options || {}
            }
          } else {
            const txtures = await loadTexture(newVal[newVal.currentPart].material.textures)

            new_params = {
              ...txtures,
              mesh_options: newVal[newVal.currentPart].material.mesh_options || {}
            }
          }
        } else if (newVal.currentType === 'customFont') {
          if (!this.personalization) {
            this.personalization = await loadPersonalization()
            scene.add(this.personalization)
          }
          this.personalization.children[0].traverse(child => {
            if (child.isMesh) {
              child.material.transparent = true
              let text = new THREE.CanvasTexture(getTextCanvas(newVal.customFontR, newVal[newVal.currentPart]?.customFont?.value))
              text.flipY = false
              text.repeat.set(1, 1)
              text.offset.set(0, 0.05)
              child.renderOrder = 1
              child.material.map = text
            }
          })
          return
        } else if (newVal.currentType === 'customImage') {
          return
        }
        setMaterial(this.theModel.children[0], newVal.currentPart, new_params, newVal.currentType)
      },
      deep: true
    },
    selectedPart: {
      handler(newVal, oldVal) {
        if (this.arrowClicked) {
          this.rotateTo(newVal)
        }
        if (this.blinkDelay < 3) {
          debounce(
            () => {
              this.blink(newVal)
            },
            1000,
            {}
          )()
        } else {
          this.blink(newVal)
        }
      }
    }
  },
  methods: {
    ...mapActions(['setTheModel', 'setClickedPartIndex']),
    initRender() {
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
    },
    initScene() {
      scene = new THREE.Scene()

      // helper
      // const axesHelper = new THREE.AxesHelper(10)
      // scene.add(axesHelper)
    },
    initCamera() {
      this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / (window.innerHeight - 260), 0.1, 1000)

      // this.camera.position.set(2.5, 1, 4)
      // this.camera.lookAt(0, 0.5, 0)
      this.camera.updateProjectionMatrix()
    },
    initLight() {
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
    },
    initGround() {
      // create ground
      const geometry = new THREE.PlaneGeometry(10000, 10000)
      const material = new THREE.ShadowMaterial({ color: 0x000000, transparent: false })
      material.opacity = 1
      ground = new THREE.Mesh(geometry, material)

      ground.rotation.x = -0.5 * Math.PI
      ground.receiveShadow = true

      scene.add(ground)
    },
    initControls() {
      // Enable this.controls
      CameraControls.install({ THREE: THREE })
      this.clock = new THREE.Clock()
      this.controls = new CameraControls(this.camera, this.renderer.domElement)

      // note: damping factor may out of date
      this.controls.dampingFactor = 0.03
      this.controls.maxPolarAngle = THREE.MathUtils.degToRad(87)

      this.controls.maxDistance = 7
      this.controls.minDistance = 2
      this.controls.dollySpeed = 0.5
      this.controls.azimuthRotateSpeed = 0.6
      this.controls.polarRotateSpeed = 0.6

      this.controls.setLookAt(2.5, 1, 4, 0, 0.5, 0, false)

      // change user input config
      this.controls.touches.two = CameraControls.ACTION.TOUCH_DOLLY
      this.controls.touches.three = CameraControls.ACTION.NONE
      this.controls.mouseButtons.right = CameraControls.ACTION.NONE
    },
    initRaycaster() {
      this.raycaster = new THREE.Raycaster()
      document.addEventListener('click', this.onPointerClick)
    },
    async draw() {
      this.initRender()
      this.initScene()
      this.initCamera()
      this.initLight()
      // this.initGround()
      this.initControls()
      this.initRaycaster()

      this.default_vamp_txt = await loadTexture({
        normalMap: {
          options: {
            repeat: [28, 28]
          },
          image_url: 'https://pic.bbtkids.cn/FiQvFit0mQcImJR_W_YBXxlrAetl'
        }
      })

      const { models, textures } = await initialLoad()
      this.setTheModel(models[0].scene)
      for (let i = 0; i < models.length; i++) {
        scene.add(models[i].scene)
      }
      this.animate()

      // initial rotation
      const tween = gsap.fromTo(
        this.controls,
        {
          azimuthAngle: -328 * THREE.MathUtils.DEG2RAD
        },
        {
          azimuthAngle: 32 * THREE.MathUtils.DEG2RAD,
          distance: 4.5,
          duration: 3.5,
          ease: 'back.inOut(2.5)',
          paused: true
        }
      )
      tween.play(0)
      this.blinkDelay = 0

      let res = await API.test()
      console.log(res)
    },
    animate() {
      const delta = this.clock.getDelta()
      this.controls.update(delta)
      requestAnimationFrame(this.animate)
      this.renderer.render(scene, this.camera)
    },
    onPointerClick(event) {
      this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1
      this.pointer.y = -(event.clientY / (window.innerHeight - 260)) * 2 + 1

      this.raycaster.setFromCamera(this.pointer, this.camera)
      const intersects = this.raycaster.intersectObjects(scene.children)

      if (intersects.length > 0) {
        if (this.INTERSECTED != intersects[0].object) {
          if (this.INTERSECTED) {
            // change to current object, so need to reset original object
          }

          this.INTERSECTED = intersects[0].object

          // save current object state
          // do something to current object
          this.setClickedPartIndex(this.INTERSECTED.name)
        }
      } else {
        if (this.INTERSECTED) {
          // change to empty space, so need to reset original object
        }
        this.INTERSECTED = null
      }
    },
    rotateTo(part) {
      // rotate according to absolute degree
      switch (part) {
        case 'vamp':
          this.rotate(32, 87)
          break
        case 'quarters':
          this.rotate(0, 87)
          break
        case 'binding':
          this.rotate(32, 87)
          break
        case 'tongue':
          this.rotate(32, 45)
          break
        case 'eyelets':
          this.rotate(32, 45)
          break
        case 'foxing':
          this.rotate(32, 87)
          break
        case 'foxing_stripe':
          this.rotate(32, 87)
          break
        case 'laces':
          this.rotate(32, 45)
          break
        case 'font':
          this.rotate(-60, 86)
          break
      }
    },
    rotate(azimuthDeg, polarDeg) {
      // compute cumulative degree according to current angle
      let theta = this.controls.azimuthAngle * (180 / Math.PI)
      let thetaQuote = theta % 360
      let delta = azimuthDeg,
        deltaQuote
      let azimuthRotation

      // divided to 4 scenarios, theta <> 0 & (deltaQuote - thetaQuote) <> 180
      if (theta >= 0) {
        deltaQuote = azimuthDeg > 0 ? azimuthDeg : 360 - Math.abs(azimuthDeg)
      } else {
        thetaQuote = thetaQuote === 0 ? 0 : -thetaQuote
        delta = delta === 0 ? 0 : -delta
        deltaQuote = azimuthDeg > 0 ? 360 - azimuthDeg : Math.abs(azimuthDeg)
      }

      if (Math.abs(deltaQuote - thetaQuote) < 180) {
        azimuthRotation = Math.abs(theta) + deltaQuote - thetaQuote
      } else {
        azimuthRotation = delta > 0 ? Math.abs(theta) + deltaQuote + 360 - thetaQuote : Math.abs(theta) - thetaQuote - Math.abs(delta)
      }

      if (azimuthRotation !== 0) {
        azimuthRotation = theta < 0 ? -azimuthRotation : azimuthRotation
      }

      const tween = gsap.to(this.controls, {
        azimuthAngle: azimuthRotation * THREE.MathUtils.DEG2RAD,
        polarAngle: polarDeg * THREE.MathUtils.DEG2RAD,
        distance: polarDeg > 45 ? 5 : 4,
        duration: 2,
        ease: 'back.inOut(2)',
        paused: true
      })
      tween.play(0)
    },
    blink(part) {
      setTimeout(() => {
        this.theModel.children[0].traverse(child => {
          if (child.isMesh && child.name === part) {
            let initialEmissive = new THREE.Color(child.material.emissive.getHex())
            let targetEmissive = new THREE.Color('#BA1B2E')
            let initialColor = new THREE.Color(child.material.emissive.getHex())
            let targetColor = new THREE.Color('#292421')

            gsap.to(child.material.color, {
              r: targetColor.r,
              g: targetColor.g,
              b: targetColor.b,
              duration: 0.5,
              yoyo: true,
              repeat: 1
            })
            gsap.to(child.material.emissive, {
              r: targetEmissive.r,
              g: targetEmissive.g,
              b: targetEmissive.b,
              duration: 0.5,
              yoyo: true,
              repeat: 1
            })
          }
        })
      }, this.blinkDelay * 1000)
    }
  }
}
</script>
