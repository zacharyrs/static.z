module.exports = {
  plugins: ['stylelint-scss', 'stylelint-order'],
  extends: 'stylelint-config-prettier',
  rules: {
    'length-zero-no-unit': true,
    'string-no-newline': true,
    'property-no-unknown': true,
    'order/properties-alphabetical-order': true,
    'scss/at-else-if-parentheses-space-before': 'always',
    'scss/at-if-closing-brace-newline-after': 'always-last-in-chain',
    'scss/at-else-closing-brace-newline-after': 'always-last-in-chain',
    'scss/at-if-closing-brace-space-after': 'always-intermediate',
    'scss/at-else-closing-brace-space-after': 'always-intermediate',
    'scss/at-else-empty-line-before': 'never',
    'at-rule-empty-line-before': [
      'always',
      { ignore: ['after-comment', 'first-nested', 'blockless-after-same-name-blockless'], ignoreAtRules: ['else'] },
    ],
    'scss/at-extend-no-missing-placeholder': true,
    'scss/at-function-named-arguments': ['always', { ignore: ['single-argument'], ignoreFunctions: ['/^(?!ssg-)/i'] }],
    'scss/at-mixin-named-arguments': ['always', { ignore: ['single-argument'] }],
    'scss/at-mixin-parentheses-space-before': 'never',
    'scss/at-function-parentheses-space-before': 'never',
    'scss/double-slash-comment-empty-line-before': [
      'always',
      { except: ['first-nested'], ignore: ['between-comments', 'stylelint-commands'] },
    ],
    'scss/double-slash-comment-whitespace-inside': 'always',
    'scss/at-mixin-pattern': /ssg.+/,
    'scss/at-function-pattern': /ssg.+/,
    'scss/percent-placeholder-pattern': /ssg.+/,
    'scss/at-mixin-argumentless-call-parentheses': 'always',
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': true,
    // 'scss/operator-no-newline-after': true, // Goes against Prettier
    // 'scss/operator-no-newline-before': true, // Prettier handles this
    // 'scss/operator-no-unspaced': true, // Prettier handles this
    // 'scss/dollar-variable-colon-newline-after': 'always-multi-line', // Waiting for function and map support
    'scss/dollar-variable-colon-space-after': 'always-single-line',
    'scss/dollar-variable-colon-space-before': 'never',
  },
}
