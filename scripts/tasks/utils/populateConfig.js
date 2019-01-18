const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const getPages = require('./getPages.js')
let webpackConfig = require('../../webpack').config

const dev = process.env.NODE_ENV == 'development'

const populateConfig = () => {
  getPages().forEach(page => {
    webpackConfig.entry[page.template] = [
      ...(dev ? ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true'] : []),
      page.templateJsPath,
    ]
    webpackConfig.plugins.push(
      new HtmlWebpackPlugin({
        filename: page.path,
        template: path.resolve('./cache/html', page.path),
        chunks: ['vendor', 'styles', page.template],
      }),
    )
  })

  return webpackConfig
}

module.exports = populateConfig
