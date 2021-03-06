/**
 * This module displays and contains the logic of the buildings list page
 */

/** Modules import */
import Api from '../api.js'
import Pagination from '../Pagination/pagination'
import SearchBar from '../SearchBar/searchbar'
import Landing from '../Landing/landing'

import clusteredMap from '../MapWithClusters/mapWithClusters'
import popupBuilding from './popupBuilding'
import pulsingDot from '../Map/pulsingDot'
import buildingDetail from '../BuildingDetail/buildingDetail'
import HomeButton from '../HomeButton/homeButton'

import backButton from '../../assets/icons/back-button.svg'
import PageSwitch from '../pageSwitch/pageSwitch.js'

/** Variable declarations */
let searchData, map, popup
let data = []
let features = []
const itemsPerPage = 5
let moveMap = true
let randomBuildingClicked = false
let randomBuilding = []
const language = window.sessionStorage.getItem('lang')
let refreshLang = false

const buildingList = {
  /**
   * Creates and renders the building list and the map
   * Check if the random button on the landing pages was clicked
   * Get the searched tags/filters from the local storage
   * Get the list of buildings from api according to selected tags/filters
   */
  render: async () => {
    randomBuilding = JSON.parse(window.localStorage.getItem('random_building_data'))
    searchData = JSON.parse(window.localStorage.getItem('search_data'))
    if (typeof searchData !== 'undefined' && searchData !== null) {
      if (searchData.lang !== language) {
        searchData.lang = language
        window.localStorage.setItem('search_data', JSON.stringify(searchData))
        refreshLang = true
      }
    }

    if (typeof randomBuilding === 'undefined' || randomBuilding === null || refreshLang) {
      randomBuildingClicked = false
      data = window.localStorage.getItem('building_data')
      if (typeof data === 'undefined' || data === null || refreshLang) {
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
    <div id="clusterMap" class="map-building-list ${randomBuildingClicked ? 'map-building-list__detail' : ''}"></div>
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
        <p id="switch_text">` + window.langText.switch_text + `</p>
        <input type="checkbox" id="switch" checked /><label for="switch">Toggle</label>
      </div>
      <section class="section__list">
      <div id="home_btn_ctn"></div>
      <div class="btn__container">
        <div id="search_container"></div>
        <div class="switch__container"></div>
      </div>
      <div class="section__list__title">
        <h1 id="title_buildingslist">` + window.langText.title_buildingslist + `</h1>
        <div class="pagination"></div>
      </div>
        <ul class="building-list"></ul>
      </section>`
    }
    return view
  },
  after_render: async () => {
    if (!randomBuildingClicked) {
      /** Home button */
      HomeButton.displayHomeButton('home_btn_ctn')
      HomeButton.clickHandlerHomeBtn()

      PageSwitch.displaySwitch('switch__container')
      PageSwitch.clickHandlerBtn()
      SearchBar.displaySearchBar('search_container')
      SearchBar.searchFunction(buildingList.SearchBarCalback, buildingList.noTags)

      buildingList.initPagination()
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

  /**
   * Executed when a tag/filter was added or removed in the searchbar
   * Updates the buildings list and the map according to added filter/tag
   * @param {object} tags -  Object that contains the selected tags/filters per category
   */
  SearchBarCalback: async (tags) => {
    const send = {
      lang: language,
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

  /**
    * Creates and renders pagination
   */
  initPagination: () => {
    Pagination.init(document.getElementsByClassName('pagination')[0], {
      currentPage: 1,
      totalItems: features.length,
      itemsPerPage: itemsPerPage
    })

    Pagination.onPageChanged(buildingList.displayContent)
  },
  /**
    * Executes when user stops moving the map
    * Gets the buildings showing on the visible part of the map
    * @param {object} map - Map object, the map shown on the list page.
   */
  getBuildingsFromMap: (map) => {
    if (moveMap) {
      features = map.queryRenderedFeatures({ layers: ['hidden-locations'] })
      features.reverse()
      buildingList.initPagination()
    }
  },

  /**
    * Call function to update the building list
    * Call function when hover over a building in the list
    * Call function when clicked on a building in the list
    * @param {number} currentPage - number of the current page in the list
   */
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

  /**
    * Update the building list according to pagination and selected tags/filters in search
    * @param {number} currentPage - number of the current page in the list
   */
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
      html = '<p class="no-result">' + window.langText.no_result + '</p>'
      document.querySelector('.pagination').classList.add('is-not-visible')
    } else {
      document.querySelector('.pagination').classList.remove('is-not-visible')
    }
    return html
  },

  /**
    * Show tags that belong to the building
    * @param {string} item - Contains the name/value of the tag/filter
    * @param {string} name - Contains the name of the category
   */
  showTags: (item, name) => {
    let html = ''
    if (item != null && item !== 'null') {
      html += `<div class="tag tag--${name} tag--small">${item}</div>`
    }
    return html
  },

  /**
    * Executes when clicked on a building in the list
    * Get the building object from the building data with the same address
    * Calls function to show the details of the clicked building
    * @param {string} address - address of the clicked building
   */
  showDetail: (address) => {
    let currentAddress = ''
    for (let i = 0; i < features.length; i++) {
      const addressData = `${features[i].properties.street} ${features[i].properties.number} ${features[i].properties.zip_code} ${features[i].properties.city}`
      if (address === addressData) { currentAddress = features[i] }
    }
    buildingDetail.showDetail(map, [currentAddress], popup)
  },

  /**
    * Go back to landing page if random button was clicked
    * Go back to building list if a specific building or popup was clicked
   */
  goBack: () => {
    moveMap = true
    if (randomBuildingClicked) {
      window.localStorage.removeItem('random_building_data')
      window.location.href = '/#'
    } else {
      buildingDetail.goBack(map)
    }
  },

  /**
   * Executed when no tags/filters where selected in the search
   */
  noTags: () => {
    Landing.emptyLocalStorage()
    window.location.href = '/#'
  }
}

export default buildingList
