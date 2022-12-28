import * as THREE from 'three'
import { customShader } from './customizer/customShader'
import uv1 from './customizer/shader_uv.json'

export const setMaterial = (parent, part, obj, type) => {
  parent.traverse(child => {
    if (child.isMesh && child.name != null && child.name === part) {
      if (type === 'color' || !type) {
        // if (modified) {
        //   let mtl = {}
        //   Object.keys(obj).forEach(k => {
        //     mtl[k] = child.material[k]
        //   })
        // }
        child.material.color = obj.color ? new THREE.Color(obj.color) : child.material.color
        child.material.emissive = obj.emissive ? new THREE.Color(obj.emissive) : child.material.emissive
        child.material.metalness = obj.metalness ? obj.metalness : child.material.metalness
        child.material.roughness = obj.roughness ? obj.roughness : child.material.roughness
        child.material.map = obj.map ? obj.map : child.material.map
        child.material.normalMap = obj.normalMap ? obj.normalMap : child.material.normalMap
        child.material.roughnessMap = obj.roughnessMap ? obj.roughnessMap : child.material.roughnessMap
        child.material.emissiveMap = obj.emissiveMap ? obj.emissiveMap : child.material.emissiveMap
      } else if (type === 'image') {
        let material = new THREE.MeshStandardMaterial()
        material.transparent = true
        material.color = new THREE.Color(obj.mesh_options?.color ? obj.mesh_options?.color : '#f1f2f1')
        material.emissive = new THREE.Color(obj.mesh_options?.emissive ? obj.mesh_options?.emissive : '#3d3d3d')
        material.roughness = obj.mesh_options?.roughness ? obj.mesh_options?.roughness : child.material.roughness
        material.metalness = obj.mesh_options?.metalness ? obj.mesh_options?.metalness : child.material.metalness

        material.normalMap = obj.normalMap
        material.map = obj.map
        material.emissiveMap = obj.emissiveMap ? obj.emissiveMap : child.material.emissiveMap

        const r = customShader({
          shaders: uv1,
          material,
          uniforms: {
            highLightAlpha: {
              type: 'f',
              value: 0
            },
            highLightColor: {
              type: 'c',
              value: {
                r: 1,
                g: 0,
                b: 0
              }
            },
            normalRepeat: {
              type: 'f',
              value: 16
            },
            stitchColor: {
              type: 'c',
              value: {
                r: 1,
                g: 1,
                b: 1
              }
            },
            useHighLight: {
              type: 'i',
              value: 0
            }
          }
        })
        child.material = material
      }
    }
  })
}

export const getTextCanvas = (text, color) => {
  let canvas = document.createElement('canvas')
  canvas.width = 3000
  canvas.height = 1250
  let ctx = canvas.getContext('2d')
  ctx.fillStyle = 'rgba(225,225,225,0)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.font = 'small-caps 400px bold sans-serif'
  ctx.fillStyle = color
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, 1500, 625)
  return canvas
}
