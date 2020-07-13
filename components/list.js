import Api from './api.js'

let List = {
    render : async () => {
        let data = await Api.getData()
        let view =  /*html*/`
            <p>hey<p>
        `
        return view
    }
    , after_render: async () => {
    }

}

export default List;