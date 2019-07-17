class MenuItem {
  constructor(title) {
    this.title = title
    this.link = null
    this.rank = 0
    this.children = []
    this.hasChildren = false
  }
}

const constructMenu = pages => {
  const out = new MenuItem('root-static.z')

  pages.forEach(page => {
    const menus = page.locals.menu ? page.locals.menu.split('.') : []

    let parent = out

    for (let i = 0; i < menus.length; i++) {
      const menu = menus[i]

      const newParent = parent.children.filter(e => e.title === menu)
      if (newParent.length > 0) {
        parent = newParent[0]

        if (i === menus.length - 1) {
          parent.link = page.path
        }
      } else {
        const item = new MenuItem(menu)
        parent.children.push(item)
        parent.hasChildren = true

        if (i === menus.length - 1) {
          item.link = page.path
        }
      }
    }
  })

  return out.children
}

module.exports = constructMenu
