const fs = require('fs')
const path = require('path')

const gulp = require('gulp')
const pug = require('gulp-pug')
const rename = require('gulp-rename')
const data = require('gulp-data')
const beautify = require('gulp-jsbeautifier')

const getPages = require('./utils').getPages

const site = require(path.resolve('./content/data.json'))

const build = (page, inject) => {
  return new Promise((resolve, reject) => {
    gulp
      .src(page.templatePath)
      .pipe(rename(page.path))
      .pipe(
        data(file => {
          return { page: page.locals, site: site, inject: inject }
        }),
      )
      .pipe(
        pug({
          locals: {
            req: (ifile, local = false) => {
              ifile = path.relative('.', path.resolve(path.dirname(page.templatePath), ifile))
              return `\${require('${ifile}')}`
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

// TODO - HTML: Waiting on extract-loader fix regarding interpolation
const include = pages => {
  return new Promise((resolve, reject) => {
    let tmpStyles = new Set()
    // let tmpPages = new Set()

    pages.forEach(page => {
      tmpStyles.add(path.join('../', page.templateSssPath))
      // tmpPages.add(path.resolve('./cache/html', page.path))
    })

    // fs.writeFile(
    //   './cache/html.js',
    //   [...tmpPages]
    //     .map(x => {
    //       return `require('${x}')`
    //     })
    //     .join('\n'),
    //   err => {
    //     if (err) {
    //       reject(err)
    //     }
    //   },
    // )

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
  let inject = {
    favicons: fs.readFileSync(path.resolve('./cache/favicons/favicons.html'), 'utf8'),
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
