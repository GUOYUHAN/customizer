import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
// import { customShader } from './customShader'
// import uv1 from './shader_uv.json'
import { setMaterial } from '../utils'
import { defaultTextureUrls } from '../../constants/constants.js'
import models_urls from '../../data/models.json'

let theModel
let defaultTextures

export const loadingManager = new THREE.LoadingManager()

// Load models and texture
let loader = new GLTFLoader(loadingManager)
let FBXloader = new FBXLoader(loadingManager)

loader.setCrossOrigin('')

// Draco loader
let dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/cust/static/decoder/')
loader.setDRACOLoader(dracoLoader)

let txtLoader = new THREE.TextureLoader(loadingManager)

export const initialLoad = async () => {
  let urls
  models_urls.map(one => {
    if (one.size === '9.0') {
      urls = one.model_urls
    }
  })

  const modelJobs = urls.map(one => {
    if (one.indexOf('.fbx') !== -1) {
      return FBXloader.loadAsync(one)
    } else {
      return loader.loadAsync(one)
    }
  })
  let txtJobs = []
  Object.keys(defaultTextureUrls).map(one => {
    txtJobs.push(
      loadTexture(defaultTextureUrls[one].textures).then(res => {
        return {
          [one]: res,
          mesh_options: defaultTextureUrls[one].mesh_options || {}
        }
      })
    )
  })

  const results = await Promise.all(modelJobs.concat(txtJobs)).catch(err => {
    console.log('promise all load models error:', err)
  })
  console.log('loading results', results)
  const models = results.slice(0, modelJobs.length)
  defaultTextures = results.slice(modelJobs.length)

  theModel = results[0]
  theModel.traverse(child => {
    child.material = new THREE.MeshStandardMaterial()
  })
  console.log('theModel', theModel)
  setDefaultTexture()

  return { models }
}

export const loadTexture = async textures => {
  let result = {}
  await Promise.all(
    Object.keys(textures).map(one => {
      if (!textures[one]) {
        result[one] = null
        return
      }
      const txt = txtLoader.load(textures[one].image_url)
      txt.wrapS = txt.wrapT = THREE.RepeatWrapping
      txt.repeat.set(textures[one].options.repeat[0], textures[one].options.repeat[1])
      if (textures[one].options.offset) {
        txt.offset.set(textures[one].options.offset[0], textures[one].options.offset[1])
      }
      txt.flipY = textures[one].options.flipY === false ? false : true
      result[one] = txt
    })
  ).catch(err => {
    console.log('promise all load models error:', err)
  })
  return result
}

export const loadPersonalization = async () => {
  const result = await Promise.all([loader.loadAsync('/cust/static/models/personalization.glb')])
  return result[0].scene
}

const setDefaultTexture = () => {
  defaultTextures.map(one => {
    let type = Object.keys(one)[0]
    let new_params = {
      ...one[type],
      mesh_options: one.mesh_options || {}
    }
    setMaterial(theModel, type, new_params)
  })
}
