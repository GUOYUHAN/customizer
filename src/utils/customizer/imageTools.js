export const generateOutputImage = (imgData, dest) => {
  return new Promise(resolve => {
    const img = new Image()
    img.onload = () => {
      resolve(_getOutputImage(img, imgData, dest))
    }
    img.src = imgData.dataURL
  })
}

function _getOutputImage(img, imgData, dest) {
  const {dataURL, width, height} = imgData
  let {width: destWidth, height: destHeight, part} = dest

  let canvas = document.createElement('canvas')
  canvas.width = destWidth
  canvas.height = destHeight
  let ctx = canvas.getContext('2d')
  ctx.fillStyle = '#fff'

  // 绘制不同部位的裁片图案
  switch(part) {
    case 'vamp':
      ctx.drawImage(img, 0, 0, destWidth, (destWidth / width) * height)
      break
    case 'quarters':
      ctx.drawImage(img, 0, 0, destWidth, (destWidth / width) * height)
      ctx.drawImage(img, 0, 633, destWidth, (destWidth / width) * height)
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 391, destWidth, 242)
      break
  }
  return new Promise(resolve => {
    canvas.toBlob((r) => {
      resolve(URL.createObjectURL(r))
    }, 'image/png')
  })
}
