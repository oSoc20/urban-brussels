/**
 * This module displays and contains the logic of the search bar of the landing page
 */

/**
 * Modules imports
 */
import Api from '../api.js'
import mainSearchBar from '../SearchBar/searchbar'

import styleIcon from '../../assets/icons/style-icon.svg'
import typeIcon from '../../assets/icons/type-icon.svg'
import architectIcon from '../../assets/icons/architect-icon.svg'

/**
 * Variables declarations
 */
const language = window.sessionStorage.getItem('lang')
const tags = {
  zipcodeArr: [],
  cityArr: [],
  typeArr: [],
  styleArr: [],
  architectArr: [],
  streetArr: []
}
let obj = {}
let resp, inputValue, input


const SearchBar = {
  /**
   * Add the event listener for the search bar
   */
  searchFunction: (callback) => {
    input = document.getElementById('search_bar')
    input.addEventListener('input', SearchBar.inputHandler)
  },

  /**
   * Executes when an input is typed in the search filed
   */
  inputHandler: async (e) => {
    inputValue = e.currentTarget.value
    // Close any already open lists of autocompleted values
    mainSearchBar.closeAllLists()
    if (!inputValue) {
      return false
    }
    if (inputValue.length === 2 && inputValue[1] !== ' ') {
      obj = {
        zipCodes: [],
        cities: [],
        streets: [],
        typos: [],
        styles: [],
        intervenants: []
      }
      resp = await Api.getAutocomplete(language, inputValue)
      mainSearchBar.addItemsToObj(resp.zipCodes, obj.zipCodes)
      mainSearchBar.addItemsToObj(resp.cities, obj.cities)
      mainSearchBar.addItemsToObj(resp.streets, obj.streets)
      mainSearchBar.addItemsToObj(resp.typos, obj.typos)
      mainSearchBar.addItemsToObj(resp.styles, obj.styles)
      mainSearchBar.addItemsToObj(resp.intervenants, obj.intervenants)
    }

    // Create a div element that will contain the items (values)
    const divEl = document.createElement('DIV')
    divEl.setAttribute('class', 'autocomplete-items')

    // Append the div element as a child of the autocomplete container
    e.target.parentNode.appendChild(divEl)
    // For each item in the array:
    SearchBar.addItemsToList(divEl, obj.zipCodes, 'Zipcode')
    SearchBar.addItemsToList(divEl, obj.cities, 'City')
    SearchBar.addItemsToList(divEl, obj.streets, 'Street')
    SearchBar.addItemsToList(divEl, obj.intervenants, 'Architect', architectIcon, 'search--architect')
    SearchBar.addItemsToList(divEl, obj.styles, 'Style', styleIcon, 'search--style')
    SearchBar.addItemsToList(divEl, obj.typos, 'Type', typeIcon, 'search--type')
  },

  /**
   * Add items to the autocomplete list
   */
  addItemsToList: (divEl, array, name, icon = '', Nameclass = '') => {
    if (array) {
      for (let i = 0; i < array.length; i++) {
        // Check if searched string is included in the item
        if (array[i].toUpperCase().includes(inputValue.toUpperCase())) {
          const divTag = document.createElement('DIV')
          let className = ''

          if (Nameclass !== '') {
            const img = document.createElement('IMG')
            img.className = 'search-icon'
            className = Nameclass
            img.setAttribute('src', icon)
            img.setAttribute('alt', 'icon')
            divTag.appendChild(img)
          }

          divTag.className = className
          divTag.innerHTML += name + ': ' + array[i]
          divTag.innerHTML += "<input type='hidden' value='" + array[i] + "'>"

          // Execute  when someone clicks on an item of the autocomplete list
          divTag.addEventListener('click', (e) => {
            const value = e.currentTarget.getElementsByTagName('input')[0].value
            mainSearchBar.closeAllLists(input)
            if (name === 'Zip code') {
              tags.zipcodeArr.push(value)
            } else {
              tags[name.toLowerCase() + 'Arr'].push(value)
            }
            SearchBar.goToList()
          })

          divEl.appendChild(divTag)
        }
      }
    }
  },

  /**
   * Redirects to the buildings list page
   */
  goToList: async () => {
    // JSON body that will be sent
    const send = {
      lang: language,
      zipcode: '',
      cities: tags.cityArr,
      typologies: tags.typeArr,
      styles: tags.styleArr,
      intervenants: tags.architectArr,
      streets: tags.streetArr
    }

    if (tags.zipcodeArr.length !== 0) {
      send.zipcode = tags.zipcodeArr[0]
    }

    const data = await Api.searchData(send)
    window.localStorage.removeItem('building_data')
    window.localStorage.removeItem('search_data')
    window.localStorage.setItem('search_data', JSON.stringify(send))
    window.localStorage.setItem('building_data', JSON.stringify(data))
    if (window.location.hash !== '#/list') {
      window.location.href = '/#/list'
    }
  }
}

export default SearchBar
