const browserSync = require('browser-sync')
const webpack = require('webpack')

const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')

const { populateConfig } = require('./utils')

const browser = browserSync.create()

const server = () => {
  const config = populateConfig()
  const bundler = webpack(config)

  const devMiddleware = webpackDevMiddleware(bundler, {
    stats: { colors: true },
    publicPath: config.output.publicPath,
  })

  const hotMiddleware = webpackHotMiddleware(bundler, {
    log: console.log,
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000,
  })

  browser.init({
    server: '../dist',
    middleware: [devMiddleware, hotMiddleware],
  })
}

const serverReload = () => {
  return new Promise(resolve => {
    browser.reload()
    resolve()
  })
}

const build = () => {
  return new Promise((resolve, reject) => {
    const config = populateConfig()

    webpack(config, (err, stats) => {
      if (err || stats.hasErrors()) reject(err || stats.toString({ colors: true }))
      console.log(stats.toString({ colors: true }))
      resolve()
    })
  })
}

module.exports = { build, server, serverReload }
