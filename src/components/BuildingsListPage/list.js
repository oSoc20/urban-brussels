import Api from '../api.js'
import Pagination from './pagination.js'

let pagination;
let nb_pages;
let active_page;

const List = {
  render: async () => {

    //Checks if data has already been stored in local storage and retrieve it
    let data = JSON.parse(window.localStorage.getItem('building_data'));

    //Send a request to the API is the data in local storage is empty
    if (data === null){
      data = await Api.getData()
      window.localStorage.setItem('building_data', JSON.stringify(data))
    }

    console.log(data.numberReturned)

    //Pagination
    nb_pages = Math.floor(data.numberReturned/10);
    pagination = Pagination.createPagination(nb_pages, 1);


    // List the 10 first building
    // TEMPORARY, TO BE MODIFIED
    let i = 0
    let list = ''
    while (i < 10) {
      list += /* html */`
                <li class="li_list">
                    <img class="building_img" src="${data.features[i].properties.FIRSTIMAGE}" >
                    <button class="building_style">${data.features[i].properties.STYLE_FR}</button>
                    <button class="building_type">${data.features[i].properties.TYPO_FR}</button>
                    <h3 class="building_streetname">${data.features[i].properties.STREET_FR} ${data.features[i].properties.NUMBER}, ${data.features[i].properties.CITIES_FR} ${data.features[i].properties.CITY}</h3>
                    <p class="building_municipality"></p>
                    <p class="building_desc">${data.features[i].properties.URL_FR}</p>
                </li>
            `
      i++
    }

    const view = /* html */`
            <div id="list_ctn">
                <ul id="ul_list">
                  <h2 id="properties_title">Urban Properties</h2>
                    ${list}
                  <div id="pagination"></div>
                </ul>
            </div>
        `
    return view
  },
  after_render: async () => {
    document.getElementById('pagination').innerHTML = pagination;
    let page_buttons= document.getElementsByClassName('nb_page')
    for (let i = 0; i < page_buttons.length; i++) {
      page_buttons[i].addEventListener("click", () =>{
        console.log(page_buttons[i].innerHTML)
      })
    }
  }

}

export default List


