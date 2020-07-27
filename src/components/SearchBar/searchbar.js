/**  Modules imports */
import Api from '../api.js'
import styleIcon from '../../assets/icons/style-icon.svg'
import typeIcon from '../../assets/icons/type-icon.svg'
import architectIcon from '../../assets/icons/architect-icon.svg'

/**  Variables declarations */
const searchText = ['Search', 'Chercher', 'Zoeken']
let tags = {
  zipcodeArr: [],
  cityArr: [],
  typeArr: [],
  styleArr: [],
  architectArr: [],
  streetArr: []
}

let obj = {}
let resp, inputValue, searchDiv, input

// Rendering of the search bar
const SearchBar = {
  displaySearchBar: (container) => {
    document.getElementById(container).innerHTML = /* html */ `
        <div class="search_ctn">
            <form class="searchbar_ctn" autocomplete="off">
                <input id="search_bar" type="text" placeholder="${searchText[0]}" />
            </form>
            <div class="selected-items">
            </div>
        </div>`
  },

  searchFunction: () => {
    searchDiv = document.getElementsByClassName('selected-items')
    input = document.getElementById('search_bar')
    SearchBar.getSearchedTag()

    // Execute when an input is typed in the search field
    input.addEventListener('input', SearchBar.inputHandler)
  },

  getSearchedTag: () => {
    let searchData = window.localStorage.getItem('search_data')
    if (typeof searchData !== 'undefined' || searchData !== null) {
      searchData = JSON.parse(searchData)

      SearchBar.addTag(searchData.zipcode, 'Zip code')
      SearchBar.addTag(searchData.cities, 'City')
      SearchBar.addTag(searchData.streets, 'Street')
      SearchBar.addTag(searchData.intervenants, 'Architect', 'search--architect', 'tag--architect')
      SearchBar.addTag(searchData.styles, 'Style', 'search--style', 'tag--style')
      SearchBar.addTag(searchData.typologies, 'Type', 'search--type', 'tag--type')
    }
  },
  addTag: (array, name, Nameclass = '', tagClass = '') => {
    if (array.length !== 0) {
      array.forEach(item => {
        SearchBar.selectTagFromList(item, name, Nameclass, tagClass)
      })
    }
  },

  inputHandler: async (e) => {
    inputValue = e.currentTarget.value
    // Close any already open lists of autocompleted values
    SearchBar.closeAllLists()
    if (!inputValue) {
      return false
    }

    if (inputValue.length === 2) {
      obj = {
        zipCodes: [],
        cities: [],
        streets: [],
        typos: [],
        styles: [],
        intervenants: []
      }
      resp = await Api.getAutocomplete('fr', inputValue)
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
    SearchBar.addItemsToList(divEl, obj.zipCodes, 'Zip code')
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
        if (name === 'Zip code') {
          tags.zipcodeArr.push(value)
        } else {
          tags[name.toLowerCase() + 'Arr'].push(value)
        }

        // Close tags
        const usedTags = document.querySelectorAll('.tag')
        usedTags.forEach(item => item.addEventListener('click', () => SearchBar.closeTag(item, value, name)))
      }
      input.value = ''
      SearchBar.updateList()
    }
  },

  closeTag: (item, value, name) => {
    item.style.display = 'none'
    console.log(value)
    const index = tags[name.toLowerCase() + 'Arr'].indexOf(value)
    if (index > -1) {
      tags[name.toLowerCase() + 'Arr'].splice(index, 1)
      console.log(tags)
    }
    SearchBar.updateList()
  },

  updateList: async () => {
    console.log('updateList')
    const send = {
      lang: 'fr',
      zipcode: '',
      cities: tags.cityArr,
      typologies: tags.typeArr,
      styles: tags.styleArr,
      intervenants: tags.architectArr,
      streets: tags.streetArr
    }
    const data = await Api.searchData(send)
    console.log(data)

    window.localStorage.removeItem('building_data')
    window.localStorage.removeItem('search_data')
    window.localStorage.setItem('search_data', JSON.stringify(send))
    window.localStorage.setItem('building_data', JSON.stringify(data))
  }
}

export default SearchBar
