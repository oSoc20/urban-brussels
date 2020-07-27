/**
 * Modules imports
 */
import Api from "../api.js";
import searchIcon from "../../assets/icons/search-icon.svg";

import styleIcon from "../../assets/icons/style-icon.svg";
import typeIcon from "../../assets/icons/type-icon.svg";
import architectIcon from "../../assets/icons/architect-icon.svg";

/**
 * Variables declarations
 */
const search_text = ["Search", "Chercher", "Zoeken"];
let tags_set = {
  "zip code": [],
  city: [],
  type: [],
  style: [],
  architect: [],
  street: [],
};
let obj = {};
let resp;
let val;
let search_div;
let inp;
let noSearchItem = true;

// Rendering of the search bar
const SearchBar = {
  displaySearchBar: (container_idname) => {
    document.getElementById(container_idname).innerHTML = /* html */ `
        <div class="search_ctn">
            <form class="searchbar_ctn" autocomplete="off">
                <input id="search_bar" type="text" placeholder="${search_text[0]}" />
            </form>
            <div class="selected-items">
            </div>
        </div>
        `;
  },

  searchFunction: () => {
    let searchData = window.localStorage.getItem("search_data");
    if (typeof searchData !== "undefined" || searchData !== null) {
      searchData = JSON.parse(searchData);
      console.log(searchData);

      tags_set = {
        "zip code": searchData.zipcode,
        city: searchData.cities,
        type: searchData.typologies,
        style: searchData.styles,
        architect: searchData.intervenants,
        street: searchData.streets,
      };
      console.log(tags_set);

      SearchBar.addTag(tags_set["zip code"], "Zip code");
      SearchBar.addTag(tags_set.city, "City");
      SearchBar.addTag(tags_set.street, "Street");
      SearchBar.addTag(
        tags_set.architect,
        "Architect",
        "search--architect",
        "tag--architect"
      );
      SearchBar.addTag(tags_set.style, "Style", "search--style", "tag--style");
      SearchBar.addTag(tags_set.type, "Type", "search--type", "tag--type");
    }

    search_div = document.getElementsByClassName("selected-items");
    console.log(search_div);
    inp = document.getElementById("search_bar");

    const search = document.getElementById("search_btn");
    let currentFocus;

    // Execute when an input is typed in the search field
    inp.addEventListener("input", async function (e) {
      var a;
      val = this.value;

      if (val.length === 2) {
        obj = {
          zipCodes: [],
          cities: [],
          streets: [],
          typos: [],
          styles: [],
          intervenants: [],
        };
        resp = await Api.getAutocomplete("fr", val);
        SearchBar.addItemsToObj(resp.zipCodes, obj.zipCodes);
        SearchBar.addItemsToObj(resp.cities, obj.cities);
        SearchBar.addItemsToObj(resp.streets, obj.streets);
        SearchBar.addItemsToObj(resp.typos, obj.typos);
        SearchBar.addItemsToObj(resp.styles, obj.styles);
        SearchBar.addItemsToObj(resp.intervenants, obj.intervenants);
      }

      // Close any already open lists of autocompleted values
      SearchBar.closeAllLists(inp);
      if (!val) {
        return false;
      }
      currentFocus = -1;

      // Create a div element that will contain the items (values)
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");

      // Append the div element as a child of the autocomplete container
      this.parentNode.appendChild(a);

      // For each item in the array:
      SearchBar.addItemsToList(a, obj.zipCodes, "Zip code");
      SearchBar.addItemsToList(a, obj.cities, "City");
      SearchBar.addItemsToList(a, obj.streets, "Street");
      SearchBar.addItemsToList(
        a,
        obj.intervenants,
        "Architect",
        architectIcon,
        "search--architect",
        "tag--architect"
      );
      SearchBar.addItemsToList(
        a,
        obj.styles,
        "Style",
        styleIcon,
        "search--style",
        "tag--style"
      );
      SearchBar.addItemsToList(
        a,
        obj.typos,
        "Type",
        typeIcon,
        "search--type",
        "tag--type"
      );
    });

    // When search button is clicked
    // search.addEventListener('click', async (e) => {
    //   e.preventDefault()

    //   // JSON body that will be sent
    //   const send = {
    //     lang: 'fr',
    //     strict: false,
    //     zipcode: '',
    //     cities: tags_set.city,
    //     typologies: tags_set.type,
    //     styles: tags_set.style,
    //     intervenants: tags_set.architect,
    //     streets: tags_set.street
    //   }

    //   // TOT DELETE WHEN MULTIPLE VALUES ARE POSSIBLE
    //   if (tags_set['zip code'].length !== 0) {
    //     send.zipcode = tags_set['zip code'][0]
    //   }

    //   const data = await Api.searchData(send)

    //   window.localStorage.removeItem('building_data')
    //   window.localStorage.removeItem('search_data')
    //   window.localStorage.setItem('search_data', JSON.stringify(send))
    //   window.localStorage.setItem('building_data', JSON.stringify(data))
    //   if (window.location.hash !== '#/list') {
    //     window.location.href = '/#/list'
    //   }
    // })
  },

  // Classify an item as "active"
  // addActive: (x, currentFocus) => {
  //   if (!x) return false
  //   SearchBar.removeActive(x)
  //   if (currentFocus >= x.length) currentFocus = 0
  //   if (currentFocus < 0) currentFocus = (x.length - 1)
  //   x[currentFocus].classList.add('autocomplete-active')
  // },

  // Remove "active" class from all autocomplete items
  // removeActive: (x) => {
  //   for (var i = 0; i < x.length; i++) {
  //     x[i].classList.remove('autocomplete-active')
  //   }
  // },

  // Close all autocomplete list in the document except the ones in argument
  closeAllLists: (elmnt, inp) => {
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt !== x[i] && elmnt !== inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  },

  // Add items to the object
  addItemsToObj: (arr, objArr) => {
    if (arr.length !== 0) {
      for (let i = 0; i < arr.length; i++) {
        objArr.push(arr[i].name);
      }
    }
  },

  // Add items to the autocomplete list
  addItemsToList: (a, arr, name, icon = "", Nameclass = "", tagClass = "") => {
    if (arr) {
      for (let i = 0; i < arr.length; i++) {
        // Check if searched string is included in the item
        if (arr[i].toUpperCase().includes(val.toUpperCase())) {
          const b = document.createElement("DIV");
          let className = "";

          if (Nameclass !== "") {
            const img = document.createElement("IMG");
            img.className = "search-icon";
            className = Nameclass;
            img.setAttribute("src", icon);
            img.setAttribute("alt", "icon");
            b.appendChild(img);
          }

          b.className = className;
          // b.innerHTML = "<strong>" + arr[i].substr(j, val.length) + "</strong>";
          b.innerHTML += name + ": " + arr[i];
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";

          // Execute  when someone clicks on an item of the autocomplete list
          b.addEventListener("click", function (e) {
            // inp.value = this.getElementsByTagName("input")[0].value;
            const value = this.getElementsByTagName("input")[0].value;

            SearchBar.closeAllLists(inp);

            // Add tag
            if (!tags_set[name.toLowerCase()].includes(value)) {
              const tag = document.createElement("button");
              let className = "";

              if (Nameclass !== "") {
                className = tagClass;
              }

              tag.className = `tag tag--small tag--selected ${className}`;
              tag.innerHTML =
                /* html */ `
              <span class="close_tags_button">
                <svg width="10" height="10" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path class="${className}" d="M1 1L10 10"  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path class="${className}" d="M10 1L1 10"  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
              ` +
                name +
                ": " +
                value;
              search_div[0].appendChild(tag);
              // tags_set.add(value.substr(0, value.indexOf('(')-1));
              tags_set[name.toLowerCase()].push(value);

              // Close tags
              const tags = document.getElementsByClassName("tag");
              for (let i = 0; i < tags.length; i++) {
                tags[i].addEventListener("click", () => {
                  // noSearchItem = true
                  tags[i].style.display = "none";
                  const index = tags_set[name.toLowerCase()].indexOf(value);
                  if (index > -1) {
                    tags_set[name.toLowerCase()].splice(index, 1);
                  }
                });
              }
            }
            inp.value = "";
          });
          a.appendChild(b);
        }
      }
    }
  },

  addTag: (value, name, Nameclass = "", tagClass = "") => {
    search_div = document.getElementsByClassName("selected-items");
    console.log(value);

    if (value.length !== 0) {
      // Add tag
      const tag = document.createElement("button");
      let className = "";

      if (Nameclass !== "") {
        className = tagClass;
      }

      tag.className = `tag tag--small tag--selected ${className}`;
      tag.innerHTML =
        /* html */ `
      <span class="close_tags_button">
        <svg width="10" height="10" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path class="${className}" d="M1 1L10 10"  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path class="${className}" d="M10 1L1 10"  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
      ` +
        name +
        ": " +
        value[0];
      search_div[0].appendChild(tag);

      // Close tags
      const tags = document.getElementsByClassName("tag");
      for (let i = 0; i < tags.length; i++) {
        tags[i].addEventListener("click", () => {
          // noSearchItem = true
          tags[i].style.display = "none";
          const index = tags_set[name.toLowerCase()].indexOf(value);
          if (index > -1) {
            tags_set[name.toLowerCase()].splice(index, 1);
          }
        });
      }
    }
  },
};

export default SearchBar;
