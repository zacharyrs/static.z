const fs = require('fs')
const path = require('path')

const glob = require('glob')

const md = require('../../modded-markdown-it')

const getPages = () => {
  return glob.sync('./content/pages/**/*.json').map(file => {
    const locals = require(path.resolve(file))
    const templatePath = `./base/templates/${locals.template}.pug`
    const templateJsPath = `./base/templates/${locals.template}.js`
    const templateScssPath = `./base/templates/${locals.template}.scss`
    const outpath = locals.path || path.dirname(path.relative('./content/pages', file)) + '.html'

    const content = path.dirname(file) + '/' + path.basename(file, '.json') + '.md'
    locals.content = md.render(fs.readFileSync(content, 'utf8'), { dir: path.dirname(content) })

    const page = {
      locals,
      templatePath,
      templateJsPath,
      templateScssPath,
      template: locals.template,
      lastMod: locals.lastMod,
      path: outpath,
    }

    return page
  })
}

module.exports = getPages
