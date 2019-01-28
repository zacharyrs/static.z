const sqip = require('sqip')

const encodeSvgDataUri = svg => {
  return (
    'data:image/svg+xml,' +
    encodeURIComponent(svg)
      .replace(/%0A/g, '')
      .replace(/%20/g, ' ')
      .replace(/%3D/g, '=')
      .replace(/%3A/g, ':')
      .replace(/%2F/g, '/')
      .replace(/%22/g, "'")
  )
}

module.exports = function(contentBuffer) {
  if (this.cacheable) this.cacheable()

  const content = contentBuffer.toString('utf8')
  const filePath = this.resourcePath

  const sqipResult = sqip({
    filename: filePath,
    numberOfPrimitives: 10,
    mode: 0,
    blur: 12,
  })

  const prvw = encodeSvgDataUri(sqipResult.final_svg)
  const dims = JSON.stringify(sqipResult.img_dimensions)
  let src
  let srcSet

  if (/^module.exports = "data:(.*)base64,(.*)/.test(content)) {
    // Base64 encoded src, no srcSet
    src = '"' + content.match(/^module.exports = "(.*)"/)[1] + '"'
    srcSet = '""'
  } else {
    // Larger image, with src and srcSet
    src = content.match(/^module.exports = {.*src:(.*?),.*}/)[1]
    srcSet = content.match(/^module.exports = {.*srcSet:(.*?),\w*?:.*}/)[1]
  }

  return (
    'module.exports = {"preview":"' + prvw + '","dimensions":' + dims + ',"src":' + src + ',"srcSet":' + srcSet + '}'
  )
}

module.exports.raw = true
