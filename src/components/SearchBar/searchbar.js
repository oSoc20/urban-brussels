/**
 * This module displays and contains the logic of the search bar in the buildings list and dashboard page
 */

/**  Modules imports */
import Api from '../api.js'
import styleIcon from '../../assets/icons/style-icon.svg'
import typeIcon from '../../assets/icons/type-icon.svg'
import architectIcon from '../../assets/icons/architect-icon.svg'

/**  Variables declarations */
const language = window.sessionStorage.getItem('lang')
let tags = {
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
let existingTag = false;

const SearchBar = {
  /**
   * Renders the search bar
   * @param {string} container - the class or the id that will contain the search bar
   */
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
  /**
   * Add the event listener for the search bar
   * Call function to get the searched tags from the local storage
   * @param {function} callback - callback function this function will be executed when search filters/tags are added or removed
   * @param {function} callbackNoTags - callback function this function will be executed when no search filters/tags are selected
   */
  searchFunction: (callback, callbackNoTags) => {
    callbackFunction = callback
    callbackFunctionNoTags = callbackNoTags
    searchDiv = document.getElementsByClassName('selected-items')
    input = document.getElementById('search_bar')
    SearchBar.getSearchedTag()

    // Execute when an input is typed in the search field
    input.addEventListener('input', SearchBar.inputHandler)
  },

  /**
   * Get the searched tags from the local storage
   */
  getSearchedTag: () => {
    tags = {
      zipcodeArr: [],
      cityArr: [],
      typeArr: [],
      styleArr: [],
      architectArr: [],
      streetArr: []
    }
    let searchData = window.localStorage.getItem('search_data')
    if (typeof searchData !== 'undefined' && searchData !== null) {
      searchData = JSON.parse(searchData)
      if (searchData.lang === null) {
        searchData.lang = 'fr'
      }
      for (const item in searchData) {
        prevTagsTotalIndex += searchData[item].length
        if (item === 'zipcode' && searchData[item].length >= 4) {
          prevTagsTotalIndex -= 3
        }
      }
      prevTagsTotalIndex -= 2

      SearchBar.addTag(searchData.zipcode, window.langText.zipcode)
      SearchBar.addTag(searchData.cities, window.langText.city)
      SearchBar.addTag(searchData.streets, window.langText.street)
      SearchBar.addTag(searchData.intervenants, window.langText.architect, 'search--architect', 'tag--architect')
      SearchBar.addTag(searchData.styles, window.langText.style, 'search--style', 'tag--style')
      SearchBar.addTag(searchData.typologies, window.langText.type, 'search--type', 'tag--type')
    }
  },

  /**
   * Check if array parameter is an array or a string and if it's not empty call function to show the searched tags/filters
   * @param {Array} array - array that contains the tags/filters that are searched for
   * @param {string} name - Name of the category the tags/filters belong to (zipcode, city, street, architect, style, type)
   * @param {string} Nameclass - class to change the style of the item in the  autocomplete list according to the category
   * @param {string} tagClass - class to change the style of the shown tags/filters according to the category
   */
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

  /**
   * Executes when an input is typed in the search filed
   * @param {Object} e - the current event
   */
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
    SearchBar.addItemsToList(divEl, obj.zipCodes, window.langText.zipcode)
    SearchBar.addItemsToList(divEl, obj.cities, window.langText.city)
    SearchBar.addItemsToList(divEl, obj.streets, window.langText.street)
    SearchBar.addItemsToList(divEl, obj.intervenants, window.langText.architect, architectIcon, 'search--architect')
    SearchBar.addItemsToList(divEl, obj.styles, window.langText.style, styleIcon, 'search--style')
    SearchBar.addItemsToList(divEl, obj.typos, window.langText.typologie, typeIcon, 'search--type')
  },

  /**
   * Add an array of items to another one
   * @param {Object} arr - array that contains the items that need to be added
   * @param {Object} objArr - destination array where items will be pushed
   */
  addItemsToObj: (arr, objArr) => {
    if (arr.length !== 0) { arr.forEach(item => objArr.push(item.name)) }
  },

  /**
   * Close all autocomplete lists
   */
  closeAllLists: () => {
    const autocompleteItems = document.querySelectorAll('.autocomplete-items')
    autocompleteItems.forEach(item => item.parentNode.removeChild(item))
  },

  /**
   * Add an item to the autocomplete list in the right style
   * @param {HTMLElement} divEl- HTML element that will conains the autocomplete list items
   * @param {Array} array- array that contains the tags/filters that are searched for
   * @param {string} name- Name of the category the tags/filters belong to (zipcode, city, street, architect, style, type)
   * @param {image} icon- Image that belongs to the category
   * @param {string} Nameclass- Class to change the style of the item in the  autocomplete list according to the category
   * @param {string} tagClass- Class to change the style of the shown tags/filters according to the category
   */
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

  /**
   * Create and show the searched tags/filters with icon to remove
   * @param {string} value - Contains the name/value of the tag/filter
   * @param {string} name - Name of the category the tags/filters belong to (zipcode, city, street, architect, style, type)
   * @param {string} Nameclass - Class to change the style of the item in the  autocomplete list according to the category
   * @param {string} tagClass - Class to change the style of the shown tags/filters according to the category
   */
  selectTagFromList: (value = '', name, Nameclass = '', tagClass = '') => {
    SearchBar.closeAllLists()
    if (value !== '') {
      // Add tag
      for (let item in tags) {
        if (tags[item].includes(value)){
          existingTag = true;
          break;
        }
      }
      if (!existingTag) {
        const tag = document.createElement('button')
        tag.dataset.name = name
        let className = ''

        if (Nameclass !== '') {
          className = tagClass
        }

        tag.className = `tag tag--small tag--selected ${className}`
        tag.innerHTML =
          /* html */ `
        <span class="close_tags_button">
          <svg width="10" height="10" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path class="${className}" d="M1 1L10 10"  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path class="${className}" d="M10 1L1 10"  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
        ` + name + ': ' + value
        searchDiv[0].appendChild(tag)

        switch(name){
          case window.langText.zipcode:
            tags.zipcodeArr.push(value)
            break;
          case window.langText.city:
            tags.cityArr.push(value)
            break;
          case window.langText.street:
            tags.streetArr.push(value)
            break;
          case window.langText.architect:
            tags.architectArr.push(value)
            break;
          case window.langText.style:
            tags.styleArr.push(value)
            break;
          case window.langText.type:
            tags.typeArr.push(value)
            break;
          default:
            break;  
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

  /**
   * Executes when  clicked on a tag/filter
   * Gets the value without category name
   * @param {Object} e - the current event
   */
  clickHandlerTag: (e) => {
    const txt = e.currentTarget.childNodes[2].data
    const index = txt.indexOf(':')
    SearchBar.closeTag(e.currentTarget, txt.substr(index + 2))
  },

  /**
   * Executes when clicked on a tag/filter
   * Removes the clicked tag
   * Gets the value without category name
   * @param {Object} item - current tag(html object) that was clicked on
   * @param {string} value - value of the current tag without category name
   */
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

  /**
   * Calls calback function when tag/filter was removed or added
   */
  updateList: async () => {
    callbackFunction(tags)
  },

  /**
   * Calls calback function when there are no tags/filters selected
   */
  noTags: () => {
    callbackFunctionNoTags()
  }
}

export default SearchBar
