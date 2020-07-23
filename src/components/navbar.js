const Navbar = {
  render: async () => {
    const view = /* html */`
            <div class="ButtonDashContainer"> 

                <div class="dropdown">
                    <button id="dropbtn">NL</button>
                    <div class="dropdown-content">
                    <a class="lang_select" href="#">NL</a>
                    <a class="lang_select" href="#">FR</a>
                    <a class="lang_select" href="#">EN</a>
                    </div>
                </div>           
            </div>
            
        `
    return view
  },
  after_render: async () => {
  }

}

export default Navbar
