import Languages from '../../languages/languages.json'

const Navbar = {
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
    // Language switch
    let langBtn = document.getElementById('dropbtn')
    let lang = window.sessionStorage.getItem('lang')
    if (lang === 'nl'){
      langBtn.innerHTML = 'FR'
    } else {
      langBtn.innerHTML = 'NL'
    }

    langBtn.addEventListener('click', () => {
      if (lang === 'fr'){
        window.sessionStorage.setItem('lang', 'nl')
      } else {
        window.sessionStorage.setItem('lang', 'fr')
      }
      //console.log(window.sessionStorage.getItem('lang'))
      location.reload()
    })
  }

}

export default Navbar
