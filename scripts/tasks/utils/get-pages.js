const fs = require('fs')
const path = require('path')
const markdownIt = require('markdown-it')

const { mdImages } = require('../../md-mods.js')

const md = markdownIt({
  typographer: true,
}).use(mdImages)

const recursiveFind = (startDir, match) => {
  let results = []

  const files = fs.readdirSync(startDir, { withFileTypes: true })

  files.forEach(file => {
    if (file.isDirectory()) {
      results = results.concat(recursiveFind(startDir + '/' + file.name, match))
    } else if (file.name.match(match)) {
      results.push(startDir + '/' + file.name)
    }
  })

  return results
}

const getPages = () => {
  return recursiveFind('./content/pages', /[A-Za-z\-_]*\.json/).map(file => {
    const locals = require(path.resolve(file))
    const templatePath = `./base/templates/${locals.template}.pug`
    const templateJsPath = `./base/templates/${locals.template}.js`
    const templateSssPath = `./base/templates/${locals.template}.sss`
    const outpath = locals.path || path.dirname(path.relative('./content/pages', file)) + '.html'

    const content = path.dirname(file) + '/' + path.basename(file, '.json') + '.md'
    locals.content = md.render(fs.readFileSync(content, 'utf8'), { dir: path.dirname(content) })

    const page = {
      locals,
      templatePath,
      templateJsPath,
      templateSssPath,
      template: locals.template,
      lastMod: locals.lastMod,
      path: outpath,
    }

    return page
  })
}

module.exports = getPages
