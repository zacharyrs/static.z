const types = [
  {
    value: ':wrench: chore',
    name: '🔧   chore     Changes to the build process or auxiliary tools and libraries',
  },
  {
    value: ':memo: docs',
    name: '📝   docs      Changes to only documentation',
  },
  {
    value: ':sparkles: feat',
    name: '✨   feat      Added a new feature',
  },
  {
    value: ':bug: fix',
    name: '🐛   fix       Bug fix(es)',
  },
  {
    value: ':zap: perf',
    name: '⚡️   perf      Improments to performance',
  },
  {
    value: ':fire: prune',
    name: '🔥   prune     Removing code or files.',
  },
  {
    value: ':recycle: refactor',
    name: '♻️   refactor  Code rewrite for better readibility, without changes to functionality.',
  },
  {
    value: ':rewind: revert',
    name: '⏪   revert    Revert to a commit',
  },
  {
    value: ':art: style',
    name: '🎨   style     Changes to code style, without impact on meaning',
  },
  {
    value: ':white_check_mark: test',
    name: '✅   test      Adding missing tests',
  },
  {
    value: ':construction: wip',
    name: '🚧   wip       Functionality addition in progress',
  },
]

const scopes = [
  'components',
  'components--card',
  'components--header',
  'components--footer',
  'components--palette',
  'components--typography',
  'templates',
  'meta',
  'yarn',
  '*',
]

module.exports = {
  types,
  scopes,
  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix', 'perf', 'refactor'],
}
