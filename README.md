# static.z

my custom design static site generator (because there aren't enough already...)

features custom pug templating, with markdown and json defined contents
development has hmr and auto reloads for html changes, but is limited due to
html-webpack-plugin usage in that new templates require a server restart

production also additionally minifies and optomizes all resources, and will
eventually inline critical css

## todo

### short-term goals

- [ ] code refactor
  - [ ] ONHOLD-HIGH (TODO - HTML): consider using input js to parse html files
        as entries, to avoid html-webpack-plugin hence separate from gulp tasks
- [ ] use gulp to clean dist

### long-term goals

- [ ] modify template task to include local search indices generation
  - use atomic-algolia to upload?
  - look into search-insights - or perhaps link to GA?
- [ ] gulp task that inlines critical css on all build html files before uploading
