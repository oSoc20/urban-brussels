import mapboxgl from 'mapbox-gl'
import Api from '../api.js'
import Pagination from '../BuildingsListPage/pagination'

let map
let data
let moveMap = true
let popup
const itemsPerPage = 4
let paginationBuildings
let features = []

const buildingList = {
  render: async () => {
    // Checks if data has already been stored in local storage and retrieve it
    data = window.localStorage.getItem('building_data')

    // Send a request to the API is the data in local storage is empty
    // if (Object.entries(data).length === 0 && data.constructor === Object) {
    if (data === 'undefined') {
      data = await Api.getData()
      window.localStorage.setItem('building_data', JSON.stringify(data))
    } else {
      data = JSON.parse(data)
    }
    features = data.features
    let view = /* html */`

    <div id="buildingListMap" class="map-building-list"></div>
    <div class="switch">
      <p>Search as I move the map </p>
      <input type="checkbox" id="switch" checked /><label for="switch">Toggle</label>
    </div>

    <section class="section__list">
      <div class="section__list__title">
        <h1>Buildings</h1>
        <div class="pagination"></div>
      </div>
        <ul class="building-list">
        `

    view += '</ul></section>'
    return view
  },
  after_render: async () => {
    paginationBuildings = new Pagination(document.getElementsByClassName('pagination')[0], {
      currentPage: 1,
      totalItems: data.features.length,
      itemsPerPage: itemsPerPage,
      stepNum: 1,
      onInit: buildingList.displayContent
    })

    paginationBuildings.onPageChanged(buildingList.displayContent)

    const coordinates = {
      long: 4.34031002,
      lat: 50.88432209
    }
    let centerMap

    window.innerWidth > 880 ? centerMap = coordinates.long - 0.0200 : centerMap = coordinates.long

    mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN
    map = new mapboxgl.Map({
      container: 'buildingListMap',
      style: process.env.MAPBOX_STYLE,
      center: [centerMap, coordinates.lat],
      zoom: 12.71
    })

    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right')

    map.on('load', function () {
      map.addSource('buildings', {
        type: 'geojson',
        data: data,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50
      })

      map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'buildings',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#8F9BCC',
            100,
            '#476291',
            750,
            '#212E44'
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            100,
            30,
            750,
            40
          ]
        }
      })

      map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'buildings',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12
        },
        paint: {
          'text-color': '#ffffff'
        }
      })

      map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'buildings',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#212E44',
          'circle-radius': 11,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#fff'
        }
      })

      map.addSource('unclustered-locations', {
        type: 'geojson',
        data: data,
        cluster: false,
        clusterMaxZoom: 14,
        clusterRadius: 50
      })

      map.addLayer({
        id: 'hidden-locations',
        type: 'circle',
        source: 'unclustered-locations',
        paint: {
          'circle-radius': 0
        }
      })

      map.on('click', 'clusters', function (e) {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ['clusters']
        })
        const clusterId = features[0].properties.cluster_id
        map.getSource('buildings').getClusterExpansionZoom(
          clusterId,
          function (err, zoom) {
            if (err) return

            map.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom
            })
          }
        )
      })

      map.on('click', 'unclustered-point', function (e) {
        console.log("click")
      })

      // Create a popup, but don't add it to the map yet.
      popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        maxWidth: 'max-content'
      })

      map.on('mouseenter', 'clusters', function () {
        map.getCanvas().style.cursor = 'pointer'
      })
      map.on('mouseleave', 'clusters', function () {
        map.getCanvas().style.cursor = ''
      })
      map.on('mouseenter', 'unclustered-point', function (e) {
        map.getCanvas().style.cursor = 'pointer'

        const coordinates = e.features[0].geometry.coordinates.slice()

        const city = e.features[0].properties.CITIES_NL
        const postalCode = e.features[0].properties.CITY
        const street = e.features[0].properties.STREET_NL
        const number = e.features[0].properties.NUMBER
        const img = e.features[0].properties.FIRSTIMAGE

        const str = `
        <div class="pop-up">
          <img class="pop-up__img" src="${img}" alt="">
          <div class="pop-up__address">
            <p class="pop-up__info">${street} ${number}</p>
            <p class="pop-up__info">${postalCode} ${city}</p>
          </div>
        </div>
        `

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
        }

        popup
          .setLngLat(coordinates)
          .setHTML(str)
          .addTo(map)
      })
      map.on('mouseleave', 'unclustered-point', function () {
        map.getCanvas().style.cursor = ''
        popup.remove()
      })
    })

    const switchInput = document.querySelector('#switch')

    switchInput.addEventListener('change', (e) => {
      moveMap = !moveMap
      buildingList.getBuildingsFromMap(map)
      buildingList.renderFullList(map)
    })

    map.on('moveend', () => {
      buildingList.getBuildingsFromMap(map)
    })
  },

  hoverHandlerBuilding: (event, currentPage = 1) => {
    if (!moveMap) {
      popup.remove()
      const address = event.currentTarget.dataset.address
      for (let i = (currentPage - 1) * itemsPerPage; i < (currentPage * itemsPerPage) && i < data.features.length; i++) {
        const addressData = `${data.features[i].properties.STREET_NL} ${data.features[i].properties.NUMBER} ${data.features[i].properties.CITY} ${data.features[i].properties.CITIES_NL}`
        if (address === addressData) {
          const coordinates = data.features[i].geometry.coordinates.slice()

          const city = data.features[i].properties.CITIES_NL
          const postalCode = data.features[i].properties.CITY
          const street = data.features[i].properties.STREET_NL
          const number = data.features[i].properties.NUMBER
          const img = data.features[i].properties.FIRSTIMAGE

          const str = `
          <div class="pop-up">
            <img class="pop-up__img" src="${img}" alt="">
            <div class="pop-up__address">
              <p class="pop-up__info">${street} ${number}</p>
              <p class="pop-up__info">${postalCode} ${city}</p>
            </div>
          </div>
  
          `
          popup
            .setLngLat(coordinates)
            .setHTML(str)
            .addTo(map)

          map.easeTo({
            center: data.features[i].geometry.coordinates,
            zoom: 16
          })
        }
      }
    }
  },
  getBuildingsFromMap: (map) => {
    if (moveMap) {
      features = map.queryRenderedFeatures({ layers: ['hidden-locations'] })
      features.reverse()

      if (features.length === 0) {
        const listingEl = document.querySelector('.building-list')
        listingEl.innerHTML = ''
        const empty = document.createElement('p')
        empty.textContent = 'No buildings found, drag the map to see more results'
        listingEl.appendChild(empty)
      }

      paginationBuildings = new Pagination(document.getElementsByClassName('pagination')[0], {
        currentPage: 1,
        totalItems: features.length,
        itemsPerPage: itemsPerPage,
        stepNum: 1,
        onInit: buildingList.displayContent
      })

      paginationBuildings.onPageChanged(buildingList.displayContent)
    }
  },

  renderFullList: (map) => {
    if (!moveMap) {
      paginationBuildings = new Pagination(document.getElementsByClassName('pagination')[0], {
        currentPage: 1,
        totalItems: data.features.length,
        itemsPerPage: itemsPerPage,
        stepNum: 1,
        onInit: buildingList.displayContent
      })

      paginationBuildings.onPageChanged(buildingList.displayContent)
    }
  },
  displayContent: (currentPage) => {
    document.querySelector('.building-list').innerHTML = buildingList.contentTemplate(currentPage)
    const buildingListItems = document.querySelectorAll('.building-list__item')
    buildingListItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        buildingList.hoverHandlerBuilding(event, currentPage)
      })
    })

    buildingListItems.forEach(item => {
      item.addEventListener('mouseleave', event => {
        if (popup) {
          popup.remove()
        }
      })
    })
  },

  contentTemplate: (currentPage) => {
    let html = ''
    if (!moveMap) {
      for (let i = (currentPage - 1) * itemsPerPage; i < (currentPage * itemsPerPage) && i < data.features.length; i++) {
        html += `
        <li class="building-list__item" data-address="${data.features[i].properties.STREET_NL} ${data.features[i].properties.NUMBER} ${data.features[i].properties.CITY} ${data.features[i].properties.CITIES_NL}">
            <div class="building-list__item__container">
              <div class="building__img" style="background-image: url('${data.features[i].properties.FIRSTIMAGE}');">
              </div>
                <div class="building__info">
                    <div class="building__tags">`

        if (data.features[i].properties.STYLE_NL != null) {
          html += `<div class="tag tag--style tag--small">${data.features[i].properties.STYLE_NL}</div>`
        }

        if (data.features[i].properties.TYPO != null) {
          html += `<div class="tag tag--type tag--small">${data.features[i].properties.TYPO}</div>`
        }

        if (data.features[i].properties.INTERVENANTS != null) {
          html += `<div class="tag tag--architect tag--small">${data.features[i].properties.INTERVENANTS}</div>`
        }

        html += '</div>'

        if (data.features[i].properties.NOM_NL != null) {
          html += ` <p class="building__name" >${data.features[i].properties.NOM_NL}</p>`
        }
        html += `
                    <p class="building__street">${data.features[i].properties.STREET_NL} ${data.features[i].properties.NUMBER} </p>
                    <p class="building__municipality"> ${data.features[i].properties.CITY} ${data.features[i].properties.CITIES_NL}</p>
                </div>
            </div>
        </li>
        `
      }
    } else {
      for (let i = (currentPage - 1) * itemsPerPage; i < (currentPage * itemsPerPage) && i < features.length; i++) {
        html += `
          <li class="building-list__item" data-address="${features[i].properties.STREET_NL} ${features[i].properties.NUMBER} ${features[i].properties.CITY} ${features[i].properties.CITIES_NL}">
              <div class="building-list__item__container">
                <div class="building__img" style="background-image: url('${features[i].properties.FIRSTIMAGE}');">
                </div>
                  <div class="building__info">
                      <div class="building__tags">`


        if (features[i].properties.STYLE_NL !== 'null' && features[i].properties.STYLE_NL !== null) {
          html += `<div class="tag tag--style tag--small">${features[i].properties.STYLE_NL}</div>`
        }

        if (features[i].properties.TYPO !== 'null' && features[i].properties.TYPO != null) {
          html += `<div class="tag tag--type tag--small">${features[i].properties.TYPO}</div>`
        }

        if (features[i].properties.INTERVENANTS !== 'null' && features[i].properties.INTERVENANTS != null) {
          html += `<div class="tag tag--architect tag--small">${features[i].properties.INTERVENANTS}</div>`
        }

        html += '</div>'

        if (features[i].properties.NOM_NL !== 'null' && features[i].properties.NOM_NL != null) {
          html += ` <p class="building__name" >${features[i].properties.NOM_NL}</p>`
        }

        html += `
           <p class="building__street">${features[i].properties.STREET_NL} ${features[i].properties.NUMBER} </p>
            <p class="building__municipality"> ${features[i].properties.CITY} ${features[i].properties.CITIES_NL}</p>
                  </div>
              </div>
          </li>
          `
      }
    }
    // console.log(html)
    return html
  }
}

export default buildingList
