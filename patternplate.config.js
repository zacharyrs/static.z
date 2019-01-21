module.exports = {
  docs: ['README.md', 'docs/**/*.md'],
  entry: ['lib/**/demo.js'],
  render: '@patternplate/render-default/render',
  mount: '@patternplate/render-default/mount',
  ui: {
    // Global colors
    colorActive: 'rgb(119, 126, 237)',
    colorError: 'rgb(255, 60, 107)',
    colorWarning: 'rgb(222, 166, 139)',
    colorInfo: 'rgb(103, 189, 221)',
    colorSuccess: 'rgb(113, 212, 120)',

    // Dark context colors
    colorBackgroundDark: 'rgb(8, 15, 23)',
    colorBackgroundSecondaryDark: 'rgb(11, 23, 34)',
    colorBackgroundTertiaryDark: 'rgb(11, 23, 34)',
    colorBorderDark: 'rgb(11, 23, 34)',
    colorTextDark: 'rgb(242, 242, 242)',
    colorRecessDark: 'rgb(153, 153, 153)',

    // Light context colors
    colorBackgroundLight: 'rgb(255, 255, 255)',
    colorBackgroundSecondaryLight: 'rgb(246, 248, 250)',
    colorBackgroundTertiaryLight: 'rgb(246, 248, 250)',
    colorBorderLight: 'rgb(228, 228, 228)',
    colorTextLight: 'rgb(68, 68, 68)',
    colorRecessLight: 'rgb(106, 115, 125)',
  },
}
