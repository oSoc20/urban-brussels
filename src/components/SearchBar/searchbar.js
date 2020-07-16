import Api from '../api.js'

const SearchBar = {
    displaySearchBar: (container_idname) => {
        document.getElementById(container_idname).innerHTML = /*html*/`
        <div class="search_ctn">
            <div class="dropdown_search">
                <button id="drop_btn">Search filters</button>
                <div class="dropdown_content">
                <a class="dropdown_choice">City</a>
                <a class="dropdown_choice">Street name</a>
                <a class="dropdown_choice">Typology</a>
                <a class="dropdown_choice">Style</a>
                <a class="dropdown_choice">Architect</a>
                </div>
            </div>
            <form class="searchbar_ctn" action="">
                <input id="search_bar" type="text" placeholder="Please select a filter">
                <button id="submit_search" type="submit" style="display: none">
            </form>
        </div>
        `;
    },

    searchFunction:(lang, limit, offset) =>{
        let choice = document.getElementsByClassName('dropdown_choice');
        let search = document.getElementById('search_bar');
        let filter, response;

        //If a filter hasn't been chosen yet, disable search text
        search.disabled = true;

        for (let i = 0; i < choice.length; i++) {
            choice[i].addEventListener("click", () => {
                filter = choice[i].innerHTML
                console.log(filter);
                document.getElementById('drop_btn').innerHTML = filter;
                //Enable search bar
                search.disabled = false;
                search.placeholder = "Search...";
                search.style.background = "#f1f1f1"
            })
        }
        
        search.addEventListener("keyup", async (event) =>{
            if (event.keyCode === 13) {
                console.log(search.value)
                //response = await Api.searchData(lang, filter, search.value, limit, offset)
            }
            //return response;
        })
    }
  }
  
  export default SearchBar;

/* 
<form class="searchbar_ctn">
                <input id="search_bar" type="text" placeholder="Please select a filter">
                <button id="submit_search" type="submit">
            </form>
*/