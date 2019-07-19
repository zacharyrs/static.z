const gulp = require('gulp')
const responsive = require('gulp-responsive')
const hash = require('gulp-hash-filename')
const sqippy = require('gulp-sqippy')

const processImages = () => {
  return gulp
    .src('./content/pages/**/*.{png|jpg}')
    .pipe(hash())
    .pipe(
      sqippy({
        primitives: 10,
        blur: 12,
        includeSource: true,
      }),
    )
    .pipe(
      responsive(
        {
          '*-transparent.png': [
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
          '*.png': [
            {
              width: 300,
              rename: {
                suffix: '-300',
                extname: 'jpeg',
              },
            },
            {
              width: 600,
              rename: {
                suffix: '-600',
                extname: 'jpeg',
              },
            },
            {
              width: 1200,
              rename: {
                suffix: '-1200',
                extname: 'jpeg',
              },
            },
            {
              width: 2000,
              rename: {
                suffix: '-2000',
                extname: 'jpeg',
              },
            },
          ],
          '*.jpg': [
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
        },
        {
          progressive: true,
          passThroughUnused: true,
        },
      ),
    )
    .pipe(gulp.dest('./.cache/images/'))
}

module.exports = processImages
