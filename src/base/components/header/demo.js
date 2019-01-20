/* eslint-disable  import/extensions */
/* eslint-disable  import/no-unresolved */

import * as html from './header.html'
import * as css from './header.css'

export { html, css }

export default () => {
  console.log('hi')
}

// Alternate approach
// module.exports = {
//   default: () => {},
//   html: `<h1 class="hello-world">Hello World</h1>`,
//   css: `.hello-world { font-family: sans-serif; color: cornflowerblue; }`,
// }
