const fs = require('fs')
const path = require('path')

const gulp = require('gulp')
const gif = require('gulp-if')
const replace = require('gulp-replace')
const favicons = require('gulp-favicons')

const site = require(path.resolve('./content/data.json'))

const generateFavicons = () => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync('./cache/favicons/favicons.html')) {
      gulp
        .src('./content/logo.png')
        .pipe(
          favicons({
            appName: site.siteName,
            url: site.siteUrl,
            appDescription: site.siteDescription,
            developerName: site.devName,
            developerURL: site.devPage,
            background: site.siteTheme.background,
            theme_color: site.siteTheme.main,
            path: 'assets/',
            lang: site.siteLang,
            display: 'browser',
            html: 'favicons.html',
            pipeHTML: true,
            replace: true,
          }),
        )
        .pipe(gif('*.html', replace(/\"(assets\/.*?)\"/g, '"${require(\'cache/favicons/$1\')}"')))
        .on('error', reject)
        .pipe(gif('*.html', gulp.dest('./cache/favicons/'), gulp.dest('./cache/favicons/assets/')))
        .on('end', resolve)
    } else {
      resolve()
    }
  })
}

module.exports = generateFavicons
