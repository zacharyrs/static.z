const path = require('path')

const gulp = require('gulp')
const browserSync = require('browser-sync')
const webpack = require('webpack')

const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')

const popConfig = require('./utils').popConfig

const site = require(path.resolve('./content/data.json'))

const browser = browserSync.create()

let curConfig = popConfig()
let bundler = webpack(curConfig)

var server = () => {
  browser.init({
    server: '../dist',
    middleware: [webpackDevMiddleware(bundler, { stats: { colors: true } }), webpackHotMiddleware(bundler)],
  })
}

var build = () => {
  return new Promise(resolve => {
    webpack(curConfig, function(err, stats) {
      if (err) console.log('Webpack', err)
      console.log(stats.toString({ colors: true }))
      resolve()
    })
  })
}

module.exports = { build: build, server: server }
