const fs = require('fs')
const path = require('path')

const mdImages = require('../../mdMods.js').mdImages
const md = require('markdown-it')({
  typographer: true,
}).use(mdImages)

const recursiveFind = (startDir, match) => {
  let results = []

  let files = fs.readdirSync(startDir, { withFileTypes: true })

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
  return recursiveFind('./content/pages', /[A-Za-z\-\_]*\.json/).map(file => {
    let locals = require(path.resolve(file))
    let templatePath = `./base/templates/${locals.template}.pug`
    let templateJsPath = `./base/templates/${locals.template}.js`
    let templateSssPath = `./base/templates/${locals.template}.sss`
    let outpath = locals.path || path.dirname(path.relative('./content/pages', file)) + '.html'

    let content = path.dirname(file) + '/' + path.basename(file, '.json') + '.md'
    locals.content = md.render(fs.readFileSync(content, 'utf8'), { dir: path.dirname(content) })

    let page = {
      locals: locals,
      templatePath: templatePath,
      templateJsPath: templateJsPath,
      templateSssPath: templateSssPath,
      template: locals.template,
      lastMod: locals.lastMod,
      path: outpath,
    }

    return page
  })
}

module.exports = getPages
