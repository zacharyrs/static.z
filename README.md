# ssg.z

my custom design static site generator (because there aren't enough already...)

# todo

## short-term goals

- [] code refactor
  - [] HIGH: consider using input js to parse html files as entries, to avoid html-webpack-plugin hence separate from gulp tasks
  - [] HIGH: change to link css directly in page -> eliminates webpack dependency on gulp tasks
  - [] LOW: use gulp-favicons then inject into all pages via template task at head start/end -> cache
  - [] LOW: inject GA via templates task at body end -> cache
  - [] LOW: create gulp task to generate sitemap based on current webpack plugin -> dist
  - [] LOW: robots.txt via gulp task, use same module -> dist
- [] use gulp to clean dist

## long-term goals

- [] modify template task to include local search indices generation
  - use https://www.npmjs.com/package/atomic-algolia to upload?
  - look into https://www.npmjs.com/package/search-insights - or perhaps link to GA?
- [] add a gulp task that takes all images and outputs them to ./src/cache/images
  - these need to be named such as [filename]-[originalhash]-[size].png
  - ignore images under size 'x', hence url-loader would grab original
  - also generate an sqip preview as [filename]-[originalhash]-prev.svg for all (even small?)
- [] need a custom loader that loads images from ./src/cache/images, as srcset, based on original hash values
  - should warn if image not found?
  - should include svg as inlined data
- [] gulp task that inlines critical css on all build html files before uploading
