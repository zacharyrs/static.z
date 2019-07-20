const fs = require('fs')
const path = require('path')

const glob = require('glob')

const gulp = require('gulp')
const rename = require('gulp-rename')
const ignore = require('gulp-ignore')
const responsive = require('gulp-responsive')
const hash = require('gulp-hash-filename')

const sqip = require('sqip').default

const hashImages = () => {
  return gulp
    .src('./content/pages/**/*.{png,jpg,webp}')
    .pipe(
      hash({
        format: '{hash}{ext}',
      }),
    )
    .pipe(
      rename({
        dirname: '',
      }),
    )
    .pipe(gulp.dest('./.cache/images/'))
}

const transforms = {
  '*.png': [
    {
      width: 300,
      rename: {
        suffix: '-300',
        extname: 'webp',
      },
    },
    {
      width: 600,
      rename: {
        suffix: '-600',
        extname: 'webp',
      },
    },
    {
      width: 1200,
      rename: {
        suffix: '-1200',
        extname: 'webp',
      },
    },
    {
      width: 2000,
      rename: {
        suffix: '-2000',
        extname: 'webp',
      },
    },
  ],
  '*.(webp|jpg|jpeg)': [
    {
      width: 300,
      rename: {
        suffix: '-300',
      },
    },
    {
      width: 600,
      rename: {
        suffix: '-600',
      },
    },
    {
      width: 1200,
      rename: {
        suffix: '-1200',
      },
    },
    {
      width: 2000,
      rename: {
        suffix: '-2000',
      },
    },
  ],
}

const resizeImages = () => {
  return gulp
    .src('./.cache/images/*')
    .pipe(
      ignore.exclude(file => {
        fs.existsSync(`./content/.images/${file.basename.replace(file.extname, '-preview.svg')}`)
      }),
    )
    .pipe(
      responsive(transforms, {
        silent: true,
        progressive: true,
        errorOnEnlargement: false,
        errorOnUnusedConfig: false,
      }),
    )
    .pipe(gulp.dest('./content/.images/'))
}

const sqipImages = () => {
  return Promise.all(
    glob.sync('./.cache/images/*').map(file => {
      const out = path.basename(file).replace(path.extname(file), '-preview.svg')

      if (fs.existsSync(`./content/.images/${out}`)) return Promise.resolve()

      return new Promise((resolve, reject) => {
        sqip({
          input: file,
          plugins: [
            { name: 'sqip-plugin-primitive', options: { numberOfPrimitives: 50, mode: 1 } },
            'sqip-plugin-blur',
            'sqip-plugin-svgo',
          ],
        }).then(result => {
          fs.writeFile(`./content/.images/${out}`, result.svg, err => {
            if (err) {
              reject(err)
            }

            resolve()
          })
        })
      })
    }),
  )
}

const processImages = gulp.series(hashImages, gulp.parallel(resizeImages, sqipImages))

module.exports = processImages
