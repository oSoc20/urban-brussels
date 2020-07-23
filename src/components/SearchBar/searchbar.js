import Api from '../api.js'
import searchIcon from '../../assets/icons/search-icon.svg'

import styleIcon from '../../assets/icons/style-icon.svg'
import typeIcon from '../../assets/icons/type-icon.svg'
import architectIcon from '../../assets/icons/architect-icon.svg'
import buildingList from '../BuildingsListPage/buildingslist.js'

/* Variable declarations */
let search_text = ["Search", "Chercher", "Zoeken"]
let tags_set = {
  'zip code': [],
  city: [],
  type: [],
  style: [],
  architect: [],
  street: []
}
let obj = {}
let resp
let val;
let search_div
let inp
let noSearchItem = true

const SearchBar = {
  displaySearchBar: (container_idname) => {
    document.getElementById(container_idname).innerHTML = /* html */`
        <div class="search_ctn">
            <form class="searchbar_ctn" autocomplete="off">
                <input id="search_bar" type="text" placeholder="${search_text[0]}" />
                <button class="btn btn--search" id="search_btn"><img src="${searchIcon}"/></button>
            </form>
            <div class="selected-items">
            </div>
        </div>
        `
  },

  searchFunction: () => {
    search_div = document.getElementsByClassName('selected-items')
    const search = document.getElementById('search_btn')

    inp = document.getElementById('search_bar')
    var currentFocus
    /* execute a function when someone writes in the text field: */
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

      /* close any already open lists of autocompleted values */
      SearchBar.closeAllLists(inp)
      if (!val) { return false }
      currentFocus = -1
      /* create a DIV element that will contain the items (values): */
      a = document.createElement('DIV')
      a.setAttribute('id', this.id + 'autocomplete-list')
      a.setAttribute('class', 'autocomplete-items')
      /* append the DIV element as a child of the autocomplete container: */
      this.parentNode.appendChild(a)
      /* for each item in the array... */
      SearchBar.addItemsToList(a, obj.zipCodes, 'Zip code')
      SearchBar.addItemsToList(a, obj.cities, 'City')
      SearchBar.addItemsToList(a, obj.streets, 'Street')
      SearchBar.addItemsToList(a, obj.intervenants, 'Architect', architectIcon, 'search--architect', 'tag--architect')
      SearchBar.addItemsToList(a, obj.styles, 'Style', styleIcon, 'search--style', 'tag--style')
      SearchBar.addItemsToList(a, obj.typos, 'Type', typeIcon, 'search--type', 'tag--type')
    })
    /* execute a function presses a key on the keyboard: */
    inp.addEventListener('keydown', function (e) {
      var x = document.getElementById(this.id + 'autocomplete-list')
      if (x) x = x.getElementsByTagName('div')
      if (e.keyCode === 40) {
        /* If the arrow DOWN key is pressed,
         increase the currentFocus variable: */
        currentFocus++
        /* and and make the current item more visible: */
        SearchBar.addActive(x, currentFocus)
      } else if (e.keyCode === 38) { // up
        /* If the arrow UP key is pressed,
        decrease the currentFocus variable: */
        currentFocus--
        /* and and make the current item more visible: */
        SearchBar.addActive(x)
      } else if (e.keyCode === 13) {
        /* If the ENTER key is pressed, prevent the form from being submitted, */
        e.preventDefault()
        if (currentFocus > -1) {
          /* and simulate a click on the "active" item: */
          if (x) x[currentFocus].click()
        }
      }
    })

    search.addEventListener('click', async (e) => {
      e.preventDefault()
      const send = {
        lang: 'fr',
        strict: false,
        zipcode: '',
        cities: tags_set.city,
        typographies: tags_set.type,
        styles: tags_set.style,
        intervenants: tags_set.architect,
        streets: tags_set.street
      }

      // const send = {
      //   lang: 'fr',
      //   strict: false,
      //   zipcode: null,
      //   city: null,
      //   typology: null,
      //   style: null,
      //   architects: null,
      //   streets: null
      // }

      // TOT DELETE WHEN MULTIPLE VALUES ARE POSSIBLE
      if (tags_set['zip code'].length !== 0) {
        send.zipcode = tags_set['zip code'][0]
      }

      // if (tags_set.city.length !== 0) {
      //   send.city = tags_set.city[0]
      // }

      // if (tags_set.type.length !== 0) {
      //   send.typology = tags_set.type[0]
      // }

      // if (tags_set.style.length !== 0) {
      //   send.style = tags_set.style[0]
      // }

      // if (tags_set.architect.length !== 0) {
      //   send.architects = tags_set.architect[0]
      // }

      // if (tags_set.street.length !== 0) {
      //   send.streets = tags_set.street[0]
      // }

      const data = await Api.searchData(send)
      console.log(data)

      window.localStorage.removeItem('building_data')
      window.localStorage.removeItem('search_data')
      window.localStorage.setItem('search_data', JSON.stringify(send))
      window.localStorage.setItem('building_data', JSON.stringify(data))
      if (window.location.hash !== '#/list') {
        window.location.href = '/#/list'
      }
    })
  },

  addActive: (x, currentFocus) => {
    /* a function to classify an item as "active": */
    if (!x) return false
    /* start by removing the "active" class on all items: */
    SearchBar.removeActive(x)
    if (currentFocus >= x.length) currentFocus = 0
    if (currentFocus < 0) currentFocus = (x.length - 1)
    /* add class "autocomplete-active": */
    x[currentFocus].classList.add('autocomplete-active')
  },

  removeActive: (x) => {
    /* a function to remove the "active" class from all autocomplete items: */
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove('autocomplete-active')
    }
  },

  closeAllLists: (elmnt, inp) => {
    /* close all autocomplete lists in the document,
        except the one passed as an argument: */
    var x = document.getElementsByClassName('autocomplete-items')
    for (var i = 0; i < x.length; i++) {
      if (elmnt !== x[i] && elmnt !== inp) {
        x[i].parentNode.removeChild(x[i])
      }
    }
  },

  addItemsToObj: (arr, objArr) => {
    if (arr.length !== 0) {
      for (let i = 0; i < arr.length; i++) {
        objArr.push(arr[i].name)
      }
    }
  },

  addItemsToList: (a, arr, name, icon = '', Nameclass = '', tagClass = '') => {
    if (arr) {
    for (let i = 0; i < arr.length; i++) {
      /* check if the item starts with the same letters as the text field value: */
        if (arr[i].toUpperCase().includes(val.toUpperCase())) {
        /* create a DIV element for each matching element */
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
          /* make the matching letters bold: */
          let j = arr[i].indexOf(val)
          // b.innerHTML = "<strong>" + arr[i].substr(j, val.length) + "</strong>";
          b.innerHTML += name + ': ' + arr[i]
          /* insert a input field that will hold the current array item's value: */
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>"
          /* execute a function when someone clicks on the item value (DIV element): */
          b.addEventListener('click', function (e) {
            /* insert the value for the autocomplete text field: */
            // inp.value = this.getElementsByTagName("input")[0].value;
            const value = this.getElementsByTagName('input')[0].value
            /* close the list of autocompleted values,
            (or any other open lists of autocompleted values: */
            SearchBar.closeAllLists(inp)

            // Add tag

            if (!tags_set[name.toLowerCase()].includes(value)) {
              const tag = document.createElement('button')
              let className = ''

              if (Nameclass !== '') {
                className = tagClass
              }

              tag.className = `tag tag--small tag--selected ${className}`
              tag.innerHTML = /* html */`
              <span class="close_tags_button">
                <svg width="10" height="10" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path class="${className}" d="M1 1L10 10"  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path class="${className}" d="M10 1L1 10"  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
              ` + name + ': ' + value
              search_div[0].appendChild(tag)
              // tags_set.add(value.substr(0, value.indexOf('(')-1));
              tags_set[name.toLowerCase()].push(value)

              // Close tags
              const tags = document.getElementsByClassName('tag')
              for (let i = 0; i < tags.length; i++) {
                tags[i].addEventListener('click', () => {
                  noSearchItem = true
                  tags[i].style.display = 'none'
                  const index = tags_set[name.toLowerCase()].indexOf(value)
                  if (index > -1) {
                    tags_set[name.toLowerCase()].splice(index, 1)
                  }

                  for (const o in tags_set) {
                    if (tags_set[o].length !== 0) {
                      noSearchItem = false
                    }
                  }

                  // if (noSearchItem) {
                  //   if (window.location.hash === '#/list') {
                  //     window.location.href = '/#'
                  //   }
                  // }
                })
              }
            }
            inp.value = ''
          })
          a.appendChild(b)
        }
      }
    } 
  }

  // storeList: async (list) => {
  //   console.log(list.length)
  //   for (let i = 0; i < list.length; i++) {
  //     arr.push(list.intervenants[i].name + ' (Architect)')
  //     console.log(list.intervenants[i].name)
  //   }
  //   console.log(arr)
  // }
}

export default SearchBar
