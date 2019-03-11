const gulp = require('gulp')

const { favicons, sitemap, robots } = require('./assets')
const webpack = require('./webpack.js')
const styleguide = require('./styleguide.js')

const dev = gulp.parallel(gulp.series(favicons, webpack.dev), styleguide)
const prod = gulp.series(favicons, webpack.prod, sitemap, robots)

module.exports = { prod, dev, styleguide }
module.exports.default = prod
