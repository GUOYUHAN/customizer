import * as THREE from 'three'
import { customShader } from './customizer/customShader'
import uv1 from './customizer/shader_uv.json'

export const setMaterial = (parent, part, obj, type) => {
  parent.traverse(child => {
    if (child.isMesh && child.name != null && child.name === part) {
      let material = new THREE.MeshStandardMaterial()
      material.transparent = true
      material.color = new THREE.Color(obj.mesh_options?.color ? obj.mesh_options?.color : '#ffffff')
      material.emissive = new THREE.Color(obj.mesh_options?.emissive ? obj.mesh_options?.emissive : '#000000')
      material.roughness = obj.mesh_options?.roughness ? obj.mesh_options?.roughness : child.material.roughness
      material.metalness = obj.mesh_options?.metalness ? obj.mesh_options?.metalness : child.material.metalness

      material.normalMap = obj.normalMap ? obj.normalMap : child.material.normalMap
      material.map = obj.map
      material.emissiveMap = obj.emissiveMap ? obj.emissiveMap : child.material.emissiveMap
      if (obj.map && obj.normalMap) {
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
      }
      child.material = material
    }
  })
}

export const getTextCanvas = (text, color) => {
  let canvas = document.createElement('canvas')
  canvas.width = 1200
  canvas.height = 1200
  let ctx = canvas.getContext('2d')
  ctx.fillStyle = 'rgba(225,225,225,0)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.font = '170px bold sans-serif'
  ctx.fillStyle = color ? color : '#ffffff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  if (text) {
    ctx.fillText(text, 600, 600)
  }
  return canvas
}
