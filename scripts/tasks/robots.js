const fs = require('fs')
const path = require('path')

const robotstxt = require('generate-robotstxt').default

const site = require(path.resolve('./content/data.json'))

const robots = () => {
  return new Promise((resolve, reject) => {
    robotstxt({
      policy: [
        {
          userAgent: 'Googlebot',
          allow: '/',
          crawlDelay: 2,
        },
        {
          userAgent: '*',
          allow: '/',
          crawlDelay: 10,
        },
      ],
      sitemap: site.siteUrl + '/sitemap.xml',
      host: site.siteUrl,
    }).then(content => {
      fs.writeFile('../build/robots.txt', content, err => {
        if (err) {
          reject(err)
        }
        resolve()
      })
    })
  })
}

module.exports = robots
