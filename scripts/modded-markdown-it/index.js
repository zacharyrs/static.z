const markdownIt = require('markdown-it')
const markdownItContainer = require('markdown-it-container')
const markdownItFontAwesome = require('markdown-it-fontawesome')
const markdownItFootNote = require('markdown-it-footnote')
const markdownItAnchor = require('markdown-it-anchor')
const markdownItAttrs = require('markdown-it-attrs')
const markdownItHeaderSections = require('markdown-it-header-sections')
const markdownItMultiTable = require('markdown-it-multimd-table')
const markdownItSup = require('markdown-it-sup')
const markdownItSub = require('markdown-it-sub')

const imagesPlus = require('./images-plus.js')

const md = markdownIt({
  typographer: true,
})
  .use(imagesPlus)
  .use(markdownItContainer)
  .use(markdownItFontAwesome)
  .use(markdownItFootNote)
  .use(markdownItAnchor)
  .use(markdownItAttrs)
  .use(markdownItHeaderSections)
  .use(markdownItSup)
  .use(markdownItSub)
  .use(markdownItMultiTable)

module.exports = md
