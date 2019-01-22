const gulp = require('gulp')

const { demos, demosWatch } = require('./demos.js')
const patternplate = require('./patternplate.js')

const patterns = gulp.series(demos, gulp.parallel(demosWatch, patternplate))

module.exports = patterns
