const xo = require('xo')

const ignoredFileWarning = res => {
  return (
    res.warningCount === 1 &&
    res.results[0].messages[0] &&
    res.results[0].messages[0].message &&
    res.results[0].messages[0].message.indexOf('.eslintignore') > -1 &&
    res.results[0].messages[0].message.indexOf('--no-ignore') > -1
  )
}

const lint = (input, config, webpack, callback) => {
  const res = xo.lintText(input, config)

  if ((res.errorCount === 0 && res.warningCount === 0) || res.results.length === 0) {
    if (callback) {
      callback(null, input)
    }

    return
  }

  // Skip ignored file warning
  if (!ignoredFileWarning(res)) {
    if (res.errorCount || res.warningCount) {
      // Add filename for each results so formatter can have relevant filename
      res.results.forEach(r => {
        r.filePath = webpack.resourcePath
      })
      const messages = config.formatter(res.results)

      // Default behavior: emit error only if we have errors
      const emitter = res.errorCount ? webpack.emitError : webpack.emitWarning

      if (emitter) {
        emitter(messages)
        if (res.errorCount) {
          throw new Error('Module failed because of a eslint error.')
        }
      }
    }
  }

  if (callback) {
    return callback(null, input)
  }
}

module.exports = function(input) {
  const config = {
    cwd: this.context,
    filename: this.resourcePath,
    formatter: xo.getFormatter(),
  }

  if (this.cacheable) this.cacheable()

  const callback = this.async()

  // Sync
  if (!callback) {
    lint(input, config, this)

    return input
  }

  // Async
  try {
    lint(input, config, this, callback)
  } catch (error) {
    return callback(error)
  }
}
