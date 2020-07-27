/**
 * Modules imports
 */
import SearchBar from '../SearchBar/searchbar.js'
import mapboxgl from 'mapbox-gl'
import arrowRight from '../../assets/icons/arrow-icon.svg'
import Api from '../api.js'

/**
 * Variable declarations
 */
const style = process.env.MAPBOX_STYLE
const token = process.env.MAPBOX_ACCESS_TOKEN
const language = 'fr'
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
        <button class="btn btn--random" id="searchrandom_btn">
        <div>
          <svg width="46" height="38" viewBox="0 0 46 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.5781 1.99992L1 12.1887L11.149 29.8357L28.7271 19.6469L18.5781 1.99992Z" class="svg__stroke"/>
            <path d="M24.6465 12.4795L26.5845 9.04907L44.1795 19.2379L34.0305 36.9019L21.7905 29.7851" class="svg__stroke"/>
            <path d="M17.0986 11.2508C18.169 11.2508 19.0366 10.3797 19.0366 9.30522C19.0366 8.23069 18.169 7.35962 17.0986 7.35962C16.0283 7.35962 15.1606 8.23069 15.1606 9.30522C15.1606 10.3797 16.0283 11.2508 17.0986 11.2508Z"  class="svg__fill"/>
            <path d="M15.0078 17.8556C16.0782 17.8556 16.9458 16.9845 16.9458 15.91C16.9458 14.8354 16.0782 13.9644 15.0078 13.9644C13.9375 13.9644 13.0698 14.8354 13.0698 15.91C13.0698 16.9845 13.9375 17.8556 15.0078 17.8556Z" class="svg__fill"/>
            <path d="M12.9678 24.5116C14.0381 24.5116 14.9058 23.6405 14.9058 22.566C14.9058 21.4914 14.0381 20.6204 12.9678 20.6204C11.8975 20.6204 11.0298 21.4914 11.0298 22.566C11.0298 23.6405 11.8975 24.5116 12.9678 24.5116Z"  class="svg__fill" />
            <path d="M8.42872 15.7052C9.49905 15.7052 10.3667 14.8341 10.3667 13.7596C10.3667 12.685 9.49905 11.814 8.42872 11.814C7.3584 11.814 6.49072 12.685 6.49072 13.7596C6.49072 14.8341 7.3584 15.7052 8.42872 15.7052Z"  class="svg__fill" />
            <path d="M14.9566 17.8043C16.0269 17.8043 16.8946 16.9332 16.8946 15.8587C16.8946 14.7842 16.0269 13.9131 14.9566 13.9131C13.8862 13.9131 13.0186 14.7842 13.0186 15.8587C13.0186 16.9332 13.8862 17.8043 14.9566 17.8043Z"  class="svg__fill" />
            <path d="M21.5869 19.8011C22.6573 19.8011 23.5249 18.93 23.5249 17.8555C23.5249 16.781 22.6573 15.9099 21.5869 15.9099C20.5166 15.9099 19.6489 16.781 19.6489 17.8555C19.6489 18.93 20.5166 19.8011 21.5869 19.8011Z"  class="svg__fill" />
            <path d="M28.9307 17.753C30.001 17.753 30.8687 16.8819 30.8687 15.8074C30.8687 14.7329 30.001 13.8618 28.9307 13.8618C27.8603 13.8618 26.9927 14.7329 26.9927 15.8074C26.9927 16.8819 27.8603 17.753 28.9307 17.753Z"  class="svg__fill" />
            <path d="M30.3076 24.5116C31.378 24.5116 32.2456 23.6405 32.2456 22.566C32.2456 21.4914 31.378 20.6204 30.3076 20.6204C29.2373 20.6204 28.3696 21.4914 28.3696 22.566C28.3696 23.6405 29.2373 24.5116 30.3076 24.5116Z"  class="svg__fill" />
            <path d="M31.7866 31.3211C32.857 31.3211 33.7246 30.4501 33.7246 29.3755C33.7246 28.301 32.857 27.4299 31.7866 27.4299C30.7163 27.4299 29.8486 28.301 29.8486 29.3755C29.8486 30.4501 30.7163 31.3211 31.7866 31.3211Z"  class="svg__fill" />
          </svg>
        </div>
        </button>
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
    const prev = document.getElementsByClassName('arrowLeft')[0]
    const next = document.getElementsByClassName('arrowRight')[0]
    const ff = document.getElementsByClassName('fun-fact__txt')[0]

    const resp = await Api.getFunFacts(language, 50)
    let funFacts = resp.facts

    ff.innerHTML = funFacts[0]
    const tags = document.getElementsByClassName('tag')
    for (let index = 0; index < tags.length; index++) {
      tags[index].addEventListener('click', () => {
        // Redirect to building list page
      })
    }

    if (funFactsCounter === 0) {
      prev.style.display = 'none'
    }

    prev.addEventListener('click', () => {
      funFactsCounter--
      ff.innerHTML = funFacts[funFactsCounter]
      if (funFactsCounter <= 0) {
        prev.style.display = 'none'
      }
    })

    next.addEventListener('click', async () => {
      funFactsCounter++
      ff.innerHTML = funFacts[funFactsCounter]
      const tags = document.getElementsByClassName('tag')
      for (let index = 0; index < tags.length; index++) {
        tags[index].addEventListener('click', () => {
          // Redirect to building list page
        })
      }
      if (funFactsCounter > 0) {
        prev.style.display = 'inline'
      }
      if (funFactsCounter > funFacts.length / 2) {
        const tmp = await Api.getFunFacts(language, 50)
        funFacts = funFacts.concat(tmp.facts)
      }
      if (funFactsCounter === funFacts.length - 1) {
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
