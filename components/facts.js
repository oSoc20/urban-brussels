let Facts = {
    render : async () => {
        let view =  /*html*/`
        <div id="page-content">
            <div class="fun-fact-container">
                <h2 class="did-you-know">Did you know?</h2>
                <p class="fact-description">Just some random information about the building, architects, styles, municipality</p>
                <a href="#" id="arrow"><span class="pic arrow-right"></span></a>
                    <div id="fact-image">
                        <img src="/building-test.jpg" style="width: 50%">
                    </div>
            </div>
        </div>
        `
        return view
    }
    , after_render: async () => {
    }
 
 }
 
 export default Facts;