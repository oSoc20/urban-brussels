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
                    <li>
                        <a class="nav-item" href="/#/detail">
                            Detail-building
                        </a>
                    </li>
                </ul>
                </div>
            </nav>
        `
    return view
  },
  after_render: async () => {

  }

}

export default Navbar
