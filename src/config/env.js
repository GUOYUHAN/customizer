/* ========= 本地/开发机 ========= */
const PROD = 1
const DEV = 0

// const ENV = DEV
const ENV = PROD

// 项目
let baseUrls = '/'

if (ENV === DEV) {
  baseUrls = '/api'
}

console.group('环境')
console.warn(ENV === DEV ? '本地' : '开发机')
console.groupEnd('环境')

export default {
  prod: ENV === PROD,
  baseUrls: baseUrls
}
