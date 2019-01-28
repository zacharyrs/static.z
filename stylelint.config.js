module.exports = {
  plugins: ['stylelint-order', 'stylelint-selector-bem-pattern'],
  extends: 'stylelint-config-prettier',
  rules: {
    'plugin/selector-bem-pattern': {
      preset: 'suit',
    },
  },
}
