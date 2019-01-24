module.exports = {
  parser: 'sugarss',
  plugins: [
    // Linting and fixing
    require('stylelint')(),
    require('postcss-bem-linter')(),
    require('postcss-sorting')({
      order: ['custom-properties', 'dollar-variables', 'declarations', 'at-rules', 'rules'],
      'properties-order': 'alphabetical',
      'unspecified-properties-position': 'bottom',
    }),

    // Importing new files
    require('postcss-import')(),

    // Variables in CSS
    require('postcss-map')(),

    // Enable inline media queries
    require('postcss-inline-media')(),

    // Loops and conditions
    require('postcss-each')(),
    require('postcss-for')(),
    require('postcss-conditionals')(),

    // $ sign variables
    require('postcss-simple-vars')({
      variables: () => {
        delete require.cache[require.resolve('./src/base/components/css-vars.js')]
        const main = require('./src/base/components/css-vars.js')
        delete require.cache[require.resolve('./src/content/css-vars.js')]
        const custom = require('./src/content/css-vars.js')

        return { ...main, ...custom }
      },
    }),

    // Shorthands
    require('postcss-short')(),
    require('postcss-easings')(),

    // Next generation CSS features
    require('postcss-preset-env')({
      stage: 0,
      features: {
        'nesting-rules': false,
      },
    }),

    // Nicer nesting
    require('postcss-nested')(),

    // Automatic font rules
    require('postcss-font-magician')({ protocol: 'https:' }),
    require('rfs')(),

    // Preprocess calcs
    require('postcss-calc')(),

    // Check for colour consistency
    require('colorguard')(),

    // Check for browser compatibility
    require('doiuse')({
      ignore: ['rem'],
    }),

    // Print reported issues nicely
    require('postcss-reporter')(),
  ],
}
