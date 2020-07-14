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
                    <h3 class="building_name">${data.features[i].properties.STREET_FR}, ${data.features[i].properties.NUMBER}</h3>
                    <p class="building_desc">${data.features[i].properties.URL_FR}</p>
                </li>
            `
      i++
    }

    const view = /* html */`
            <div id="pagination"></div>
            <div id="list_ctn">
                <ul id="ul_list">
                    ${list}
                </ul>
            </div>
        `
    return view
  },
  after_render: async () => {
    document.getElementById('pagination').innerHTML = pagination;
    document.getElementsByClassName('nb_page').addEventListener("click", () =>{
      if (nb_pages > 1){
        Pagination.createPagination(nb_pages, nb_pages-1)
      }
      if (nb_pages > 6){
        active_page = nb_pages
      }
    })
  }

}

export default List


