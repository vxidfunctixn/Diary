const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = defineConfig({
  transpileDependencies: true,

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

  chainWebpack: config => {
    // Konfiguracja TypeScript
    config.resolve.extensions
      .prepend('.ts')
      .prepend('.tsx')

    // Dodaj ts-loader dla plików TypeScript
    config.module
      .rule('ts')
      .test(/\.ts$/)
      .use('ts-loader')
      .loader('ts-loader')
      .options({
        appendTsSuffixTo: [/\.vue$/],
        transpileOnly: true
      })

    config.module
      .rule('tsx')
      .test(/\.tsx$/)
      .use('ts-loader')
      .loader('ts-loader')
      .options({
        appendTsxSuffixTo: [/\.vue$/],
        transpileOnly: true
      })
  },

  pluginOptions: {
    electronBuilder: {
      customFileProtocol: './'
    }
  }
})
