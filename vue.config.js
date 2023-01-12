const { defineConfig } = require('@vue/cli-service')
const { VantResolver } = require('unplugin-vue-components/resolvers')
const ComponentsPlugin = require('unplugin-vue-components/webpack')

module.exports = defineConfig({
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
        ws: true, //代理websocked
        changeOrigin: true, //虚拟的站点需要更管origin
        pathRewrite: {
          '^/api': '' //重写路径
        }
      },
      '/': {
        target: 'http://54.223.126.169:8081/', //接口前缀
        ws: true, //代理websocked
        changeOrigin: true //虚拟的站点需要更管origin
      }
    }
  }
})
