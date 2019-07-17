const fs = require('fs')
const path = require('path')

const browserSync = require('browser-sync')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')

const gulp = require('gulp')
const pug = require('gulp-pug')
const rename = require('gulp-rename')
const data = require('gulp-data')
const beautify = require('gulp-jsbeautifier')

const { getPages, populateConfig, constructMenu } = require('./utils')

const site = require(path.resolve('./content/data.json'))

const browser = browserSync.create()

const webpackDev = () => {
  const config = populateConfig()
  const bundler = webpack(config)

  const devMiddleware = webpackDevMiddleware(bundler, {
    stats: { colors: true },
    publicPath: config.output.publicPath,
  })

  const hotMiddleware = webpackHotMiddleware(bundler, {
    log: console.log,
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000,
  })

  browser.init({
    server: '../dist',
    middleware: [devMiddleware, hotMiddleware],
  })
}

const compilePug = (page, inject) => {
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

const webpackPrecompile = () => {
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
  site.menu = constructMenu(pages)
  return Promise.all([...pages.map(page => compilePug(page, inject))])
}

const webpackPrecompileWatch = () => {
  gulp.watch(['./base/**/*.pug', './content/**/*'], () => {
    return Promise.all([
      webpackPrecompile(),
      new Promise(resolve => {
        browser.reload()
        resolve()
      }),
    ])
  })
}

const webpackProd = () => {
  return new Promise((resolve, reject) => {
    const config = populateConfig()

    webpack(config, (err, stats) => {
      if (err || stats.hasErrors()) reject(err || stats.toString({ colors: true }))
      console.log(stats.toString({ colors: true }))
      resolve()
    })
  })
}

const dev = gulp.parallel(gulp.series(webpackPrecompile, webpackDev), webpackPrecompileWatch)
const prod = gulp.series(webpackPrecompile, webpackProd)

module.exports = { dev, prod }
