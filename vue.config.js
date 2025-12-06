const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = defineConfig({
  transpileDependencies: true,

  productionSourceMap: false,

  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "@/theme/global.scss"; @import "@/theme/mixins.scss";`
      }
    }
  },

  configureWebpack: config => {
    // Włącz inline-source-map w development dla debugowania
    if (process.env.NODE_ENV === 'development') {
      config.devtool = 'inline-source-map'
    }

    config.plugins = config.plugins || []
    config.plugins.push(
      new webpack.DefinePlugin({
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.join(__dirname, 'dist_electron', 'preload.js'),
            to: 'preload.js'
          }
        ]
      })
    )
  },

  pluginOptions: {
    electronBuilder: {
      customFileProtocol: './',
      nodeIntegration: false,
      mainProcessArgs: ['--remote-debugging-port=9223']
    }
  }
})
