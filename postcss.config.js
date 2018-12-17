module.exports = {
  parser: 'sugarss',
  plugins: {
    stylelint: {},
    'postcss-sorting': {
      order: ['custom-properties', 'dollar-variables', 'declarations', 'at-rules', 'rules'],

      'properties-order': 'alphabetical',

      'unspecified-properties-position': 'bottom',
    },
    'postcss-preset-env': { stage: 0 },
    cssnano: {},
  },
}
