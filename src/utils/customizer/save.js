import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'

const params = {
  trs: false,
  onlyVisible: true,
  binary: false,
  maxTextureSize: 4096
}

export function exportGLTF(input) {
  // console.log(input)
  const gltfExporter = new GLTFExporter()

  const options = {
    trs: params.trs,
    onlyVisible: params.onlyVisible,
    binary: params.binary,
    maxTextureSize: params.maxTextureSize
  }
  gltfExporter.parse(
    input,
    function (result) {
      if (result instanceof ArrayBuffer) {
        saveArrayBuffer(result, 'cuztomizer.glb')
      } else {
        const output = JSON.stringify(result, null, 2)
        // console.log(output)
        saveString(output, 'cuztomizer.gltf')
      }
    },
    function (error) {
      console.log('An error happened during parsing', error)
    },
    options
  )
}

function save(blob, filename) {
  const link = document.createElement('a')
  link.style.display = 'none'
  document.body.appendChild(link)
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
}

function saveString(text, filename) {
  save(new Blob([text], { type: 'text/plain' }), filename)
}

function saveArrayBuffer(buffer, filename) {
  save(new Blob([buffer], { type: 'application/octet-stream' }), filename)
}
