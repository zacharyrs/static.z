const { types, scopes } = require('./commitizen.config.js')

const validTypes = types.map(type => type.value)
const validScopes = scopes.map(scope => scope)

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-leading-blank': [2, 'always'],
    'scope-enum': [1, 'always', validScopes],
    'type-enum': [2, 'always', validTypes],
  },
  parserPreset: {
    parserOpts: {
      headerPattern: /^(?:(:\w*?:\s\w+))(?:\((\w*?|\*)\))?:\s((?:.*(?=\())|.*)(?:\(#(\d*)\))?/,
      headerCorrespondence: ['type', 'scope', 'subject', 'ticket'],
    },
  },
}
