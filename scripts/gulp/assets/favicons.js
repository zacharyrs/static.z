const fs = require('fs')
const path = require('path')

const gulp = require('gulp')
const gif = require('gulp-if')
const replace = require('gulp-replace')
const favicons = require('gulp-favicons')

const site = require(path.resolve('./content/data.json'))

const config = {
  appName: site.siteName,
  url: site.siteUrl,
  appDescription: site.siteDescription,
  developerName: site.devName,
  developerURL: site.devPage,
  background: site.siteTheme.background,
  theme_color: site.siteTheme.main, // eslint-disable-line camelcase
  path: 'assets/',
  lang: site.siteLang,
  display: 'browser',
  html: 'favicons.html',
  pipeHTML: true,
  replace: true,
}

const generateFavicons = () => {
  return new Promise((resolve, reject) => {
    if (fs.existsSync('./content/.favicons/favicons.html') === false) {
      gulp
        .src('./content/logo.png')
        .pipe(favicons(config))
        // eslint-disable-next-line no-template-curly-in-string
        .pipe(gif('*.html', replace(/"(assets\/.*?)"/g, '"${require(\'content/.favicons/$1\')}"')))
        .on('error', reject)
        .pipe(gif('*.html', gulp.dest('./content/.favicons/'), gulp.dest('./content/.favicons/assets/')))
        .on('end', resolve)
    } else {
      resolve()
    }
  })
}

module.exports = generateFavicons
