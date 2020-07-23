import Api from '../api.js'
import searchIcon from '../../assets/icons/search-icon.svg'
import randomIcon from '../../assets/icons/random-icon.svg'

import styleIcon from '../../assets/icons/style-icon.svg'
import typeIcon from '../../assets/icons/type-icon.svg'
import architectIcon from '../../assets/icons/architect-icon.svg'
import closeIcon from '../../assets/icons/close-icon.svg'

/* Variable declarations */
let search_text = ["Search", "Chercher", "Zoeken"]
let tags_set = new Set()
var arr = []
let resp

const SearchBar = {
  displaySearchBar: (container_idname) => {
    document.getElementById(container_idname).innerHTML = /* html */`
        <div class="search_ctn">
            <form class="searchbar_ctn" autocomplete="off">
                <input id="search_bar" type="text" placeholder="${search_text[0]}" />
                <div class="search_buttons">
                    <button class="btn btn--search" id="search_btn"><img src="${searchIcon}"/></button>
                    <button class="btn btn--random" id="searchrandom_btn"><img id="dices_btn" src="${randomIcon}"/></button>
                </div>
            </form>
            <div class="selected-items">
            </div>
        </div>
        `
  },

  searchFunction: () => {
    let search_div = document.getElementsByClassName('selected-items')
    const search = document.getElementById('search_btn')

    const inp = document.getElementById('search_bar')
    var currentFocus
    /* execute a function when someone writes in the text field: */
    inp.addEventListener('input', async function (e) {
      var a, b, i, val = this.value;

      if (val.length === 2) {
        arr = []
        resp = await Api.getAutocomplete('fr', val)
        for (let i = 0; i < resp.intervenants.length; i++) {
          arr.push('Architect: ' + resp.intervenants[i].name)
        }
        for (let i = 0; i < resp.streets.length; i++) {
          arr.push('Street: ' + resp.streets[i].name)
        }
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
      for (i = 0; i < arr.length; i++) {
      /* check if the item starts with the same letters as the text field value: */
        if (arr[i].toUpperCase().includes(val.toUpperCase())) {
        /* create a DIV element for each matching element */
          b = document.createElement('DIV')
          let className = ''
          if (arr[i].toLowerCase().includes('architect')) {
            const img = document.createElement('IMG')
            img.className = 'search-icon'
            className = 'search--architect'
            img.setAttribute('src', architectIcon)
            img.setAttribute('alt', 'Architect icon')
            b.appendChild(img)
          }


          b.className = className
          /* make the matching letters bold: */
          let j = arr[i].indexOf(val)
          // b.innerHTML = "<strong>" + arr[i].substr(j, val.length) + "</strong>";
          b.innerHTML += arr[i]
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
            if (!tags_set.has(value)) {
              const tag = document.createElement('button')
              let className = ''
              if (value.toLowerCase().includes('architect')) {
                className = 'tag--architect'
              }
              tag.className = `tag tag--small tag--selected ${className}`
              tag.innerHTML = /* html */`
              <span class="close_tags_button">
                <svg width="10" height="10" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path class="${className}" d="M1 1L10 10"  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path class="${className}" d="M10 1L1 10"  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
              ` + value
              search_div[0].appendChild(tag)
              // tags_set.add(value.substr(0, value.indexOf('(')-1));
              tags_set.add(value)
              // Close tags
              const tags = document.getElementsByClassName('tag')
              for (let i = 0; i < tags.length; i++) {
                tags[i].addEventListener('click', () => {
                  tags[i].style.display = 'none'
                  tags_set.delete(value)
                })
              }
            }
            inp.value = ''
          })
          a.appendChild(b)
        }
      }
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

    search.addEventListener('click', async () => {
      console.log('click')
      const a = Array.from(tags_set)
      for (let i = 0; i < a.length; i++) {}
      /* let send = {
          "lang" : "fr",
          ""
      } */
      // response = await Api.searchData(lang, filter, search.value, limit, offset)
      // window.location.href = "/#/list";
      // return response;
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

  storeList: async (list) => {
    console.log(list.length)
    for (let i = 0; i < list.length; i++) {
      arr.push(list.intervenants[i].name + ' (Architect)')
      console.log(list.intervenants[i].name)
    }
    console.log(arr)
  }
}

export default SearchBar
