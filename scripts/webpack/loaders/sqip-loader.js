var loaderUtils = require('loader-utils')
var sqip = require('sqip')

// https://codepen.io/tigt/post/optimizing-svgs-in-data-uris
function encodeSvgDataUri(svg) {
  var uriPayload = encodeURIComponent(svg)
    .replace(/%0A/g, '')
    .replace(/%20/g, ' ')
    .replace(/%3D/g, '=')
    .replace(/%3A/g, ':')
    .replace(/%2F/g, '/')
    .replace(/%22/g, "'")

  return 'data:image/svg+xml,' + uriPayload
}

module.exports = function(contentBuffer) {
  if (this.cacheable) {
    this.cacheable(true)
  }

  var content = contentBuffer.toString('utf8')
  var filePath = this.resourcePath

  var sqipResult = sqip({
    filename: filePath,
    numberOfPrimitives: 20,
    mode: 0,
    blur: 12,
  })

  var encodedSvgDataUri = encodeSvgDataUri(sqipResult.final_svg)
  var dimensions = JSON.stringify(sqipResult.img_dimensions)

  if (/^module.exports = "data:(.*)base64,(.*)/.test(content)) {
    var end = content.match(/^module.exports = \"(.*)\"/)[1]
    return (
      'module.exports = {"preview": "' +
      encodedSvgDataUri +
      '", "dimensions": ' +
      dimensions +
      ', "src": "' +
      end +
      '", "srcSet": ""}'
    )
  } else {
    var end = content.match(/^module.exports = {(.*)}/)[1]
    return 'module.exports = {"preview": "' + encodedSvgDataUri + '", "dimensions": ' + dimensions + ', ' + end + '}'
  }
}

module.exports.raw = true
