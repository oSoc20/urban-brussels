import Api from './api.js'

const List = {
  render: async () => {

    //Checks if data has already been stored in local storage and retrieve it
    let data = JSON.parse(window.localStorage.getItem('building_data'));

    //Send a request to the API is the data in local storage is empty
    if (data === null){
      data = await Api.getData()
      window.localStorage.setItem('building_data', JSON.stringify(data))
    }

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

    const view = /* html */`
            <div class="pagination">
              <a href="#">&laquo;</a>
              <a href="#" class="active">1</a>
              <a href="#">2</a>
              <a href="#">3</a>
              <a href="#">4</a>
              <a href="#">5</a>
              <a href="#">6</a>
              <a href="#">&raquo;</a>
            </div>
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
