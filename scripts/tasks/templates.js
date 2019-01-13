const fs = require('fs')
const path = require('path')

const gulp = require('gulp')
const pug = require('gulp-pug')
const rename = require('gulp-rename')
const data = require('gulp-data')
const beautify = require('gulp-jsbeautifier')

const merge = require('merge-stream')

const getPages = require('./utils').getPages

const site = require(path.resolve('./content/data.json'))

const build = page => {
  return gulp
    .src(page.templatePath)
    .pipe(rename(page.path))
    .pipe(
      data(file => {
        return { page: page.locals, site: site }
      }),
    )
    .pipe(
      pug({
        locals: {
          req: (ifile, local = false) => {
            if (local) {
              ifile = path.resolve(path.dirname(page.templatePath), ifile)
            }

            return `\${require('${path.relative(path.resolve('./cache/html', path.dirname(page.path)), ifile)}')}`
          },
        },
      }),
    )
    .pipe(beautify())
    .pipe(gulp.dest('./cache/html/'))
}

const templates = () => {
  let pages = getPages()
  return merge(...pages.map(page => build(page)))
}

module.exports = templates
