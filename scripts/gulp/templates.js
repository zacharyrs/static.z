const fs = require('fs')
const path = require('path')

const gulp = require('gulp')
const pug = require('gulp-pug')
const rename = require('gulp-rename')
const data = require('gulp-data')
const beautify = require('gulp-jsbeautifier')

const { getPages } = require('./utils')

const site = require(path.resolve('./content/data.json'))

const build = (page, inject) => {
  return new Promise((resolve, reject) => {
    gulp
      .src(page.templatePath)
      .pipe(rename(page.path))
      .pipe(
        data(_ => {
          return { page: page.locals, site, inject }
        }),
      )
      .pipe(pug())
      .pipe(beautify())
      .on('error', reject)
      .pipe(gulp.dest('./.cache/html/'))
      .on('end', resolve)
  })
}

// TODO - HTML: Waiting on extract-loader fix regarding interpolation, or webpack 5 with html entries
const include = pages => {
  return new Promise((resolve, reject) => {
    const tmpStyles = new Set()

    pages.forEach(page => {
      tmpStyles.add(path.join('../', page.templateSssPath))
    })

    fs.writeFile(
      './.cache/styles.js',
      '/* eslint-disable import/no-unassigned-import */\n' +
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
  const pages = getPages()
  const inject = {
    favicons: fs.readFileSync(path.resolve('./content/.favicons/favicons.html'), 'utf8'),
    ga: `<script async src="https://www.googletagmanager.com/gtag/js?id=${site.siteGA}"></script>
      <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${site.siteGA}');
      </script>`,
  }
  return Promise.all([...pages.map(page => build(page, inject)), include(pages)])
}

module.exports = templates
