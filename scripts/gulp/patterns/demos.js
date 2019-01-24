const fs = require('fs')
const path = require('path')

const glob = require('glob')
const pug = require('pug')
const gulp = require('gulp')
const rename = require('gulp-rename')
const postcss = require('gulp-postcss')
const babel = require('gulp-babel')

const build = () => {
  return new Promise((resolve, reject) => {
    glob('./base/components/**/pattern.json', (error, files) => {
      if (error) reject(error)

      delete require.cache[require.resolve('./base/components/css-vars.js')]
      const main = require('./base/components/css-vars.js') // eslint-disable-line import/no-unresolved
      delete require.cache[require.resolve('./content/css-vars.js')]
      const custom = require('./content/css-vars.js') // eslint-disable-line import/no-unresolved

      files.forEach(file => {
        const variantsData = JSON.parse(fs.readFileSync(file)).variants || [{}]
        const template = pug.compileFile(path.resolve(path.dirname(file), path.basename(path.dirname(file)) + '.pug'))

        const variants = variantsData
          .map(data => {
            return template({
              ...data,
              patternplate: {
                cssVars: {
                  ...main,
                  ...custom,
                },
              },
            })
          })
          .join('<br>')

        fs.mkdirSync(path.resolve('../patterns', path.relative('./base/components/', path.dirname(file))), {
          recursive: true,
        })

        fs.writeFileSync(
          path.resolve(
            '../patterns',
            path.relative('./base/components/', path.dirname(file)),
            path.basename(path.dirname(file)) + '.html',
          ),
          variants,
        )
      })

      resolve()
    })
  })
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
    .pipe(gulp.dest('../patterns/'))
}

const js = () => {
  return gulp
    .src('./base/components/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('../patterns/'))
}

const copy = () => {
  return gulp
    .src(['./base/components/**/*.json', '!./base/components/**/css-vars.json'])
    .pipe(gulp.dest('../patterns/'))
}

const demos = gulp.parallel(js, build, css, copy)

const demosWatch = () => {
  gulp.watch(
    [
      './base/components/**/*.pug',
      './base/components/**/pattern.json',
      './base/components/**/css-vars.json',
      './content/**/css-vars.json',
    ],
    build,
  )
  gulp.watch(
    [
      './base/components/**/*.sss',
      './content/custom.sss',
      './base/components/**/css-vars.json',
      './content/**/css-vars.json',
    ],
    css,
  )
  gulp.watch('./base/components/**/*.js', js)
  gulp.watch('./base/components/**/*.json', copy)
}

module.exports = { demos, demosWatch }
