const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const { config } = require('../../webpack')
const getPages = require('./get-pages.js')

const dev = process.env.NODE_ENV === 'development'

const populateConfig = () => {
  getPages().forEach(page => {
    config.entry[page.template] = [
      ...(dev ? ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true'] : []),
      page.templateJsPath,
    ]
    config.plugins.push(
      new HtmlWebpackPlugin({
        filename: page.path,
        template: path.resolve('./cache/html', page.path),
        chunks: ['vendor', 'styles', page.template],
      }),
    )
  })

  return config
}

module.exports = populateConfig
