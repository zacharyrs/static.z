const markdownIt = require('markdown-it')

const imagesPlus = require('./images-plus.js')

const md = markdownIt({
  typographer: true,
}).use(imagesPlus)

module.exports = md
