import Api from './api.js'

let List = {
    render : async () => {
        let data = await Api.getData()
        console.log(data)
        let count = data.buildingsCount;
        
        console.log(data.municipalityStatistics)
        let view =  /*html*/`
            <p>Hello, there are ${count} buildings in this dataset !<p>
        `
        return view
    }
    , after_render: async () => {
    }

}

export default List;