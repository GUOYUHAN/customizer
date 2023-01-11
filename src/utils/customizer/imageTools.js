export const imageProcess = (imageState, c, part) => {
  return new Promise((resolve, reject) => {
    let ctx = c.getContext('2d')
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, c.width, c.height)
    let reader = new FileReader()
    reader.readAsDataURL(imageState.dest)
    reader.onload = function (r) {
      let img = new Image()
      img.src = r.target.result
      img.onload = function () {
        if (part === 'vamp') {
          ctx.drawImage(img, 0, 0, 1024, (1024 / this.width) * this.height)
        } else if (part === 'quarters') {
          ctx.drawImage(img, 0, 0, 1024, (1024 / this.width) * this.height)
          ctx.drawImage(img, 0, 633, 1024, (1024 / this.width) * this.height)
          ctx.fillStyle = '#fff'
          ctx.fillRect(0, 391, c.width, 242)
        }
        resolve(c)
      }
    }
  })
}

export const checkBoundingBox = params => {
  // TODO complete bounding box check logic
  const { W, H, cropW, cropH, x, y, deg } = params
  return true
}

export const getFileSize = file => {
  let imgW, imgH
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader()
      reader.onload = function (evt) {
        const replaceSrc = evt.target.result
        const image = new Image()
        image.src = replaceSrc
        image.onload = _ => {
          imgW = image.width
          imgH = image.height
          // let w2hRatio = imgW / imgH
          // if (w2hRatio > 1) {
          //   imgH = _defaultH
          //   imgW = _defaultH * w2hRatio
          // } else {
          //   imgW = _defaultW
          //   imgH = _defaultW / w2hRatio
          // }
          resolve({
            width: imgW,
            height: imgH
          })
        }
      }
      reader.readAsDataURL(file)
    } catch (e) {
      resolve({})
    }
  })
}

export const getCropProperty = function (info) {
  const { imgW, imgH, cropRatio } = info
  const imgRatio = imgW / imgH

  // 黑框尺寸
  let _w = (document.body.clientWidth || document.documentElement.clientWidth) * 0.9 + 72
  const _h = _w / cropRatio

  let cropX, cropY, cropW, cropH
  // 上传的图片更宽，以高度为准
  if (imgRatio > cropRatio) {
    // 如果图片高度比黑框小，以计算后黑框高度为准
    cropH = imgH < _h ? _h : imgH
    cropW = cropH * cropRatio
  }
  // 以宽度为准
  else {
    // 如果图片宽度比黑框小，以黑框宽度为准
    cropW = imgW < _w ? _w : imgW
    cropH = cropW / cropRatio
  }

  cropX = (imgW - cropW) / 2
  cropY = (imgH - cropH) / 2

  return {
    cropRatio,
    cropX,
    cropY,
    cropW,
    cropH
  }
}

export const getSvgSize = file => {
  let svgW, svgH
  return new Promise((resolve, reject) => {
    try {
      let request = new XMLHttpRequest()
      request.open('GET', file)
      request.setRequestHeader('Content-Type', 'image/svg+xml')
      request.addEventListener('load', function (event) {
        let response = event.target.responseText
        let doc = new DOMParser()
        let xml = doc.parseFromString(response, 'image/svg+xml')
        let viewBox = xml.getElementsByTagName('svg')[0].attributes
        console.log(viewBox)
      })
      request.send()
    } catch (e) {
      resolve({})
    }
  })
}
