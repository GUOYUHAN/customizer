const _defaultW = 750
// const _defaultW = 723
const _defaultH = 500
// const _defaultH = 482
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
          let w2hRatio = imgW / imgH
          if (w2hRatio > 1) {
            imgH = _defaultH
            imgW = _defaultH * w2hRatio
          } else {
            imgW = _defaultW
            imgH = _defaultW / w2hRatio
          }
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