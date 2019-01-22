const gulp = require('gulp')

const templates = require('./templates.js')
const { favicons, sitemap, robots } = require('./assets')
const webpack = require('./webpack.js')

const patterns = require('./patterns')

const templatesWatch = () => {
  gulp.watch(['./base/**/*.pug', './content/**/*'], () => {
    return Promise.all([templates(), webpack.serverReload()])
  })
}

const dev = gulp.parallel(gulp.series(favicons, templates, webpack.server), templatesWatch, patterns)
const prod = gulp.series(favicons, templates, webpack.build, sitemap, robots)

module.exports = { dev, prod, patterns }
module.exports.default = dev
