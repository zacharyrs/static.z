class GoogleAnalyticsPlugin {
  constructor({ id }) {
    this.id = id
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('GoogleAnalyticsPlugin', compilation => {
      compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tapAsync('GoogleAnalyticsPlugin', (data, cb) => {
        data.html = data.html.replace(
          '</body>',
          `<script async src="https://www.googletagmanager.com/gtag/js?id=${this.id}"></script>
          <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${this.id}');
          </script>
          </body>`,
        )
        cb(null, data)
      })
    })
  }
}

module.exports = GoogleAnalyticsPlugin
