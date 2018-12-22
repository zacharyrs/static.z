const fs = require('fs')
const path = require('path')

const recursiveLoad = (startDir, match) => {
  let results = []

  var files = fs.readdirSync(startDir, { withFileTypes: true })

  files.forEach(file => {
    if (file.isDirectory()) {
      results = results.concat(recursiveLoad(startDir + '/' + file.name, match))
    } else if (file.name.match(match)) {
      results.push(startDir + '/' + file.name)
    }
  })

  return results
}

module.exports = (srcDir, dev) => {
  var pagesData = recursiveLoad(srcDir + '/content/pages', /[A-Za-z\-\_]*\.json/)

  var pages = []
  var templates = []

  pagesData.forEach(pageData => {
    let meta = require(pageData)
    let page = meta.path || path.dirname(path.relative(srcDir + '/content/pages', pageData)) + '.html'
    let content = path.dirname(pageData) + '/' + path.basename(pageData, '.json') + '.md'

    if (!templates.includes(meta.template)) {
      templates.push(meta.template)
    }

    pages.push({
      template: srcDir + '/base/templates/' + meta.template + '.pug',
      chunks: [meta.template, ...(dev ? ['serve'] : [])],
      cache: true,
      title: meta.title,
      filename: page,
      meta: {
        viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
        description: meta.description,
      },
      content: content,

      // favicon: './src/content/favicon.ico'
    })
  })

  module.data = require(srcDir + '/content/data.json')
  module.sitemap = {}
  module.pages = pages
  module.templates = templates

  return module
}
