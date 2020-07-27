/**
 * Modules imports
 */
import Api from '../api.js'

import styleIcon from '../../assets/icons/style-icon.svg'
import typeIcon from '../../assets/icons/type-icon.svg'
import architectIcon from '../../assets/icons/architect-icon.svg'

/**
 * Variables declarations
 */
const searchText = ['Search', 'Chercher', 'Zoeken']
const tags = {
  zipcodeArr: [],
  cityArr: [],
  typeArr: [],
  styleArr: [],
  architectArr: [],
  streetArr: []
}
let obj = {}
let resp, val, inp

// Rendering of the search bar
const SearchBar = {
  displaySearchBar: (container) => {
    document.getElementById(container).innerHTML = /* html */`
        <div class="search_ctn">
            <form class="searchbar_ctn" autocomplete="off">
                <input id="search_bar" type="text" placeholder="${searchText[0]}" />
            </form>
            <div class="selected-items">
            </div>
        </div>`
  },

  searchFunction: () => {
    inp = document.getElementById('search_bar')
    // Execute when an input is typed in the search field
    inp.addEventListener('input', async function (e) {
      var a
      val = this.value

      if (val.length === 2) {
        obj = {
          zipCodes: [],
          cities: [],
          streets: [],
          typos: [],
          styles: [],
          intervenants: []
        }
        resp = await Api.getAutocomplete('fr', val)
        SearchBar.addItemsToObj(resp.zipCodes, obj.zipCodes)
        SearchBar.addItemsToObj(resp.cities, obj.cities)
        SearchBar.addItemsToObj(resp.streets, obj.streets)
        SearchBar.addItemsToObj(resp.typos, obj.typos)
        SearchBar.addItemsToObj(resp.styles, obj.styles)
        SearchBar.addItemsToObj(resp.intervenants, obj.intervenants)
      }

      // Close any already open lists of autocompleted values
      SearchBar.closeAllLists(inp)
      if (!val) { return false }

      // Create a div element that will contain the items (values)
      a = document.createElement('DIV')
      a.setAttribute('id', this.id + 'autocomplete-list')
      a.setAttribute('class', 'autocomplete-items')

      // Append the div element as a child of the autocomplete container
      this.parentNode.appendChild(a)

      SearchBar.addItemsToList(a, obj.zipCodes, 'Zip code')
      SearchBar.addItemsToList(a, obj.cities, 'City')
      SearchBar.addItemsToList(a, obj.streets, 'Street')
      SearchBar.addItemsToList(a, obj.intervenants, 'Architect', architectIcon, 'search--architect')
      SearchBar.addItemsToList(a, obj.styles, 'Style', styleIcon, 'search--style')
      SearchBar.addItemsToList(a, obj.typos, 'Type', typeIcon, 'search--type')
    })
  },

  // Close all autocomplete list in the document except the ones in argument
  closeAllLists: (elmnt, inp) => {
    var x = document.getElementsByClassName('autocomplete-items')
    for (var i = 0; i < x.length; i++) {
      if (elmnt !== x[i] && elmnt !== inp) {
        x[i].parentNode.removeChild(x[i])
      }
    }
  },

  // Add items to the object
  addItemsToObj: (arr, objArr) => {
    if (arr.length !== 0) {
      for (let i = 0; i < arr.length; i++) {
        objArr.push(arr[i].name)
      }
    }
  },

  // Add items to the autocomplete list
  addItemsToList: (a, arr, name, icon = '', Nameclass = '') => {
    if (arr) {
      for (let i = 0; i < arr.length; i++) {
      // Check if searched string is included in the item
        if (arr[i].toUpperCase().includes(val.toUpperCase())) {
          const b = document.createElement('DIV')
          let className = ''

          if (Nameclass !== '') {
            const img = document.createElement('IMG')
            img.className = 'search-icon'
            className = Nameclass
            img.setAttribute('src', icon)
            img.setAttribute('alt', 'icon')
            b.appendChild(img)
          }

          b.className = className
          b.innerHTML += name + ': ' + arr[i]
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>"

          // Execute  when someone clicks on an item of the autocomplete list
          b.addEventListener('click', function () {
            const value = this.getElementsByTagName('input')[0].value
            SearchBar.closeAllLists(inp)
            if (name === 'Zip code') {
              tags.zipcodeArr.push(value)
            } else {
              tags[name.toLowerCase() + 'Arr'].push(value)
            }
            SearchBar.goToList()
          })
          a.appendChild(b)
        }
      }
    }
  },

  goToList: async () => {
    // JSON body that will be sent
    const send = {
      lang: 'fr',
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
