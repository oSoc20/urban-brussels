import SearchBar from './SearchBar/searchbar.js'
import mapboxgl from 'mapbox-gl'
import arrowRight from '../assets/icons/arrow-icon.svg'
import randomIcon from '../assets/icons/random-icon.svg'


let style = process.env.MAPBOX_STYLE
let token = process.env.MAPBOX_ACCESS_TOKEN


const Landing = {
  render: async () => {
    const view = /* html */`
    <div id="map-landing-page" class="map-landing-page"></div>

    <button id="clickDashboard" onClick="window.location.href='/#/Dashboard';"> 
    <span id="dash_text">Dashboard</span>
    </button>
      
    <div class="landing__container">
      <div>
      <div class="search__container">
        <div id="search_container"></div>
        <button class="btn btn--random" id="searchrandom_btn"><img id="dices_btn" src="${randomIcon}"/></button>
      </div>

        <div class="fun-fact__container">
            <p class="fun-fact__txt"> Did you know that <span class="tag tag--architect tag--small tag--no-margin">Victor Horta</span> built more than 100 buildings of <span class="tag tag--type tag--small tag--no-margin">Residential</span> and <span class="tag tag--style tag--small tag--no-margin">Art Nouveau</span>.</p>
            <div class="fun-fact__arrows">
              <a class="arrowLeft"><img src="${arrowRight}" /></a>
              <a class="arrowRight"><img src="${arrowRight}" /></a>
            </div>
        </div>
      </div>
    </div>
       `
    return view
  },
  after_render: async () => {
    // Search bar code
    SearchBar.displaySearchBar('search_container')
    SearchBar.searchFunction()

    // Language switch
    const lang = document.getElementsByClassName('lang_select')
    for (let index = 0; index < lang.length; index++) {
      lang[index].addEventListener('click', () => {
        document.getElementById('dropbtn').innerHTML = lang[index].innerHTML
      })
    }

    mapboxgl.accessToken = token

    var map = new mapboxgl.Map({
      container: document.getElementById('map-landing-page'),
      style,
      center: [4.38128798, 50.84723317],
      zoom: 15
    })

    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right')

    map.on('load', function () {
      map.addSource('randomBuildings', {
        type: 'geojson',
        data: 'https://gis.urban.brussels/geoserver/ows?service=wfs&version=2.0.0&request=GetFeature&TypeName=BSO_DML_BESC:Inventaris_Irismonument&outputformat=application/json&cql_filter=ID_BATI_CMS=18426&srsname=EPSG:4326'
      })

      map.addLayer({
        id: 'randomBuildings',
        type: 'circle',
        source: 'randomBuildings',
        paint: {
          'circle-radius': {
            base: 10,
            stops: [
              [12, 10],
              [22, 180]
            ]
          },
          'circle-color': '#2C3550',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#fff'
        }
      })
    })

    map.on('sourcedata', (event) => {
      if (event.isSourceLoaded === true) {
        map.querySourceFeatures('randomBuildings').forEach((feature) => {
          const str = `
          <div class="pop-up--landing">
          <div>
            <div class="pop-up__img--landing" style="background-image: url('${feature.properties.FIRSTIMAGE}');">
          </div>
            <div class="pop-up__address--landing">
              <p class="pop-up__info--landing">${feature.properties.STREET_NL} ${feature.properties.NUMBER}</p>
              <p class="pop-up__info--landing"> ${feature.properties.CITY} ${feature.properties.CITIES_NL}</p>
            </div>
          </div>
          `

          new mapboxgl.Popup({ closeOnClick: false, closeButton: false })
            .setLngLat(feature.geometry.coordinates)
            .setHTML(str)
            .addTo(map)
        })
      }
    })
  }
}

export default Landing
