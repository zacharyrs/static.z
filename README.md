# ssg.z

my custom design static site generator (because there aren't enough already...)

features custom pug templating, with markdown and json defined contents
development has hmr and auto reloads for html changes, but is limited due to html-webpack-plugin usage in that new templates require a server restart

production also additionally minifies and optomizes all resources, and will eventually inline critical css

# todo

## short-term goals

- [ ] code refactor
  - [ ] ONHOLD-HIGH (TODO - HTML): consider using input js to parse html files as entries, to avoid html-webpack-plugin hence separate from gulp tasks
- [ ] use gulp to clean dist

## long-term goals

- [ ] modify template task to include local search indices generation
  - use https://www.npmjs.com/package/atomic-algolia to upload?
  - look into https://www.npmjs.com/package/search-insights - or perhaps link to GA?
- [ ] add a gulp task that takes all images and outputs them to ./src/cache/images
  - these need to be named such as [filename]-[originalhash]-[size].png
  - ignore images under size 'x', hence url-loader would grab original
  - also generate an sqip preview as [filename]-[originalhash]-prev.svg for all (even small?)
- [ ] need a custom loader that loads images from ./src/cache/images, as srcset, based on original hash values
  - should warn if image not found?
  - should include svg as inlined data
- [ ] gulp task that inlines critical css on all build html files before uploading
