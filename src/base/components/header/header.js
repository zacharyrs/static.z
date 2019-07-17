const registerScroll = () => {
  // Get the header
  const header = document.querySelector('#header')

  window.addEventListener('scroll', () => {
    console.log('test')
    if (parent.pageYOffset > 100) {
      header.classList.remove('header-wrapper_fullwidth')
    } else {
      header.classList.add('header-wrapper_fullwidth')
    }
  })
}

export { registerScroll }
