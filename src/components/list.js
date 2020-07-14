import Api from './api.js'

const List = {
  render: async () => {
    const data = await Api.getData()

    // List the 10 first building
    // TEMPORARY, TO BE MODIFIED
    let i = 0
    let list = ''
    while (i < 10) {
      list += /* html */`
                <li class="li_list">
                    <img class="building_img" src="${data.features[i].properties.FIRSTIMAGE}" >
                    <h3 class="building_name">${data.features[i].properties.STREET_FR}, ${data.features[i].properties.NUMBER}</h3>
                    <p class="building_desc">${data.features[i].properties.URL_FR}</p>
                </li>
            `
      i++
    }

    // console.log(data.features)
    // let count = data.buildingsCount;

    // console.log(data.municipalityStatistics)
    const view = /* html */`
            <div id="list_ctn">
                <ul id="ul_list">
                    ${list}
                </ul>
            </div>
        `
    return view
  },
  after_render: async () => {
  }

}

export default List
