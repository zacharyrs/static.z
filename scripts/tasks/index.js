const gulp = require('gulp')

const templates = require('./templates.js')
const webpack = require('./server.js')
const favicons = require('./favicons.js')
const sitemap = require('./sitemap.js')
const robots = require('./robots.js')

const build = webpack.build
const server = webpack.server
const serverReload = webpack.serverReload

let compile = gulp.series(favicons, templates)

let watch = () => {
  gulp.watch(['./base/**/*.pug', './content/**/*'], () => {
    console.log("It's reload time")
    return Promise.all(templates(), serverReload())
  })
}

let dev = gulp.parallel(gulp.series(compile, server), watch)
let prod = gulp.series(compile, build, sitemap, robots)

module.exports = { dev: dev, prod: prod }
module.exports.default = dev
