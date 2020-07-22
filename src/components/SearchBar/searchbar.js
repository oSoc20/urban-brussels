import Api from '../api.js'
import searchIcon from '../../assets/icons/search-icon.png'
import diceIcon from '../../assets/icons/d.png'

/* Variable declarations */
let search_text = ["Search", "Chercher", "Zoeken"];
let tags_set = new Set();
var arr = [];
let resp;


const SearchBar = {
    displaySearchBar: (container_idname) => {
        document.getElementById(container_idname).innerHTML = /*html*/`
        <div class="search_ctn">
            <form class="searchbar_ctn" autocomplete="off">
                <input id="search_bar" type="text" placeholder="`+ search_text[0] + `">
                <button id="search_btn"><img src="`+searchIcon+`"/></button>
                <button id="searchrandom_btn"><img id="dices_btn" src="`+diceIcon+`"/></button>
            </form>
        </div>
        `;
    },

    searchFunction: () => {
        let search_div = document.getElementsByClassName('search_ctn');
        let search = document.getElementById('search_btn');

        let inp = document.getElementById('search_bar');
        var currentFocus;
        /*execute a function when someone writes in the text field:*/
        inp.addEventListener("input", async function (e) {
            var a, b, i, val = this.value;

            if (val.length === 2){
                resp = await Api.getAutocomplete('fr', val);
                for (let i = 0; i < resp.intervenants.length; i++) {
                    arr.push(resp.intervenants[i].name + ' (Architect)')
                }
                for (let i = 0; i < resp.streets.length; i++) {
                    arr.push(resp.streets[i].name + ' (Street)')
                }
            }

            /*close any already open lists of autocompleted values*/
            SearchBar.closeAllLists(inp);
            if (!val) { return false; }
            currentFocus = -1;
            /*create a DIV element that will contain the items (values):*/
            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            /*append the DIV element as a child of the autocomplete container:*/
            this.parentNode.appendChild(a);
            /*for each item in the array...*/
            for (i = 0; i < arr.length; i++) {
                /*check if the item starts with the same letters as the text field value:*/
                if (arr[i].toUpperCase().includes(val.toUpperCase())) {
                    /*create a DIV element for each matching element:*/
                    b = document.createElement("DIV");
                    /*make the matching letters bold:*/
                    let j = arr[i].indexOf(val)
                    //b.innerHTML = "<strong>" + arr[i].substr(j, val.length) + "</strong>";
                    b.innerHTML += arr[i]
                    /*insert a input field that will hold the current array item's value:*/
                    b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                    /*execute a function when someone clicks on the item value (DIV element):*/
                    b.addEventListener("click", function (e) {
                        /*insert the value for the autocomplete text field:*/
                        //inp.value = this.getElementsByTagName("input")[0].value;
                        let value = this.getElementsByTagName("input")[0].value;
                        /*close the list of autocompleted values,
                        (or any other open lists of autocompleted values:*/
                        SearchBar.closeAllLists(inp);

                        //Add tag
                        if (!tags_set.has(value)){
                            let tag = document.createElement('button')
                            tag.className = "tags"
                            tag.innerHTML = /*html*/`
                            <span class="close_tags_button">x</span>
                            ` + value;
                            search_div[0].appendChild(tag);
                            //tags_set.add(value.substr(0, value.indexOf('(')-1));
                            tags_set.add(value)
                            //Close tags
                            let tags = document.getElementsByClassName('tags');
                            for (let i = 0; i < tags.length; i++) {
                                tags[i].addEventListener("click", () => {
                                    tags[i].style.display = "none";
                                    tags_set.delete(value)
                                })
                            }
                        }
                        inp.value = ""
                    });
                    a.appendChild(b);
                }
            }
        });
        /*execute a function presses a key on the keyboard:*/
        inp.addEventListener("keydown", function (e) {
            var x = document.getElementById(this.id + "autocomplete-list");
            if (x) x = x.getElementsByTagName("div");
            if (e.keyCode == 40) {
                /*If the arrow DOWN key is pressed,
                increase the currentFocus variable:*/
                currentFocus++;
                /*and and make the current item more visible:*/
                SearchBar.addActive(x, currentFocus);
            } else if (e.keyCode == 38) { //up
                /*If the arrow UP key is pressed,
                decrease the currentFocus variable:*/
                currentFocus--;
                /*and and make the current item more visible:*/
                SearchBar.addActive(x);
            } else if (e.keyCode == 13) {
                /*If the ENTER key is pressed, prevent the form from being submitted,*/
                e.preventDefault();
                if (currentFocus > -1) {
                    /*and simulate a click on the "active" item:*/
                    if (x) x[currentFocus].click();
                }
            }
        });

        search.addEventListener("click", async () => {
            let a = Array.from(tags_set);
            for (let i = 0; i < a.length; i++) {
                
            }
            /*let send = {
                "lang" : "fr",
                ""
            }*/
            //response = await Api.searchData(lang, filter, search.value, limit, offset)
            //window.location.href = "/#/list";
            //return response;
        })
    },

    addActive: (x, currentFocus) => {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        SearchBar.removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    },

    removeActive: (x) => {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    },

    closeAllLists: (elmnt, inp) => {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
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

export default SearchBar;