const Navbar = {
  render: async () => {
    const view = /* html */`
            <div class="ButtonDashContainer"> 
                <button id="clickDashboard" onClick="window.location.href='/#/Dashboard';"> 
                    <span id="dash_text">Dashboard</span>
                </button>             
            </div>

            
        `
    return view
  },
  after_render: async () => {
  }

}

export default Navbar
