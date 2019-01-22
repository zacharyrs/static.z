module.exports = {
  parser: 'sugarss',
  plugins: [
    require('stylelint')(),
    require('postcss-bem-linter')(),
    require('postcss-sorting')({
      order: ['custom-properties', 'dollar-variables', 'declarations', 'at-rules', 'rules'],
      'properties-order': 'alphabetical',
      'unspecified-properties-position': 'bottom',
    }),
    require('postcss-import')(),
    require('postcss-map')(),
    require('postcss-simple-vars')({
      variables: () => {
        const main = require('./src/base/components/css-vars.json')
        const custom = require('./src/content/css-vars.json')

        return { ...main, ...custom }
      },
    }),
    require('postcss-conditionals')(),
    require('postcss-each')(),
    require('postcss-for')(),
    require('postcss-preset-env')({
      stage: 0,
      features: {
        'nesting-rules': false,
      },
    }),
    require('postcss-nested')(),
    require('postcss-font-magician')({ protocol: 'https:' }),
    require('colorguard')(),
    require('doiuse')({
      ignore: ['rem'],
    }),
    require('postcss-reporter')(),
  ],
}
