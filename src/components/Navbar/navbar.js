/**
 * This module displays and contains the logic of the language button switch
 */

const Navbar = {
  /** Display the language button */
  render: async () => {
    const view = /* html */`
            <div class="ButtonDashContainer">
                <div class="dropdown">
                    <button id="dropbtn"></button>
                </div>
            </div>
        `
    return view
  },
  after_render: async () => {
    // Check the current language
    const langBtn = document.getElementById('dropbtn')
    const lang = window.sessionStorage.getItem('lang')
    if (lang === 'nl') {
      langBtn.innerHTML = 'FR'
    } else {
      langBtn.innerHTML = 'NL'
    }

    if (window.location.hash === '#/list') {
      document.querySelector('.ButtonDashContainer').classList.add('ButtonDashContainer--building')
    }

    // Changes the current language
    langBtn.addEventListener('click', () => {
      if (lang === 'fr') {
        window.sessionStorage.setItem('lang', 'nl')
      } else {
        window.sessionStorage.setItem('lang', 'fr')
      }
      location.reload()
    })
  }

}

export default Navbar
