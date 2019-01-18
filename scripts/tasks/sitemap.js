const fs = require('fs')
const path = require('path')

const getPages = require('./utils').getPages

const site = require(path.resolve('./content/data.json'))

const sitemap = () => {
  return new Promise((resolve, reject) => {
    const pages = getPages()
    const data = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...pages.map(page => {
        let lMod = ''
        let cFreq = ''
        let prio = ''

        if (page.lastMod) {
          lMod = `<lastmod>${page.lastMod}</lastmod>`
        }

        if (page.changeFreq) {
          cFreq = `<changefreq>${page.changeFreq}</changefreq>`
        } else if (site.changeFreq) {
          cFreq = `<changefreq>${site.changeFreq}</changefreq>`
        }

        if (page.priority) {
          prio = `<priority>${page.priority}</priority>`
        } else if (site.priority) {
          prio = `<priority>${site.priority}</priority>`
        }

        return `<url><loc>${site.siteUrl}/${page.path}</loc>${lMod}${cFreq}${prio}</url>`
      }),
      '</urlset>',
    ].join('')

    fs.writeFile('../build/sitemap.xml', data, err => {
      if (err) {
        reject(err)
      }
      resolve()
    })
  })
}

module.exports = sitemap
