import Api from '../api.js'
import Pagination from '../Pagination/pagination'
import SearchBar from '../SearchBar/searchbar'

import clusteredMap from '../MapWithClusters/mapWithClusters'
import popupBuilding from './popupBuilding'
import pulsingDot from '../BuildingDetail/pulsingDot'
import buildingDetail from '../BuildingDetail/buildingDetail'

import backButton from '../../assets/icons/back-button.svg'
import BaseLayerSwitch from '../Map/baselayerswitch.js'

let searchData, map, popup
let data = []
let features = []
const itemsPerPage = 5
let moveMap = true
let randomBuildingClicked = false
let randomBuilding = []

const buildingList = {
  render: async () => {
    randomBuilding = JSON.parse(window.localStorage.getItem('random_building_data'))
    searchData = window.localStorage.getItem('search_data')

    if (typeof randomBuilding === 'undefined' || randomBuilding === null) {
      randomBuildingClicked = false
      data = window.localStorage.getItem('building_data')
      if (typeof data === 'undefined' || data === null) {
        data = await Api.searchData(searchData)
        window.localStorage.setItem('building_data', JSON.stringify(data))
      } else {
        data = JSON.parse(data)
      }
      features = data.features
    } else {
      randomBuildingClicked = true
    }

    let view = /* html */`
    <div id="buildingListMap" class="map-building-list ${randomBuildingClicked ? 'map-building-list__detail' : ''}"></div>
    <div id="baselayer_container"></div>
    <img class="btn--back" src="${backButton}" alt="go back button">
          <section class= "detail-popup">
      <div class="detail-popup__container">
        <div class="detail-popup__overflow"></div>
      </div>
      </section>`

    if (!randomBuildingClicked) {
      view += `
      <div class="switch">
        <p>Search as I move the map </p>
        <input type="checkbox" id="switch" checked /><label for="switch">Toggle</label>
      </div>
      <section class="section__list">
      <div id="search_container"></div>
      <div class="section__list__title">
        <h1>Buildings</h1>
        <div class="pagination"></div>
      </div>
        <ul class="building-list"></ul>
      </section>`
    }
    return view
  },
  after_render: async () => {
    if (!randomBuildingClicked) {
      SearchBar.displaySearchBar('search_container')
      SearchBar.searchFunction(buildingList.SearchBarCalback)

      buildingList.initPagination()
      BaseLayerSwitch.displayBaseLayerSwitch('baselayer_container')
      map = clusteredMap.init(data)
      popup = popupBuilding.init(map)
      map.on('moveend', () => {
        buildingList.getBuildingsFromMap(map)
      })

      map.on('click', 'unclustered-point', function (e) {
        const selectedItem = e.features
        buildingDetail.showDetail(map, selectedItem, popup)
      })

      const switchInput = document.querySelector('#switch')

      switchInput.addEventListener('change', () => {
        moveMap = !moveMap
        buildingList.getBuildingsFromMap(map)
        if (!moveMap) {
          features = data.features
          buildingList.initPagination()
        }
      })
    } else {
      map = clusteredMap.init()
      map.on('load', () => {
        buildingDetail.showDetail(map, randomBuilding, null, randomBuildingClicked)
      })
    }
    pulsingDot.init(map)
  },
  SearchBarCalback: async (tags) => {
    const send = {
      lang: 'fr',
      zipcode: '',
      cities: tags.cityArr,
      typologies: tags.typeArr,
      styles: tags.styleArr,
      intervenants: tags.architectArr,
      streets: tags.streetArr
    }

    if (tags.zipcodeArr.length > 0) {
      send.zipcode = tags.zipcodeArr[0]
    }
    data = await Api.searchData(send)
    features = data.features
    buildingList.initPagination()
    buildingList.displayContent(1)

    const mapSource = map.getSource('buildings')
    const mapSourceHidden = map.getSource('unclustered-locations')
    if (mapSource !== undefined) {
      mapSource.setData(data)
      mapSourceHidden.setData(data)
      map.easeTo({
        center: [4.4006, 50.8452],
        zoom: 10.24
      })
    }

    window.localStorage.removeItem('building_data')
    window.localStorage.removeItem('search_data')
    window.localStorage.setItem('search_data', JSON.stringify(send))
    window.localStorage.setItem('building_data', JSON.stringify(data))
  },

  initPagination: () => {
    Pagination.init(document.getElementsByClassName('pagination')[0], {
      currentPage: 1,
      totalItems: features.length,
      itemsPerPage: itemsPerPage,
      stepNum: 1
    })

    Pagination.onPageChanged(buildingList.displayContent)
  },
  getBuildingsFromMap: (map) => {
    if (moveMap) {
      features = map.queryRenderedFeatures({ layers: ['hidden-locations'] })
      features.reverse()
      buildingList.initPagination()
    }
  },
  displayContent: (currentPage) => {
    document.querySelector('.building-list').innerHTML = buildingList.renderList(currentPage)
    const buildingListItems = document.querySelectorAll('.building-list__item')
    buildingListItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        if (!moveMap) { popupBuilding.hoverHandlerPopupBuilding(event, map, currentPage, itemsPerPage, features) }
      })
      item.addEventListener('click', () => {
        const address = item.dataset.address
        buildingList.showDetail(address)
      })
    })
    buildingListItems.forEach(item => item.addEventListener('mouseleave', () => popupBuilding.removePopup()))
  },

  renderList: (currentPage) => {
    let html = ''
    for (let i = (currentPage - 1) * itemsPerPage; i < (currentPage * itemsPerPage) && i < features.length; i++) {
      const building = features[i].properties
      html += `
          <li class="building-list__item" data-address="${building.street} ${building.number} ${building.zip_code} ${building.city}">
              <div class="building-list__item__container">
                <div class="building__img" style="background-image: url('${building.image}');"></div>
                <div class="building__info">
                  <div class="building__tags">`

      html += buildingList.showTags(building.styles, 'style')
      html += buildingList.showTags(building.typologies, 'type')
      html += buildingList.showTags(building.intervenants, 'architect')
      html += '</div>'

      if (building.name != null && building.name !== 'null') {
        html += ` <p class="building__name" >${building.name}</p>`
      }

      html += `<p class="building__street">${building.street} ${building.number}</p>
               <p class="building__municipality"> ${building.zip_code} ${building.city}</p>
            </div>
          </div>
        </li>`
    }
    if (html === '') {
      html = '<p class="no-result">No buildings found on this part of the map, drag the map to see more results.</p>'
      document.querySelector('.pagination').classList.add('is-not-visible')
    } else {
      document.querySelector('.pagination').classList.remove('is-not-visible')
    }
    return html
  },

  showTags: (item, name) => {
    let html = ''
    if (item != null && item !== 'null') {
      html += `<div class="tag tag--${name} tag--small">${item}</div>`
    }
    return html
  },

  showDetail: (address) => {
    let currentAddress = ''
    for (let i = 0; i < features.length; i++) {
      const addressData = `${features[i].properties.street} ${features[i].properties.number} ${features[i].properties.zip_code} ${features[i].properties.city}`
      if (address === addressData) { currentAddress = features[i] }
    }
    buildingDetail.showDetail(map, [currentAddress], popup)
  },

  goBack: () => {
    moveMap = true
    if (randomBuildingClicked) {
      window.localStorage.removeItem('random_building_data')
      window.location.href = '/#'
    } else {
      buildingDetail.goBack(map)
    }
  }
}

export default buildingList
