const path = require('path')

const mdImages = md => {
  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    var token = tokens[idx]

    let href = token.attrs[token.attrIndex('src')][1]
    let text = token.content
    let title = ''

    if (token.attrIndex('title') !== -1) {
      title = 'title="' + token.attrs[token.attrIndex('title')][1] + '"'
    }

    return `
    <div class="image-wrapper">
    <img class="image-preview" src="\${require('${href}').preview}" alt="${text}" ${title}>
    <img class="image-main" onload="this.classList.add('image-loaded')" src="\${require('${href}').src}" srcset="\${require('${href}').srcSet}" alt="${text}" ${title}>
    </div>
    `
  }
}

module.exports = { mdImages: mdImages }
