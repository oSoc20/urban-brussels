const Navbar = {
  render: async () => {
    const view = /* html */`
            <nav class="navbar" >
                <a href="#">
                    <img id="home_logo" src="assets/img/finalcrest.png"/>
                </a>
                <div>
                <ul id="nav">
                    <li>
                        <a class="nav-item" href="/#/">
                            Home
                        </a>
                    </li>
                    <li>
                        <a class="nav-item" href="/#/map">
                            Map
                        </a>
                    </li>
                    <li>
                        <a class="nav-item" href="/#/facts">
                            Facts
                        </a>
                    </li>
                </ul>
                </div>
            </nav>
            <div class="ButtonDashContainer"> 
                <button id="clickDashboard" onClick="window.location.href='/#/Dashboard';"> 
                <h3> Dashboard </h3> </button>
                <div class="dropdown">
                <button class="dropbtn">Lng</button>
                <div class="dropdown-content">
                    <a href="#">French</a>
                    <a href="#">Dutch</a>
                    <a href="#">English</a>
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
