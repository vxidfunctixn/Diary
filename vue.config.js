const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = defineConfig({
  transpileDependencies: true,

  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "@/theme/mixins.scss";`
      }
    }
  },

  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.join(__dirname, 'dist_electron', 'preload.js'),
            to: 'preload.js',
          },
        ],
      }),
    ],
  },

  pluginOptions: {
    electronBuilder: {
      customFileProtocol: './'
    }
  }
})
