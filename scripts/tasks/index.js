const gulp = require('gulp')

const templates = require('./templates.js')
const webpack = require('./server.js')
const favicons = require('./favicons.js')
const sitemap = require('./sitemap.js')
const robots = require('./robots.js')

const uiLib = require('./ui-lib')

const watch = () => {
  gulp.watch(['./base/**/*.pug', './content/**/*'], () => {
    return Promise.all([templates(), webpack.serverReload()])
  })
}

const patterns = gulp.series(uiLib.demos, gulp.parallel(uiLib.demosWatch, uiLib.patternplate))

const dev = gulp.parallel(gulp.series(favicons, templates, webpack.server), patterns, watch)

const prod = gulp.series(favicons, templates, webpack.build, sitemap, robots)

module.exports = { dev, prod, patterns }
module.exports.default = dev
