import SearchBar from './SearchBar/searchbar.js'
import mapboxgl from 'mapbox-gl'

let style = process.env.MAPBOX_STYLE;
let token = process.env.MAPBOX_ACCESS_TOKEN;

const Landing = {
  render: async () => {
    const view = /* html */`
      <div id="map"></div>
      
      <div id="search_container"></div>
      <div class="fun-fact-box">
          <div id="landing_search"></div>
          <div class="inside-box">
            <div class="inside-text" id="text_1">
                  <h4 id="funFact1"> Did you know that <button type="button" id="buttonArchitect"> Victor Horta </button> built more than 100 buildings of <button type="button"id="buttonType"> Residential </button> and <button type="button" id="buttonStyle"> Art Nouveau </button>.</h4>
              </div>
            </div>
            <br>
              <div class="inside-box">
                <div class="inside-text" id="text_2">
                  <h4>Did you know about <button type="button"id="buttonArchitect"> Architect </button> built 20 buildings of <button type="button" id="buttonType"> Type </button> and <button type="button" id="buttonStyle"> Style </button></h4>
                </div>
              </div>
              <div class="arrows_ff">
                <i id="left_arr" class="fa fa-caret-left" style="font-size:24px;color:#81d8bf"></i>
                <i id="right_arr" class="fa fa-caret-right" style="font-size:24px;color:#81d8bf"></i>
              </div>
        </div>
       `
    return view
  },
  after_render: async () => {
    // Search bar code
    SearchBar.displaySearchBar('search_container')
    SearchBar.searchFunction()

    // Language switch
    const lang = document.getElementsByClassName('lang_select')
    for (let index = 0; index < lang.length; index++) {
      lang[index].addEventListener('click', () => {
        document.getElementById('dropbtn').innerHTML = lang[index].innerHTML
      })
    }

    mapboxgl.accessToken = token;

    var map = new mapboxgl.Map({
      container: document.getElementById('map'),
      style, // stylesheet location
      // style: 'mapbox://styles/mapbox/streets-v11',
      center: [4.38128798, 50.84723317],
      zoom: 15 // starting zoom
    })

    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right')

    console.log(map)
    map.on('load', function () {
      map.addSource('trees', {
        type: 'geojson',
        data: 'https://gis.urban.brussels/geoserver/ows?service=wfs&version=2.0.0&request=GetFeature&TypeName=BSO_DML_BESC:Inventaris_Irismonument&outputformat=application/json&cql_filter=ID_BATI_CMS=18426&srsname=EPSG:4326'
      })

      map.addLayer({
        id: 'trees-point',
        type: 'circle',
        source: 'trees',
        minzoom: 1,
        paint: {
          // increase the radius of the circle as the zoom level and dbh value increases
          'circle-radius': {
            property: 'dbh',
            type: 'exponential',
            stops: [
              [{ zoom: 15, value: 1 }, 5],
              [{ zoom: 15, value: 62 }, 10],
              [{ zoom: 22, value: 1 }, 20],
              [{ zoom: 22, value: 62 }, 50]
            ]
          },
          'circle-stroke-color': 'black'
        }
      }, 'waterway-label')
    })

    map.on('sourcedata', (event) => {
      if (event.isSourceLoaded === true) {
        map.querySourceFeatures('trees').forEach((feature) => {
          var popup = new mapboxgl.Popup({ closeOnClick: false })
            .setLngLat(feature.geometry.coordinates)
            .setHTML(`<img src="${feature.properties.FIRSTIMAGE}">` + `<h1>${feature.properties.CITIES_NL}</h1>` + '<p>BE Central <br> Kantersteen 10/12, <br> 1000 Brussels </p>')
            .addTo(map)
        })
      }
    })

    // Slideshow for Fun facts
    $(document).ready(function () {
      $('#previous').on('click', function () {
        // Change to the previous image
        $('#text_' + currentText).stop().fadeOut(1)
        decreaseText()
        $('#text_' + currentText).stop().fadeIn(1)
      })
      $('#next').on('click', function () {
        // Change to the next image
        $('#text_' + currentText).stop().fadeOut(1)
        increaseText()
        $('div .inside-box:not(:nth-of-type(2))').show()
        $('#text_' + currentText).stop().fadeIn(1)

        console.log(currentText)
      })

      var currentText = 1
      var totalTexts = 3

      function increaseText () {
        /* Increase currentImage by 1.
        * Resets to 1 if larger than totalImages
        */
        ++currentText
        if (currentText > totalTexts) {
          currentText = 1
        }
      }
      function decreaseText () {
        /* Decrease currentImage by 1.
        * Resets to totalImages if smaller than 1
        */
        --currentText
        if (currentText < 1) {
          currentText = totalTexts
        }
      }
    })
  }
}

export default Landing
