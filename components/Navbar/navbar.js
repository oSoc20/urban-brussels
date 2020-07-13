let Navbar = {
    render: async () => {
        let view =  /*html*/`
            <nav class="navbar" >
                <a href="#">Urban Brussels</a>
                <div>
                <ul class="nav">
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
                </ul>
                </div>
            </nav>
        `
        return view
    },
    after_render: async () => { }

}

export default Navbar;