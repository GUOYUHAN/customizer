import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
// import { customShader } from './customShader'
// import uv1 from './shader_uv.json'
import { setMaterial } from '../utils'

let theModel
let foxing_normal_txt, default_vamp_txt, default_insole_normal_txt, default_insole_txt, default_tip_txt, default_tip_txt_roughness, default_foxing_txt

let txtLoader = new THREE.TextureLoader()

// Load models and texture
let loader = new GLTFLoader()
loader.setCrossOrigin('')

// Draco loader
let dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/static/decoder/')
loader.setDRACOLoader(dracoLoader)

export const initialLoad = async () => {
  const results = await Promise.all([
    loader.loadAsync('https://down.bbtkids.cn/wwcustomer/vans/9.0/authentic-classic-9.0.glb'),
    loader.loadAsync('https://down.bbtkids.cn/wwcustomer/vans/9.0/binding_stitches.glb'),
    loader.loadAsync('https://down.bbtkids.cn/wwcustomer/vans/9.0/lining_stitches.glb'),
    loader.loadAsync('https://down.bbtkids.cn/wwcustomer/vans/9.0/quarters_stitches.glb'),
    loader.loadAsync('https://down.bbtkids.cn/wwcustomer/vans/9.0/vamp_stitches.glb'),
    txtLoader.load('https://pic.bbtkids.cn/FlKtBOKulMFKAW6ayWGBibMBN6Yr'),
    txtLoader.load('https://pic.bbtkids.cn/Fi3FCwy0ROc_IdCPtuf_QmL2MlHw'),
    txtLoader.load('https://pic.bbtkids.cn/FiQvFit0mQcImJR_W_YBXxlrAetl'),
    txtLoader.load('https://pic.bbtkids.cn/FkCCuVIxI8NTMb-Pw5heGrcRt9cD'),
    txtLoader.load('https://pic.bbtkids.cn/FtjEkcuxmWy9XGKHYwCuoWFs0J5K'),
    txtLoader.load('https://pic.bbtkids.cn/Fs-hm3sCv6-ebdSlwAkFAmE-ZvPC'),
    txtLoader.load('https://pic.bbtkids.cn/FhPnq55M76RPHmSUSaU83jLZzez2')
  ]).catch(err => {
    console.log('promise all load models error:', err)
  })
  const models = results.slice(0, 5)
  const textures = results.slice(5)
  for (let i = 0; i < textures.length; i++) {
    textures[i].wrapS = THREE.RepeatWrapping
    textures[i].wrapT = THREE.RepeatWrapping
  }
  theModel = results[0].scene
  foxing_normal_txt = textures[0]
  default_insole_txt = textures[1]
  default_vamp_txt = textures[2]
  default_foxing_txt = textures[3]
  default_insole_normal_txt = textures[4]
  default_tip_txt_roughness = textures[5]
  default_tip_txt = textures[6]
  setDefaultTexture()

  return { models, textures }
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
  const result = await Promise.all([loader.loadAsync('/static/models/personalization.glb')])
  return result[0].scene
}

const setDefaultTexture = () => {
  default_vamp_txt.repeat.set(28, 28)
  let default_vamp_mtl = {
    normalMap: default_vamp_txt,
    mesh_options: {
      color: 0xffffff
    }
  }

  setMaterial(theModel.children[0], 'vamp', default_vamp_mtl)
  setMaterial(theModel.children[0], 'quarters', default_vamp_mtl)
  setMaterial(theModel.children[0], 'binding', default_vamp_mtl)
  setMaterial(theModel.children[0], 'tongue', default_vamp_mtl)
  setMaterial(theModel.children[0], 'lining', default_vamp_mtl)

  default_insole_normal_txt.repeat.set(2, 2)

  default_insole_txt.repeat.set(2, 2)
  let default_insole_mtl = {
    mesh_options: {
      color: parseInt('0xc4bcb5')
    },
    map: default_insole_txt,
    normalMap: default_insole_normal_txt
  }

  setMaterial(theModel.children[0], 'insole', default_insole_mtl)

  default_foxing_txt.repeat.set(22, 22)
  foxing_normal_txt.repeat.set(22, 22)
  let default_foxing_mtl = {
    map: default_foxing_txt,
    normalMap: foxing_normal_txt,
    mesh_options: {
      emissive: 0x3d3d3d
    }
  }

  default_tip_txt_roughness.repeat.set(2, 2)
  default_tip_txt.repeat.set(2, 2)
  let default_tip_mtl = {
    roughnessMap: default_tip_txt_roughness,
    normalMap: default_tip_txt,
    mesh_options: {
      emissive: 0x222222,
      metalness: 0.05
    }
  }

  let default_upper_mtl = {
    mesh_options: {
      emissive: 0x151515,
      metalness: 0.05,
      color: 0xffffff
    }
  }

  setMaterial(theModel.children[0], 'foxing', default_foxing_mtl)
  setMaterial(theModel.children[0], 'foxing_tip', default_tip_mtl)
  setMaterial(theModel.children[0], 'foxing_upper', default_upper_mtl)
}
