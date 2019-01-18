const loaderUtils = require('loader-utils')
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
  this.cacheable && this.cacheable()

  const content = contentBuffer.toString('utf8')
  const filePath = this.resourcePath

  const sqipResult = sqip({
    filename: filePath,
    numberOfPrimitives: 20,
    mode: 0,
    blur: 12,
  })

  const prvw = encodeSvgDataUri(sqipResult.final_svg)
  const dims = JSON.stringify(sqipResult.img_dimensions)

  if (/^module.exports = "data:(.*)base64,(.*)/.test(content)) {
    // base64 encoded src, no srcSet
    var src = '"' + content.match(/^module.exports = \"(.*)\"/)[1] + '"'
    var srcSet = '""'
  } else {
    // larger image, with src and srcSet
    var src = content.match(/^module.exports = {.*src:(.*?),.*}/)[1]
    var srcSet = content.match(/^module.exports = {.*srcSet:(.*?),\w*?:.*}/)[1]
  }

  return (
    'module.exports = {"preview":"' + prvw + '","dimensions":' + dims + ',"src":' + src + ',"srcSet":' + srcSet + '}'
  )
}

module.exports.raw = true
