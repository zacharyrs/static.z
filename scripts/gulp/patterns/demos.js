const fs = require('fs')
const path = require('path')

const gulp = require('gulp')
const pug = require('gulp-pug')
const rename = require('gulp-rename')
const data = require('gulp-data')
const beautify = require('gulp-jsbeautifier')
const postcss = require('gulp-postcss')
const babel = require('gulp-babel')

const html = () => {
  return gulp
    .src('./base/components/**/*.pug')
    .pipe(
      rename(file => {
        file.extname = '.html'
      }),
    )
    .pipe(
      data(file => {
        return JSON.parse(fs.readFileSync(path.dirname(file.path) + '/pattern.json')).data || {}
      }),
    )
    .pipe(pug())
    .pipe(beautify())
    .pipe(gulp.dest('../lib/'))
}

const css = () => {
  return gulp
    .src('./base/components/**/*.sss')
    .pipe(
      rename(file => {
        file.extname = '.css'
      }),
    )
    .pipe(postcss())
    .pipe(gulp.dest('../lib/'))
}

const js = () => {
  return gulp
    .src('./base/components/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('../lib/'))
}

const json = () => {
  return gulp.src('./base/components/**/*.json').pipe(gulp.dest('../lib'))
}

const demos = gulp.parallel(gulp.series(js, html), css, json)

const demosWatch = () => {
  gulp.watch(['./base/components/**/*.pug', './base/components/**/pattern.json'], html)
  gulp.watch('./base/components/**/*.sss', css)
  gulp.watch('./base/components/**/*.js', js)
  gulp.watch('./base/components/**/*.json', json)
}

module.exports = { demos, demosWatch }
