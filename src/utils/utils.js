import * as THREE from 'three'

export const setMaterial = (parent, type, obj, modified) => {
  parent.traverse(o => {
    if (o.isMesh && o.name != null) {
      if (o.name === type) {
        if (modified) {
          let mtl = {}
          Object.keys(obj).forEach(k => {
            mtl[k] = o.material[k]
          })
        }

        o.material.color = obj.color ? new THREE.Color(obj.color) : o.material.color
        o.material.emissive = obj.emissive ? new THREE.Color(obj.emissive) : o.material.emissive
        o.material.metalness = obj.metalness ? obj.metalness : o.material.metalness
        o.material.roughness = obj.roughness ? obj.roughness : o.material.roughness
        o.material.map = obj.map ? obj.map : o.material.map
        o.material.normalMap = obj.normalMap ? obj.normalMap : o.material.normalMap
        o.material.roughnessMap = obj.roughnessMap ? obj.roughnessMap : o.material.roughnessMap
        o.material.emissiveMap = obj.emissiveMap ? obj.emissiveMap : o.material.emissiveMap
      }
    }
  })
}
