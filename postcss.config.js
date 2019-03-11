module.exports = {
  parser: 'postcss-scss',
  plugins: [
    // Linting and fixing
    require('stylelint')(),
    require('postcss-sorting')({
      order: ['custom-properties', 'dollar-variables', 'declarations', 'at-rules', 'rules'],
      'properties-order': 'alphabetical',
      'unspecified-properties-position': 'bottom',
    }),

    // Shorthands
    require('postcss-short')(),

    // Nicer easings
    require('postcss-easings')(),
    require('postcss-easing-gradients')(),

    // Next generation CSS features
    require('postcss-preset-env')({
      stage: 0,
      features: {
        'nesting-rules': false,
      },
    }),

    // Automatic font rules
    require('postcss-font-magician')({ protocol: 'https:' }),

    // Check for browser compatibility
    require('doiuse')({
      ignore: ['rem'],
    }),

    // Print reported issues nicely
    require('postcss-reporter')({ clearReportedMessages: true }),
  ],
}
