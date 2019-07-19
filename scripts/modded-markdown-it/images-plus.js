const path = require('path')

const imagesPlus = md => {
  md.renderer.rules.image = (tokens, idx, options, env) => {
    const token = tokens[idx]

    const text = token.content
    let title = ''

    if (token.attrIndex('title') !== -1) {
      title = 'title="' + token.attrs[token.attrIndex('title')][1] + '"'
    }

    // TODO: check for youtube links, including remote, etc
    // Download remote images and generate preview svgs
    // Resize local images
    let href = token.attrs[token.attrIndex('src')][1]

    if (href.startsWith('./')) {
      // Local image file

      href = path.join(env.dir, href)

      return `
      <span class="image-wrapper">
      <div class="image-aspect">
      <img class="image-preview" src="\${require('${href}').preview}" alt="${text}" ${title}>
      <img class="image-main" onload="this.classList.add('image-loaded')" src="\${require('${href}').src}" srcset="\${require('${href}').srcSet}" alt="${text}" ${title}>
      </div>
      </span>
      `
    }

    return `
    <span class="image-wrapper">
    <div class="image-aspect">
    <img class="image-main" onload="this.classList.add('image-loaded')" src="${href}" alt="${text}" ${title}>
    </div>
    </span>
    `
  }
}

module.exports = imagesPlus
