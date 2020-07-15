import Api from '../api.js'
import Pagination from './pagination.js'

//Variables declaration
let pagination;
let nb_pages;
let active_page;
let data;
let current_data={
  'type': 'FeatureCollection',
  'features': []
};

const List = {
  render: async () => {

    //Checks if data has already been stored in local storage and retrieve it
    data = JSON.parse(window.localStorage.getItem('building_data'));

    //Send a request to the API is the data in local storage is empty
    if (data === null) {
      data = await Api.getData()
      window.localStorage.setItem('building_data', JSON.stringify(data))
    }

    console.log(data.numberReturned)

    //Pagination
    nb_pages = Math.floor(data.numberReturned / 10);
    pagination = Pagination.createPagination(nb_pages, 1);


    // List the 10 first building
    // TODO ADD PAGINATION
    let i = 0
    let list = ''
    while (i < 10) {
      list += /* html */`
                <li class="li_list">
                    <img class="building_img" src="${data.features[i].properties.FIRSTIMAGE}" >
                    <button class="building_style">${data.features[i].properties.STYLE_FR}</button>
                    <button class="building_type">${data.features[i].properties.TYPO_FR}</button>
                    <h3 class="building_streetname">${data.features[i].properties.STREET_FR} ${data.features[i].properties.NUMBER}, ${data.features[i].properties.CITIES_FR} ${data.features[i].properties.CITY}</h3>
                    <p class="building_municipality"></p>
                    <p class="building_desc">${data.features[i].properties.URL_FR}</p>
                </li>
            `
      let tmp = {
        'type': 'Feature',
        'properties': {
          'message': 'Foo',
          'iconSize': [50, 50],
          'img': data.features[i].properties.FIRSTIMAGE
        },
        'geometry': {
          'type': 'Point',
          'coordinates': data.features[i].geometry.coordinates
        }
      }
      current_data.features.push(tmp);
      i++
    }

    const view = /* html */`
            <div class="split" id="searchbar_ctn">
              <div class="search">
                <input type="text" class="searchTerm" placeholder="What are you looking for?">
                <button type="submit" class="searchButton">
                  <i class="fa fa-search"></i>
                </button>
              </div>
            </div>
            <div class="split" id="list_ctn">
                <ul id="ul_list">
                  <h2 id="properties_title">Urban Properties</h2>
                    ${list}
                  <div id="pagination"></div>
                </ul>
            </div>
            <div class="split" id="toggle_ctn">
              <label class="switch">
                <input type="checkbox" id="toggle_switch">
                <span class="slider round"></span>
              </label>
            </div>
            <div class="split" id="map_ctn"></div>
            </div>
        `
    return view
  },
  after_render: async () => {


    //Buildings list code
    document.getElementById('pagination').innerHTML = pagination;
    let page_buttons = document.getElementsByClassName('nb_page')
    for (let i = 0; i < page_buttons.length; i++) {
      page_buttons[i].addEventListener("click", () => {
        console.log(page_buttons[i].innerHTML)
      })
    }

    //Mapbox GL code
    mapboxgl.accessToken = 'pk.eyJ1IjoiYW5hZHYxOCIsImEiOiJja2NibWI1dmIyNjh4MzBvMDJzazJlNzI0In0.n6nqsasihr0Cmsik6AU3zQ';
    let map = new mapboxgl.Map({
      container: 'map_ctn',
      style: 'mapbox://styles/mapbox/light-v10',
      center: [4.3270, 50.8787],
      zoom: 11
    });

    //Add controls for map navigation
    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

    map.on('load', async () => { 
      // Add a new source from our GeoJSON data and
      // set the 'cluster' option to true. GL-JS will
      var dataformap = await Api.getData ();
      console.log (dataformap);
      map.addSource('earthquakes', {
          type: 'geojson', 
          // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
          // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
          data: dataformap,
          //
          cluster: true,
          clusterMaxZoom: 14, // Max zoom to cluster points on
          clusterRadius: 50 
          });
      map.addLayer({
          id: 'clusters',
          type: 'circle',
          source: 'earthquakes',
          filter: ['has', 'point_count'],
          paint: {
          // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
      
          'circle-color': [
              'step',
              ['get', 'point_count'],
              '#51bbd6',
              100,
              '#f1f075',
              750,
              '#f28cb1'
          ],
          'circle-radius': [
              'step',
              ['get', 'point_count'],
              20,
              100,
              30,
              750,
              40
          ]
          }
      });
          map.addLayer({
              id: 'cluster-count',
              type: 'symbol',
              source: 'earthquakes',
              filter: ['has', 'point_count'],
              layout: {
              'text-field': '{point_count_abbreviated}',
              'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
              'text-size': 12
              }
          });
          map.addLayer({
            id: 'unclustered-point',
            type: 'circle',
            source: 'earthquakes',
            filter: ['!', ['has', 'point_count']],
            paint: {
            'circle-color': '#11b4da',
            'circle-radius': 4,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
            }
            });
             
            // inspect a cluster on click
            map.on('click', 'clusters', function(e) {
            var features = map.queryRenderedFeatures(e.point, {
            layers: ['clusters']
            });
            var clusterId = features[0].properties.cluster_id;
            map.getSource('earthquakes').getClusterExpansionZoom(
            clusterId,
            function(err, zoom) {
            if (err) return;
             
            map.easeTo({
            center: features[0].geometry.coordinates,
            zoom: zoom
            });
            }
            );
            });
             
            // When a click event occurs on a feature in
            // the unclustered-point layer, open a popup at
            // the location of the feature, with
            // description HTML from its properties.
            map.on('click', 'unclustered-point', function(e) {
            var coordinates = e.features[0].geometry.coordinates.slice();
            var mag = e.features[0].properties.mag;
            var tsunami;
             
            if (e.features[0].properties.tsunami === 1) {
            tsunami = 'yes';
            } else {
            tsunami = 'no';
            }
             
            // Ensure that if the map is zoomed out such that
            // multiple copies of the feature are visible, the
            // popup appears over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }
             
            new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(
            'magnitude: ' + mag + '<br>Was there a tsunami?: ' + tsunami
            )
            .addTo(map);
            });
             
            map.on('mouseenter', 'clusters', function() {
            map.getCanvas().style.cursor = 'pointer';
            });
            map.on('mouseleave', 'clusters', function() {
            map.getCanvas().style.cursor = '';
            });
      })

    document.getElementById('toggle_switch').addEventListener("click", () =>{
      let btn = document.getElementById('map_ctn');
      if (btn.style.display === "none") {
        btn.style.display = "block";
      } else {
        btn.style.display = "none";
      }
    })

  }

}

export default List


