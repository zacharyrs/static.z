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

        let templateFile = path.resolve(path.dirname(file), path.basename(path.dirname(file)))
        if (fs.existsSync(templateFile + '.demo.pug')) {
          templateFile += '.demo.pug'
        } else {
          templateFile += '.pug'
        }

        const template = pug.compileFile(templateFile)

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
      './base/components/**/sass-vars.js',
      './content/**/sass-vars.js',
    ],
    build,
  )
  gulp.watch(
    [
      './base/components/**/*.scss',
      './content/custom.scss',
      './base/components/**/sass-vars.js',
      './content/**/sass-vars.js',
    ],
    css,
  )
  gulp.watch('./base/components/**/*.js', js)
  gulp.watch('./base/components/**/*.json', copy)
}

module.exports = { demos, demosWatch }
