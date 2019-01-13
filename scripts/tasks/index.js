const gulp = require('gulp')

const templates = require('./templates.js')
const webpack = require('./server.js')

const server = webpack.server
const build = webpack.build

let compile = gulp.series(templates)

let watch = () => {
  gulp.watch(['./base/**/*.pug', './content/**/*.json'], () => {
    templates()
  })
}

let dev = gulp.series(compile, server)
let prod = gulp.series(compile, build)

module.exports = { dev: dev, prod: prod }
module.exports.default = dev
