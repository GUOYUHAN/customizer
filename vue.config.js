const { defineConfig } = require('@vue/cli-service')
const { VantResolver } = require('unplugin-vue-components/resolvers')
const ComponentsPlugin = require('unplugin-vue-components/webpack')

module.exports = defineConfig({
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      ComponentsPlugin({
        resolvers: [VantResolver()]
      })
    ]
  },
  devServer: {
    proxy: {
      '^/api': {
        target: 'http://54.223.126.169:8081/', //接口前缀
        ws: false, //代理websocked
        changeOrigin: true,
        pathRewrite: {
          '^/api': '' //重写路径
        }
      }
    }
  }
})
