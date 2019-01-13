const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
// const SitemapPlugin = require('sitemap-webpack-plugin').default
// const RobotsTxtPlugin = require('robotstxt-webpack-plugin')
// const WebappWebpackPlugin = require('webapp-webpack-plugin')
// const GoogleAnalyticsPlugin = require('../../webpack/plugins/google-analytics-webpack-plugin.js')

const getPages = require('./getPages.js')

const site = require(path.resolve('./content/data.json'))

const popConfig = () => {
  let preConfig = require('../../webpack').config
  let pages = getPages()

  let tmpStyles = new Set()

  pages.forEach(page => {
    preConfig.entry[page.template] = page.templateJsPath
    tmpStyles.add(page.templateSssPath)

    preConfig.plugins.push(
      new HtmlWebpackPlugin({
        filename: page.path,
        template: path.resolve('./cache/html', page.path),
        chunks: [page.template, 'styles', 'main'],
        cache: true,
        meta: {
          viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
          description: page.locals.description,
        },
      }),
    )
  })

  preConfig.entry.styles = [...tmpStyles]

  // preConfig.plugins.push(
  //   new GoogleAnalyticsPlugin({
  //     id: site.siteGA,
  //   }),
  // )

  // preConfig.plugins.push(
  //   new SitemapPlugin(site.siteUrl, pages, {
  //     skipGzip: true,
  //   }),
  // )

  // preConfig.plugins.push(
  //   new RobotsTxtPlugin({
  //     policy: [
  //       {
  //         userAgent: 'Googlebot',
  //         allow: '/',
  //         disallow: '',
  //         crawlDelay: 2,
  //       },
  //       {
  //         userAgent: '*',
  //         allow: '/',
  //         disallow: '',
  //         crawlDelay: 10,
  //       },
  //     ],
  //     sitemap: site.siteUrl + '/sitemap.xml',
  //     host: site.siteUrl,
  //   }),
  // )

  // preConfig.plugins.push(
  //   new WebappWebpackPlugin({
  //     logo: './content/logo.png',
  //     cache: true,
  //     prefix: 'assets/',
  //     favicons: {
  //       appName: site.siteName,
  //       appDescription: site.siteDescription,
  //       developerName: site.devName,
  //       developerURL: site.devPage,
  //       background: site.siteTheme.background,
  //       theme_color: site.siteTheme.main,
  //       lang: site.siteLang,
  //       display: 'browser',
  //     },
  //   }),
  // )

  return preConfig
}

module.exports = popConfig
