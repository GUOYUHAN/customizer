// 计算图片实际占用宽高
function _computeImageViewPort(img, angle) {
  if (angle === undefined) {
    return {
      width: img.width,
      height: img.height,
    }
  }
  return {
    height: Math.abs(img.width * Math.sin(angle)) + Math.abs(img.height * Math.cos(angle)),
    width: Math.abs(img.height * Math.sin(angle)) + Math.abs(img.width * Math.cos(angle)),
  }
}

export function calcOverlayImageSize(imgSize, containerSize) {
  const { width: canvasWidth, height: canvasHeight } = containerSize
  const canvasRatio = canvasWidth / canvasHeight
  const { width: imgWidth, height: imgHeight } = imgSize
  const imgRatio = imgWidth / imgHeight

  const outputScale = 0.75

  let _imgWidth = 0,
    _imgHeight = 0,
    top = 0,
    left = 0
  // 长边为编辑视窗的 outputScale 倍
  if (imgRatio > canvasRatio) {
    _imgWidth = outputScale * canvasWidth
    _imgHeight = _imgWidth / imgRatio
  } else {
    _imgHeight = outputScale * canvasHeight
    _imgWidth = _imgHeight * imgRatio
  }
  top = (canvasHeight - _imgHeight) / 2
  left = (canvasWidth - _imgWidth) / 2

  return {
    outputSize: {
      left: left | 0,
      top: top | 0,
      width: _imgWidth | 0,
      height: _imgHeight | 0,
    },
  }
}

export function calcImageSize(imgSize, outputSize) {
  const { width: outputWidth, height: outputHeight } = outputSize
  const outputRatio = outputWidth / outputHeight

  // 图片初始宽高
  let { width: imgWidth, height: imgHeight } = imgSize
  const imgRatio = imgWidth / imgHeight

  // 只支持等比缩放
  let scale = 0
  let _imgWidth = 0
  let _imgHeight = 0

  // 如果图片更宽，短边为高
  if (imgRatio > outputRatio) {
    _imgHeight = outputHeight
    _imgWidth = _imgHeight * imgRatio
  } else {
    _imgWidth = outputWidth
    _imgHeight = _imgWidth / imgRatio
  }
  scale = _imgHeight / imgHeight

  return {
    scale,
  }
}

// 预处理图片，将尺寸超过输出尺寸 5 倍的图片进行重新绘制
export function resizeImage(image, outputSize) {
  const { width: outputWidth, height: outputHeight } = outputSize
  const outputRatio = outputWidth / outputHeight

  // 图片初始宽高
  let { width: imgWidth, height: imgHeight } = image
  const imgRatio = imgWidth / imgHeight

  // 只支持等比缩放
  let _imgWidth = 0
  let _imgHeight = 0

  // 如果图片更宽，短边为高
  if (imgRatio > outputRatio) {
    _imgHeight = outputHeight
    _imgWidth = _imgHeight * imgRatio
  } else {
    _imgWidth = outputWidth
    _imgHeight = _imgWidth / imgRatio
  }

  let zoom = imgWidth / _imgWidth
  if (zoom < 0.2) {
    _imgWidth *= 0.2
    _imgHeight *= 0.2
  } else if (zoom > 5) {
    _imgWidth *= 5
    _imgHeight *= 5
  } else {
    _imgWidth = imgWidth
    _imgHeight = imgHeight
  }
  _imgWidth |= 0
  _imgHeight |= 0

  return new Promise((resolve) => {
    let canvas = document.createElement('canvas')
    canvas.width = _imgWidth
    canvas.height = _imgHeight
    let ctx = canvas.getContext('2d')
    ctx.drawImage(image, 0, 0, imgWidth, imgHeight, 0, 0, _imgWidth, _imgHeight)
    canvas.toBlob((r) => {
      resolve(URL.createObjectURL(r))
    }, 'image/png')
  })
}
