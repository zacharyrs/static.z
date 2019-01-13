const fs = require('fs')
const path = require('path')

const gulp = require('gulp')
const pug = require('gulp-pug')
const rename = require('gulp-rename')
const data = require('gulp-data')
const beautify = require('gulp-jsbeautifier')

const getPages = require('./utils').getPages

const site = require(path.resolve('./content/data.json'))

const build = page => {
  return new Promise((resolve, reject) => {
    gulp
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
      .on('error', reject)
      .pipe(gulp.dest('./cache/html/'))
      .on('end', resolve)
  })
}

const include = pages => {
  return new Promise((resolve, reject) => {
    let tmpStyles = new Set()
    let tmpPages = new Set()

    pages.forEach(page => {
      // preConfig.entry[page.template] = page.templateJsPath
      tmpStyles.add(path.join('../', page.templateSssPath))
      tmpPages.add(path.resolve('./cache/html', page.path))
    })

    fs.writeFile(
      './cache/html.js',
      [...tmpPages]
        .map(x => {
          return `require('${x}')`
        })
        .join('\n'),
      err => {
        if (err) {
          reject(err)
        }
      },
    )

    fs.writeFile(
      './cache/styles.js',
      [...tmpStyles]
        .map(x => {
          return `require('${x}')`
        })
        .join('\n'),
      err => {
        if (err) {
          reject(err)
        }
      },
    )

    resolve()
  })
}

const templates = () => {
  let pages = getPages()
  return Promise.all([...pages.map(page => build(page)), include(pages)])
}

module.exports = templates
