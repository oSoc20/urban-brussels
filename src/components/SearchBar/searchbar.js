import Api from '../api.js'

let button_text = "Add filters";
let filters = ["City", "Street name", "Typology", "Style", "Architect"];
let tags_set = new Set();

const SearchBar = {
    displaySearchBar: (container_idname) => {
        document.getElementById(container_idname).innerHTML = /*html*/`
        <div class="search_ctn">
            <div class="dropdown_search">
                <div class="hover_filter">
                    <button id="drop_btn">`+button_text+`</button>
                    <div class="dropdown_content">
                    <a class="dropdown_choice">`+filters[0]+`</a>
                    <a class="dropdown_choice">`+filters[1]+`</a>
                    <a class="dropdown_choice">`+filters[2]+`</a>
                    <a class="dropdown_choice">`+filters[3]+`</a>
                    <a class="dropdown_choice">`+filters[4]+`</a>
                    </div>
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
        let searchCtn = document.getElementsByClassName('dropdown_search')
        let filter, response;

        //If a filter hasn't been chosen yet, disable search text
        search.disabled = true;

        for (let i = 0; i < choice.length; i++) {
            choice[i].addEventListener("click", () => {
                filter = choice[i].innerHTML

                //Add tags
                if (!tags_set.has(filter)){
                    tags_set.add(filter)
                    let tag = document.createElement('button')
                    tag.className = "tags"
                    tag.innerHTML = /*html*/`
                    <span class="close_tags_button">x</span>
                    ` + filter
                    searchCtn[0].appendChild(tag);

                    //Close tags
                    let tags = document.getElementsByClassName('tags');
                    for (let i = 0; i < tags.length; i++) {
                        tags[i].addEventListener("click", () =>{
                            tags[i].style.display = "none";
                            tags_set.delete(tags[i].innerHTML.trim().substring(61))
                        })
                    }
                }

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
                window.location.href = "/#/list";
            }
            //return response;
        })
    }
  }
  
  export default SearchBar;