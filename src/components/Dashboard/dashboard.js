/** This file enables the Dashboard page
 * Modules import
 */
import Api from '../api.js'
import Chart from './charts.js'
import clusteredMap from '../MapWithClusters/mapWithClusters'
import SearchBar from '../SearchBar/searchbar'
import PageSwitch from '../pageSwitch/pageSwitch.js'
import HomeButton from '../HomeButton/homeButton'

/** Declaring variables */
let map
let searchData
let mapData
let mapDisabled = true
let statsData = []
const language = window.sessionStorage.getItem('lang')
let sendData = {
  lang: language,
  cities: [],
  intervenants: [],
  streets: [],
  styles: [],
  typologies: [],
  zipcodes: []
}
const Dashboard = {
/** Getting the data from local storage */
  render: async () => {
    searchData = window.localStorage.getItem('search_data')
    if (typeof searchData !== 'undefined' && searchData !== null) {
      mapDisabled = false
      searchData = JSON.parse(searchData)
      for (const item in searchData) {
        if (Array.isArray(searchData[item]) && searchData[item].length === 0) {
          mapDisabled = true
        } else {
          if (item !== 'lang' && item !== 'zipcode') {
            mapDisabled = false
            break
          }
        }
      }
      if (searchData.zipcode !== '') {
        mapDisabled = false
      }
    } else {
      mapDisabled = true
    }
    /** HTML containers for the charts and baselayer switch function on the map */
    const view = /* html */ `
    <section class="section__list section__search__dashboard">
      <div id="home_button_ctn"></div>
      <div id="search_container"></div>
      <div class="switch__container switch__container--dashboard"></div>
    </section>
    <div class="grid-container">
      <main class="main">
          <div class="main-overview">
              <div class="item">
                <div class="chart_title1">` + window.langText.chart_title1 + `</div>
                <div class="ct-chart1" id="chart1"></div>
              </div>
              <div class="item">
                <div class="chart_title2">` + window.langText.chart_title2 + `</div>
                <div class="ct-chart2" id="chart2"></div>
              </div>
              <div class="item">
                <div class="chart_title3">` + window.langText.chart_title3 + `</div>
                <div class="ct-chart3" id="chart3"></div>
              </div>
              <div class="item map_dashboard" id="clusterMap"></div>
              <div id="baselayer_container"></div>
          </div>
          <div class="item">
                <div class="chart_title4">` + window.langText.chart_title4 + `</div>
                <div class="ct-chart4" id="chart4"></div>
              </div>
      </main>
    </div>`
    return view
  },
  after_render: async () => {
    /** Home button */
    HomeButton.displayHomeButton('home_button_ctn')
    HomeButton.clickHandlerHomeBtn()

    /** Enabling the SearchBar as the page is loaded */
    PageSwitch.displaySwitch('switch__container')
    PageSwitch.clickHandlerBtn()
    SearchBar.displaySearchBar('search_container')
    SearchBar.searchFunction(Dashboard.SearchBarCalback, Dashboard.noTags)

    if (mapDisabled) {
      Dashboard.noTags()
      map = clusteredMap.init()
      document.querySelector('.map_dashboard').classList.add('is-not-visible')
      document.querySelector('#baselayer_container').classList.add('is-not-visible')
      document.querySelector('.switch__container--dashboard').classList.add('is-not-visible')
    } else {
      document.querySelector('.map_dashboard').classList.remove('is-not-visible')
      document.querySelector('#baselayer_container').classList.remove('is-not-visible')
      document.querySelector('.switch__container--dashboard').classList.remove('is-not-visible')
      mapData = await Api.searchData(searchData)
      map = clusteredMap.init(mapData)
      sendData = {
        lang: language,
        cities: searchData.cities,
        intervenants: searchData.intervenants,
        streets: searchData.streets,
        styles: searchData.styles,
        typologies: searchData.typologies,
        zipcodes: []
      }

      if (searchData.zipcode !== '') {
        sendData.zipcodes.push(searchData.zipcode)
      }

      statsData = await Api.getStats(sendData)
      Dashboard.showStats()
    }
  },
  showStats: () => {
    // Declare labels and series arrays
    const styleArray = []
    const sValArray = []
    const architectArray = []
    const aValArray = []
    const typologyArray = []
    const tValArray = []

    // Store top 10 in arrays
    for (let index = 0; index < 10; index++) {
      styleArray[index] = Object.keys(statsData.BuildingsPerStyle)[index]
      sValArray[index] = Object.values(statsData.BuildingsPerStyle)[index]
      architectArray[index] = Object.keys(statsData.BuildingsPerIntervenant)[index]
      aValArray[index] = Object.values(statsData.BuildingsPerIntervenant)[index]
      typologyArray[index] = Object.keys(statsData.BuildingsPerTypology)[index]
      tValArray[index] = Object.values(statsData.BuildingsPerTypology)[index]
    }

    // Buildings per architect
    Chart.createHBarChart('.ct-chart1', architectArray, aValArray)

    // Buildings per style
    Chart.createHBarChart('.ct-chart2', styleArray, sValArray)

    // Buildings per typology
    Chart.createHBarChart('.ct-chart3', typologyArray, tValArray)

    // Buildings over time (timeline)
    Chart.createTimeline('.ct-chart4', Object.keys(statsData.BuildingsPerYear), Object.values(statsData.BuildingsPerYear))
  },
  /** Selecting tags based on your input in SearchBar
   * tags: displaying tags with and without the map
   * tags.zipcodeArr.length: send data to the map if there are buildings from the searc input
   * mapDisabled: disable the map when there
  */
  SearchBarCalback: async (tags) => {
    for (const item in tags) {
      if (Array.isArray(tags[item]) && tags[item].length === 0) {
        mapDisabled = true
      } else {
        mapDisabled = false
        break
      }
    }

    const sendDataMap = {
      lang: language,
      zipcode: '',
      cities: tags.cityArr,
      typologies: tags.typeArr,
      styles: tags.styleArr,
      intervenants: tags.architectArr,
      streets: tags.streetArr
    }
    // Returning data from the search to th map
    if (tags.zipcodeArr.length > 0) {
      sendDataMap.zipcode = tags.zipcodeArr[0]
    }

    window.localStorage.removeItem('search_data')
    window.localStorage.setItem('search_data', JSON.stringify(sendDataMap))

    if (!mapDisabled) {
      document.querySelector('.map_dashboard').classList.remove('is-not-visible')
      document.querySelector('#baselayer_container').classList.remove('is-not-visible')
      document.querySelector('.switch__container--dashboard').classList.remove('is-not-visible')
      mapData = await Api.searchData(sendDataMap)
      if (map !== undefined) {
        map.resize()
        map.getSource('buildings').setData(mapData)
        map.getSource('unclustered-locations').setData(mapData)
        map.easeTo({
          center: [4.4006, 50.8452],
          zoom: 10.24
        })
      }
    }

    if (mapDisabled) {
      document.querySelector('.map_dashboard').classList.add('is-not-visible')
      document.querySelector('#baselayer_container').classList.add('is-not-visible')
      document.querySelector('.switch__container--dashboard').classList.add('is-not-visible')
      if (map !== undefined) {
        map.resize()
      }
    }

    sendData = {
      lang: language,
      cities: tags.cityArr,
      intervenants: tags.architectArr,
      streets: tags.streetArr,
      styles: tags.styleArr,
      typologies: tags.typeArr,
      zipcodes: []
    }

    if (tags.zipcodeArr.length !== 0) {
      tags.zipcodeArr.forEach(item => {
        sendData.zipcodes.push(item)
      })
    }
    if (mapDisabled) {
      let statsNoTags = JSON.parse(window.localStorage.getItem('stats_no_tags_data'))
      if (typeof statsNoTags === 'undefined' || statsNoTags === null) {
        statsNoTags = await Api.getStats(sendData)
        window.localStorage.setItem('stats_no_tags_data', JSON.stringify(statsNoTags))
        statsData = statsNoTags
      } else {
        statsData = statsNoTags
      }
    } else {
      statsData = await Api.getStats(sendData)
    }

    Dashboard.showStats()
  },
  noTags: () => {
  /** If no tags are selected, map is disabled */
    const tags = {
      zipcodeArr: [],
      cityArr: [],
      typeArr: [],
      styleArr: [],
      architectArr: [],
      streetArr: []
    }
    mapDisabled = true
    Dashboard.SearchBarCalback(tags)
  }
}

export default Dashboard
