const fs = require('fs')
const path = require('path')

const glob = require('glob')
const pug = require('pug')
const gulp = require('gulp')
const sass = require('gulp-sass')
const postcss = require('gulp-postcss')
const babel = require('gulp-babel')

const customSass = require('../../sass')

const build = () => {
  return new Promise((resolve, reject) => {
    glob('./base/components/**/pattern.json', (error, files) => {
      if (error) reject(error)

      const sassVars = customSass.vars()

      files.forEach(file => {
        const variantsData = JSON.parse(fs.readFileSync(file)).variants || [{}]

        const template = pug.compileFile(path.resolve(path.dirname(file), 'demo.pug'))

        const variants = variantsData
          .map(data => {
            return template({
              ...data,
              patternplate: {
                sassVars,
              },
            })
          })
          .join('<br>')

        fs.mkdirSync(path.resolve('../patterns', path.relative('./base/components/', path.dirname(file))), {
          recursive: true,
        })

        fs.writeFileSync(
          path.resolve('../patterns', path.relative('./base/components/', path.dirname(file)), 'demo.html'),
          variants,
        )
      })

      resolve()
    })
  })
}

const css = () => {
  return gulp
    .src('./base/components/**/demo.scss')
    .pipe(sass({ functions: customSass.functions }).on('error', sass.logError))
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
  return gulp.src(['./base/components/**/*.json']).pipe(gulp.dest('../patterns/'))
}

const demos = gulp.parallel(js, build, css, copy)

const demosWatch = () => {
  gulp.watch(
    [
      './base/components/**/*.pug',
      './base/components/**/pattern.json',
      './base/components/**/*.scss',
      './base/styling/**/*.scss',
      './base/styling/sass-vars.js',
      './content/sass-vars.js',
    ],
    build,
  )
  gulp.watch(
    [
      './base/components/**/*.scss',
      './base/styling/**/*.scss',
      './content/custom.scss',
      './base/styling/sass-vars.js',
      './content/sass-vars.js',
    ],
    css,
  )
  gulp.watch('./base/components/**/*.js', js)
  gulp.watch('./base/components/**/*.json', copy)
}

module.exports = { demos, demosWatch }
