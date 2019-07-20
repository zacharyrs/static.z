const fs = require('fs')
const crypto = require('crypto')

const loaderUtils = require('loader-utils')
const glob = require('glob')
const imageSize = require('image-size')

const encodeSVG = svg => {
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

  const loaderContext = this
  const outputContext = this.rootContext || (this.options && this.options.context)
  const image = fs.readFileSync(this.resourcePath)

  const dims = imageSize(image)
  const aspect = (dims.width / dims.height) * 100

  const hash = crypto.createHash('md5')
  hash.update(image)
  const imageHash = hash.digest('hex')

  console.log(imageHash)

  const content = contentBuffer.toString('utf8')
  if (/^module.exports = "data:(.*)base64,(.*)/.test(content)) {
    // Base64 encoded src -> small file
    // Return it as the source and preview
    // Still need aspect ratio from original image
    const srcEmbed = '"' + content.match(/^module.exports = "(.*)"/)[1] + '"'

    return 'module.exports = {"preview":' + srcEmbed + ',"src":' + srcEmbed + ',"aspect":' + aspect + ',"srcSet":""}'
  }

  console.log('File is large -> load the preview')
  const prvw = encodeSVG(fs.readFileSync(`./content/.images/${imageHash}-preview.svg`))

  const images = []

  glob.sync(`./content/.images/${imageHash}-+([0-9]).*`).forEach(file => {
    const currentImage = fs.readFileSync(file)
    // Mark file as a dependency here?

    const width = parseInt(file.match(/.*-(\d+)\..*/)[1], 10)

    const outputPath = loaderUtils
      .interpolateName(loaderContext, 'images/[name]-[hash]-[width].[ext]', {
        context: outputContext,
        content: currentImage,
      })
      .replace(/\[width\]/gi, width)

    loaderContext.emitFile(outputPath, currentImage)

    images.push({ outputPath, width })
  })

  images.sort((a, b) => (a.width > b.width ? 1 : -1))

  const srcSet = images.map(f => `__webpack_public_path__+"${f.outputPath} ${f.width}w"`).join('+","+')

  return (
    'module.exports = {' +
    '"preview":"' +
    prvw +
    '","src":__webpack_public_path__+"' +
    images[0].outputPath +
    '","aspect":' +
    aspect +
    ',"srcSet":' +
    srcSet +
    '}'
  )
}

module.exports.raw = true
