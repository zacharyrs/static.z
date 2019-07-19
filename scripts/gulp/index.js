const gulp = require('gulp')

const { favicons, sitemap, robots, images } = require('./assets')
const webpack = require('./webpack.js')
const styleguide = require('./styleguide.js')

const pre = gulp.parallel(favicons, images)

const dev = gulp.parallel(gulp.series(pre, webpack.dev), styleguide)
const prod = gulp.series(pre, webpack.prod, sitemap, robots)

module.exports = { prod, dev, styleguide }
module.exports.default = prod
