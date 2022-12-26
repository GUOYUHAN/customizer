import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
// import { customShader } from './customShader'
// import uv1 from './shader_uv.json'
import { setMaterial } from '../utils'

let theModel
let foxing_normal_txt, default_toe_txt, default_insole_normal_txt, default_insole_txt, default_tip_txt, default_tip_txt_roughness, default_foxing_txt

export const initialLoad = async () => {
  // let theModel

  // Load models and texture
  let loader = new GLTFLoader()
  let txtLoader = new THREE.TextureLoader()

  // Draco loader
  let dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('/static/decoder/')
  loader.setDRACOLoader(dracoLoader)

  const results = await Promise.all([
    loader.loadAsync('/static/models/authentic-classic-9.0.glb'),
    loader.loadAsync('/static/models/binding_stitches.glb'),
    loader.loadAsync('/static/models/lining_stitches.glb'),
    loader.loadAsync('/static/models/quarters_stitches.glb'),
    loader.loadAsync('/static/models/vamp_stitches.glb'),
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
  for (let i = 0; i < textures.length - 1; i++) {
    textures[i].wrapS = THREE.RepeatWrapping
    textures[i].wrapT = THREE.RepeatWrapping
  }
  theModel = results[0].scene
  foxing_normal_txt = textures[0]
  default_insole_txt = textures[1]
  default_toe_txt = textures[2]
  default_foxing_txt = textures[3]
  default_insole_normal_txt = textures[4]
  default_tip_txt_roughness = textures[5]
  default_tip_txt = textures[6]
  setDefaultTexture()

  return { models, textures }
}

const setDefaultTexture = () => {
  default_toe_txt.repeat.set(28, 28)
  let default_vamp_mtl = {
    normalMap: default_toe_txt,
    color: 0xffffff
  }

  setMaterial(theModel.children[0], 'vamp', default_vamp_mtl, false)
  setMaterial(theModel.children[0], 'quarters', default_vamp_mtl, false)
  setMaterial(theModel.children[0], 'binding', default_vamp_mtl, false)
  setMaterial(theModel.children[0], 'tongue', default_vamp_mtl, false)
  setMaterial(theModel.children[0], 'lining', default_vamp_mtl, false)

  default_insole_normal_txt.repeat.set(2, 2)

  default_insole_txt.repeat.set(2, 2)
  let default_insole_mtl = {
    color: parseInt('0xc4bcb5'),
    map: default_insole_txt,
    normalMap: default_insole_normal_txt
  }

  setMaterial(theModel.children[0], 'insole', default_insole_mtl, false)

  default_foxing_txt.repeat.set(22, 22)
  foxing_normal_txt.repeat.set(22, 22)
  let default_foxing_mtl = {
    map: default_foxing_txt,
    normalMap: foxing_normal_txt,
    emissive: 0x3d3d3d
  }

  default_tip_txt_roughness.repeat.set(2, 2)
  default_tip_txt.repeat.set(2, 2)
  let default_tip_mtl = {
    roughnessMap: default_tip_txt_roughness,
    normalMap: default_tip_txt,
    emissive: 0x222222,
    metalness: 0.05
  }

  let default_upper_mtl = {
    emissive: 0x151515,
    metalness: 0.05,
    color: 0xffffff
  }

  setMaterial(theModel.children[0], 'foxing', default_foxing_mtl, false)
  setMaterial(theModel.children[0], 'foxing_tip', default_tip_mtl, false)
  setMaterial(theModel.children[0], 'foxing_upper', default_upper_mtl, false)
}
