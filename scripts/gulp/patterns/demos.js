const fs = require('fs')
const path = require('path')

const glob = require('glob')
const pug = require('pug')
const gulp = require('gulp')
const sass = require('gulp-sass')
const postcss = require('gulp-postcss')
const babel = require('gulp-babel')
const sassExport = require('sass-export').exporter

const build = () => {
  return new Promise((resolve, reject) => {
    glob('./base/components/**/pattern.json', (error, files) => {
      if (error) reject(error)

      const cssVars = sassExport({
        inputFiles: ['./base/components/css-vars.scss', './content/css-vars.scss'],
      }).getStructured()

      console.log(cssVars)

      files.forEach(file => {
        const variantsData = JSON.parse(fs.readFileSync(file)).variants || [{}]
        const template = pug.compileFile(path.resolve(path.dirname(file), path.basename(path.dirname(file)) + '.pug'))

        const variants = variantsData
          .map(data => {
            return template({
              ...data,
              patternplate: {
                cssVars,
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
    .src('./base/components/**/*.scss')
    .pipe(sass().on('error', sass.logError))
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
      './base/components/**/css-vars.scss',
      './content/**/css-vars.scss',
    ],
    build,
  )
  gulp.watch(
    [
      './base/components/**/*.scss',
      './content/custom.scss',
      './base/components/**/css-vars.scss',
      './content/**/css-vars.scss',
    ],
    css,
  )
  gulp.watch('./base/components/**/*.js', js)
  gulp.watch('./base/components/**/*.json', copy)
}

module.exports = { demos, demosWatch }
