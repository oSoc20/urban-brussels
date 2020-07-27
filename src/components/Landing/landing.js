/**
 * Modules imports
 */
import SearchBar from '../SearchBar/searchbar.js'
import mapboxgl from 'mapbox-gl'
import arrowRight from '../../assets/icons/arrow-icon.svg'
import randomIcon from '../../assets/icons/random-icon.svg'
import Api from '../api.js'

/**
 * Variable declarations
 */
const style = process.env.MAPBOX_STYLE
const token = process.env.MAPBOX_ACCESS_TOKEN
let language = 'fr';
let funFactsCounter = 0

// Rendering of the landing/home page
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
            <p class="fun-fact__txt"></p>
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
  // Behavior after rendering
  after_render: async () => {
    // Search bar code
    SearchBar.displaySearchBar('search_container')
    SearchBar.searchFunction()

    document.querySelector('#searchrandom_btn').addEventListener('click', Landing.clickHandlerRandomBtn)
    // Fun facts
    let prev = document.getElementsByClassName('arrowLeft')[0]
    let next = document.getElementsByClassName('arrowRight')[0]
    let ff = document.getElementsByClassName('fun-fact__txt')[0]

    let resp = await Api.getFunFacts(language, 50)
    let funFacts = resp.facts;
    
    ff.innerHTML = funFacts[0]
    let tags = document.getElementsByClassName('tag')
      for (let index = 0; index < tags.length; index++) {
        tags[index].addEventListener('click', () => {
          //Redirect to building list page
        })
      }


    if (funFactsCounter === 0){
      prev.style.display = 'none';
    }

    prev.addEventListener("click", () => {
      funFactsCounter--;
      ff.innerHTML = funFacts[funFactsCounter]
      if (funFactsCounter <= 0){
        prev.style.display = 'none';
      }
    })

    next.addEventListener("click", async () => {
      funFactsCounter++;
      ff.innerHTML = funFacts[funFactsCounter]
      let tags = document.getElementsByClassName('tag')
      for (let index = 0; index < tags.length; index++) {
        tags[index].addEventListener('click', () => {
          //Redirect to building list page
        })
      }
      if (funFactsCounter > 0){
        prev.style.display = 'inline';
      }
      if (funFactsCounter > funFacts.length/2){
        let tmp = await Api.getFunFacts(language, 50)
        funFacts = funFacts.concat(tmp.facts)
      }
      if (funFactsCounter === funFacts.length-1){
        next.style.display = 'none'
      }
    })

    // Map
    mapboxgl.accessToken = token

    var map = new mapboxgl.Map({
      container: document.getElementById('map-landing-page'),
      style,
      center: [4.38128798, 50.84723317],
      zoom: 15
    })

    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right')

    const bounds = new mapboxgl.LngLatBounds()

    // Retrieves random building
    const dataRandom = await Api.searchRandom('fr', '3')
    dataRandom.features.forEach((feature) => {
      bounds.extend(feature.geometry.coordinates)
    })

    // Map load
    map.on('load', function () {
      map.addSource('randomBuildings', {
        type: 'geojson',
        data: dataRandom
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

    // Map data
    map.on('sourcedata', (event) => {
      if (event.isSourceLoaded === true) {
        map.querySourceFeatures('randomBuildings').forEach((feature) => {
          const str = `
          <div class="pop-up--landing">
          <div>
            <div class="pop-up__img--landing" style="background-image: url('${feature.properties.image}');">
          </div>
            <div class="pop-up__address--landing">
              <p class="pop-up__info--landing">${feature.properties.street} ${feature.properties.number}</p>
              <p class="pop-up__info--landing"> ${feature.properties.zip_code} ${feature.properties.city}</p>
            </div>
          </div>
          `

          new mapboxgl.Popup({ closeOnClick: false, closeButton: false })
            .setLngLat(feature.geometry.coordinates)
            .setHTML(str)
            .addTo(map)
        })

        map.fitBounds(bounds, {
          padding: { top: 25, bottom: 25, left: 25, right: 25 }
        })
      }
    })
  },
  clickHandlerRandomBtn: async () => {
    const dataRandom = await Api.searchRandom('fr', '1')
    window.localStorage.removeItem('random_building_data')
    window.localStorage.setItem('random_building_data', JSON.stringify(dataRandom.features))
    window.location.href = '/#/list'
  }
}

export default Landing
