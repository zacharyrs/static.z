const fs = require('fs')
const path = require('path')

const gulp = require('gulp')
const pug = require('gulp-pug')
const gm = require('gray-matter')
const data = require('gulp-data')
const sass = require('gulp-sass')
const tildeImporter = require('node-sass-tilde-importer')
const postcss = require('gulp-postcss')
const babel = require('gulp-babel')
const stylemark = require('stylemark')

const browserSync = require('browser-sync')

const browser = browserSync.create()

const styleguidePrecompileHtml = () => {
  return gulp
    .src('./base/components/**/demo.pug')
    .pipe(
      data(file => {
        const demo = fs.readFileSync(path.resolve(path.dirname(file.path), 'demo.md'))

        return {
          ...gm(demo).data.content,
        }
      }),
    )
    .pipe(pug())
    .pipe(gulp.dest('./.cache/styleguide/'))
}

const styleguidePrecompileCss = () => {
  return gulp
    .src('./base/components/**/demo.scss')
    .pipe(sass({ importer: tildeImporter }).on('error', sass.logError))
    .pipe(postcss())
    .pipe(gulp.dest('./.cache/styleguide/'))
}

const styleguidePrecompileJs = () => {
  return gulp
    .src('./base/components/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('./.cache/styleguide/'))
}

const styleguidePrecompileMd = () => {
  return gulp.src('./base/components/**/demo.md').pipe(gulp.dest('./.cache/styleguide/'))
}

const styleguidePrecompile = gulp.parallel(
  styleguidePrecompileHtml,
  styleguidePrecompileJs,
  styleguidePrecompileCss,
  styleguidePrecompileMd,
)

const styleguidePrecompileWatch = () => {
  return new Promise(resolve => {
    gulp.watch(['./base/components/**/*.pug', './base/components/**/demo.md'], styleguidePrecompileHtml)
    gulp.watch(
      [
        './base/components/**/*.scss',
        './base/styling/**/*.scss',
        './content/custom.scss',
        './base/styling/vars.scss',
        './content/vars.scss',
      ],
      styleguidePrecompileCss,
    )
    gulp.watch('./base/components/**/*.js', styleguidePrecompileJs)
    gulp.watch('./base/components/**/*.json', styleguidePrecompileMd)
    resolve()
  })
}

const styleguideServer = () => {
  browser.init({
    ui: false,
    server: '../styleguide',
    notify: false,
    ghostMode: false,
    port: 1337,
    logLevel: 'silent',
  })
}

const styleguideCompile = () => {
  return new Promise(resolve => {
    stylemark({
      input: './.cache/styleguide',
      output: '../styleguide',
      configPath: '../.stylemark.yml',
    })
    browser.reload()
    resolve()
  })
}

const styleguideCompileWatch = () => {
  return new Promise(resolve => {
    gulp.watch('./.cache/styleguide/**/*', styleguideCompile)
    resolve()
  })
}

const build = gulp.series(styleguidePrecompile, styleguideCompile, styleguidePrecompileWatch, styleguideCompileWatch)
const styleguide = gulp.parallel(styleguideServer, build)

module.exports = styleguide
