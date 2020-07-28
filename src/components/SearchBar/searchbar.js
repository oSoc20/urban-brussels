/**  Modules imports */
import Api from '../api.js'
import styleIcon from '../../assets/icons/style-icon.svg'
import typeIcon from '../../assets/icons/type-icon.svg'
import architectIcon from '../../assets/icons/architect-icon.svg'

/**  Variables declarations */
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
let resp, inputValue, searchDiv, input, callbackFunction, callbackFunctionNoTags
let prevTagsTotalIndex = 0
let prevTagsIndex = 0

// Rendering of the search bar
const SearchBar = {
  displaySearchBar: (container) => {
    document.getElementById(container).innerHTML = /* html */ `
        <div class="search_ctn">
            <form class="searchbar_ctn" autocomplete="off">
                <input id="search_bar" type="text" placeholder="${window.langText.search_bar}" />
            </form>
            <div class="selected-items">
            </div>
        </div>`
  },

  searchFunction: (callback, callbackNoTags) => {
    callbackFunction = callback
    callbackFunctionNoTags = callbackNoTags
    searchDiv = document.getElementsByClassName('selected-items')
    input = document.getElementById('search_bar')
    SearchBar.getSearchedTag()

    // Execute when an input is typed in the search field
    input.addEventListener('input', SearchBar.inputHandler)
  },

  getSearchedTag: () => {
    let searchData = window.localStorage.getItem('search_data')
    if (typeof searchData !== 'undefined' && searchData !== null) {
      searchData = JSON.parse(searchData)
      for (const item in searchData) {
        prevTagsTotalIndex += searchData[item].length
        if (item === 'zipcode' && searchData[item].length >= 4) {
          prevTagsTotalIndex -= 3
        }
      }
      prevTagsTotalIndex -= 2

      SearchBar.addTag(searchData.zipcode, 'Zipcode')
      SearchBar.addTag(searchData.cities, 'City')
      SearchBar.addTag(searchData.streets, 'Street')
      SearchBar.addTag(searchData.intervenants, 'Architect', 'search--architect', 'tag--architect')
      SearchBar.addTag(searchData.styles, 'Style', 'search--style', 'tag--style')
      SearchBar.addTag(searchData.typologies, 'Type', 'search--type', 'tag--type')
    }
  },
  addTag: (array, name, Nameclass = '', tagClass = '') => {
    if (Array.isArray(array)) {
      if (array.length !== 0) {
        array.forEach(item => {
          prevTagsIndex++
          SearchBar.selectTagFromList(item, name, Nameclass, tagClass)
        })
      }
    } else {
      if (array !== '') {
        prevTagsIndex++
        SearchBar.selectTagFromList(array, name, Nameclass, tagClass)
      }
    }
  },

  inputHandler: async (e) => {
    inputValue = e.currentTarget.value
    // Close any already open lists of autocompleted values
    SearchBar.closeAllLists()
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
      SearchBar.addItemsToObj(resp.zipCodes, obj.zipCodes)
      SearchBar.addItemsToObj(resp.cities, obj.cities)
      SearchBar.addItemsToObj(resp.streets, obj.streets)
      SearchBar.addItemsToObj(resp.typos, obj.typos)
      SearchBar.addItemsToObj(resp.styles, obj.styles)
      SearchBar.addItemsToObj(resp.intervenants, obj.intervenants)
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
    SearchBar.addItemsToList(divEl, obj.intervenants, 'Architect', architectIcon, 'search--architect', 'tag--architect')
    SearchBar.addItemsToList(divEl, obj.styles, 'Style', styleIcon, 'search--style', 'tag--style')
    SearchBar.addItemsToList(divEl, obj.typos, 'Type', typeIcon, 'search--type', 'tag--type')
  },

  // Add items to the object
  addItemsToObj: (arr, objArr) => {
    if (arr.length !== 0) { arr.forEach(item => objArr.push(item.name)) }
  },

  // Close all autocomplete list in the document except the ones in argument
  closeAllLists: () => {
    const autocompleteItems = document.querySelectorAll('.autocomplete-items')
    autocompleteItems.forEach(item => item.parentNode.removeChild(item))
  },

  // Add items to the autocomplete list
  addItemsToList: (divEl, array, name, icon = '', Nameclass = '', tagClass = '') => {
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
          divTag.addEventListener('click', (event) => {
            const value = event.target.getElementsByTagName('input')[0].value
            SearchBar.selectTagFromList(value, name, Nameclass, tagClass)
          })

          divEl.appendChild(divTag)
        }
      }
    }
  },

  selectTagFromList: (value = '', name, Nameclass = '', tagClass = '') => {
    SearchBar.closeAllLists()
    if (value !== '') {
      // Add tag
      if (!tags[name.toLowerCase() + 'Arr'].includes(value)) {
        const tag = document.createElement('button')
        tag.dataset.name = name
        let className = ''

        if (Nameclass !== '') {
          className = tagClass
        }

        tag.className = `tag tag--small tag--selected ${className}`
        console.log(tag)
        tag.innerHTML =
          /* html */ `
        <span class="close_tags_button">
          <svg width="10" height="10" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path class="${className}" d="M1 1L10 10"  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path class="${className}" d="M10 1L1 10"  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
        ` + name + ': ' + value
        console.log(tag)
        searchDiv[0].appendChild(tag)
        if (name === 'Zip code') {
          tags.zipcodeArr.push(value)
        } else {
          tags[name.toLowerCase() + 'Arr'].push(value)
        }

        // Close tags
        const usedTags = document.querySelectorAll('.tag')
        usedTags.forEach(item => item.addEventListener('click', SearchBar.clickHandlerTag))
      }
      input.value = ''
      if (prevTagsIndex === prevTagsTotalIndex) {
        SearchBar.updateList()
      }
    }
  },
  clickHandlerTag: (e) => {
    const txt = e.currentTarget.childNodes[2].data
    const index = txt.indexOf(':')
    SearchBar.closeTag(e.currentTarget, txt.substr(index + 2))
  },

  closeTag: (item, value) => {
    const name = item.dataset.name
    item.style.display = 'none'
    const index = tags[name.toLowerCase() + 'Arr'].indexOf(value)
    if (index > -1) {
      tags[name.toLowerCase() + 'Arr'].splice(index, 1)
      let count = 0
      for (const item in tags) {
        count += tags[item].length
      }
      if (count === 0) {
        SearchBar.noTags()
      } else {
        SearchBar.updateList()
      }
    }
  },

  updateList: async () => {
    callbackFunction(tags)
  },

  noTags: () => {
    callbackFunctionNoTags()
  }
}

export default SearchBar
