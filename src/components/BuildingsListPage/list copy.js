import Api from '../api.js'
import Pagination from './pagination.js'

//Variables declaration
let pagination;
let nb_pages;
let active_page;
let data;
let current_data={
  'type': 'FeatureCollection',
  'features': []
};

const List = {
  render: async () => {

    //Checks if data has already been stored in local storage and retrieve it
    data = JSON.parse(window.localStorage.getItem('building_data'));

    //Send a request to the API is the data in local storage is empty
    if (data === null) {
      data = await Api.getData()
      window.localStorage.setItem('building_data', JSON.stringify(data))
    }

    console.log(data.numberReturned)

    //Pagination
    nb_pages = Math.floor(data.numberReturned / 10);
    pagination = Pagination.createPagination(nb_pages, 1);


    // List the 10 first building
    // TODO ADD PAGINATION
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
      let tmp = {
        'type': 'Feature',
        'properties': {
          'message': 'Foo',
          'iconSize': [50, 50],
          'img': data.features[i].properties.FIRSTIMAGE
        },
        'geometry': {
          'type': 'Point',
          'coordinates': data.features[i].geometry.coordinates
        }
      }
      current_data.features.push(tmp);
      i++
    }

    const view = /* html */`
            <div class="split" id="list_ctn">
                <ul id="ul_list">
                  <h2 id="properties_title">Urban Properties</h2>
                    ${list}
                  <div id="pagination"></div>
                </ul>
            </div>
            <div class="split" id="toggle_ctn">
              <label class="switch">
                <input type="checkbox" id="toggle_switch">
                <span class="slider round"></span>
              </label>
            </div>
            <div class="split" id="map_ctn"></div>
            </div>
        `
    return view
  },
  after_render: async () => {
    //Buildings list code
    document.getElementById('pagination').innerHTML = pagination;
    let page_buttons = document.getElementsByClassName('nb_page')
    for (let i = 0; i < page_buttons.length; i++) {
      page_buttons[i].addEventListener("click", () => {
        console.log(page_buttons[i].innerHTML)
      })
    }

    //Mapbox GL code
    mapboxgl.accessToken = 'pk.eyJ1IjoiYW5hZHYxOCIsImEiOiJja2NibWI1dmIyNjh4MzBvMDJzazJlNzI0In0.n6nqsasihr0Cmsik6AU3zQ';
    let map = new mapboxgl.Map({
      container: 'map_ctn',
      style: 'mapbox://styles/mapbox/light-v10',
      center: [4.3270, 50.8787],
      zoom: 15
    });

    //Add controls for map navigation
    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

    console.log(current_data)
  
    current_data.features.forEach(function (marker) {
      // create a DOM element for the marker
      var el = document.createElement('div');
      el.className = 'marker';
      //console.log(marker.properties.img)
      el.style.backgroundImage = 'url('+marker.properties.img+')'
      el.style.width = marker.properties.iconSize[0] + 'px';
      el.style.height = marker.properties.iconSize[1] + 'px';
  
      el.addEventListener('click', function () {
        window.alert(marker.properties.message);
      });
  
      // add marker to map
      new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates)
        .addTo(map);
    });

    document.getElementById('toggle_switch').addEventListener("click", () =>{
      let btn = document.getElementById('map_ctn');
      if (btn.style.display === "none") {
        btn.style.display = "block";
      } else {
        btn.style.display = "none";
      }
    })

  }

}

export default List


