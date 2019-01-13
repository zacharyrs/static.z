const path = require('path')

const gulp = require('gulp')
const browserSync = require('browser-sync')
const webpack = require('webpack')

const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')

const webpackConfig = require('../webpack').config

const site = require(path.resolve('./content/data.json'))

const browser = browserSync.create()

let bundler = webpack(webpackConfig)

const server = () => {
  browser.init({
    server: '../dist',
    middleware: [webpackDevMiddleware(bundler, { stats: { colors: true } }), webpackHotMiddleware(bundler)],
  })
}

const build = () => {
  return new Promise(resolve => {
    webpack(webpackConfig, function(err, stats) {
      if (err) console.log('Webpack', err)
      console.log(stats.toString({ colors: true }))
      resolve()
    })
  })
}

module.exports = { build: build, server: server }
