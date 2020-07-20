import SearchBar from './SearchBar/searchbar.js'

const Landing = {
  render: async () => {
    const view = /* html */`
       <div id="map"></div>
        <div class='fun-fact-box'>
            <div id="landing_search"></div>
            <div class="inside-box">
              <div class="inside-text">
                  <h1>Did you know?</h1>
                  <p id="funFact1">The inventory of the Brussels real estate heritage finds its origin in the list of buildings selected within the framework of the analytical pre-inventory (or emergency inventory) published in 1975 and carried out by the asbl Sint-Lukasarchief on the basis of a visual selection , according to pre-established and defined criteria, without systematic study of bibliographic and archival sources.</p>
              </div>
            </div>
            <br>
            <div class="inside-box">
              <div class="inside-text">
                  <h1>How about this?</h1>
                  <p>At present, the inventory site's database contains around 40,000 goods, more than 70,000 illustrations and more than 7,000 names associated in one way or another with the Brussels building.</p>
                </div>
            </div>
        </div>   
  
       `
    return view
  },
  after_render: async () => {
    // Search bar code
    SearchBar.displaySearchBar('landing_search')
    SearchBar.searchFunction()

    mapboxgl.accessToken = 'pk.eyJ1IjoiYW5hZHYxOCIsImEiOiJja2NibWI1dmIyNjh4MzBvMDJzazJlNzI0In0.n6nqsasihr0Cmsik6AU3zQ'

    var map = new mapboxgl.Map({
      container: document.getElementById('map'),
      style: 'mapbox://styles/anadv18/ckcofi5sh06gk1ilj0xc7e0lg', // stylesheet location
      center: [4.34552806, 50.83076536],
      zoom: 15 // starting zoom
    })
    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right')

    console.log(map)
    map.on('load', function () {
      map.addSource('trees', {
        type: 'geojson',
        data: 'https://gis.urban.brussels/geoserver/ows?service=wfs&version=2.0.0&request=GetFeature&TypeName=BSO_DML_BESC:Inventaris_Irismonument&outputformat=application/json&cql_filter=ID_BATI_CMS=7517&srsname=EPSG:4326'
      })
      map.addLayer({
        id: 'trees-heat',
        type: 'heatmap',
        source: 'trees',
        maxzoom: 15,
        paint: {
          // increase weight as diameter breast height increases
          'heatmap-weight': {
            property: 'dbh',
            type: 'exponential',
            stops: [
              [1, 0],
              [62, 1]
            ]
          },
          // increase intensity as zoom level increases
          'heatmap-intensity': {
            stops: [
              [11, 1],
              [15, 3]
            ]
          },
          // assign color values be applied to points depending on their density
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(236,222,239,0)',
            0.2, 'rgb(208,209,230)',
            0.4, 'rgb(166,189,219)',
            0.6, 'rgb(103,169,207)',
            0.8, 'rgb(28,144,153)'
          ],
          // increase radius as zoom increases
          'heatmap-radius': {
            stops: [
              [11, 15],
              [15, 20]
            ]
          },
          // decrease opacity to transition into the circle layer
          'heatmap-opacity': {
            default: 1,
            stops: [
              [14, 1],
              [15, 0]
            ]
          }
        }
      }, 'waterway-label')
      map.addLayer({
        id: 'trees-point',
        type: 'circle',
        source: 'trees',
        minzoom: 14,
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
          'circle-color': {
            property: 'dbh',
            type: 'exponential',
            stops: [
              [0, 'rgba(236,222,239,0)'],
              [10, 'rgb(236,222,239)'],
              [20, 'rgb(208,209,230)'],
              [30, 'rgb(166,189,219)'],
              [40, 'rgb(103,169,207)'],
              [50, 'rgb(28,144,153)'],
              [60, 'rgb(1,108,89)']
            ]
          },
          'circle-stroke-color': 'white',
          'circle-stroke-width': 3,
          'circle-opacity': {
            stops: [
              [14, 0],
              [15, 1]
            ]
          }
        }
      }, 'waterway-label')
    })

    map.on('click', 'trees-point', function (e) {
      console.log(e) // to load features
      console.log(e.features)
      console.log(e.features[0].properties)
      console.log(e.features[0].properties.STYLE_NL)

      new mapboxgl.Popup()
        .setLngLat(e.features[0].geometry.coordinates)
        .setHTML('<b>City:</b> ' + e.features[0].properties.CITIES_NL + "<br><img src='" + e.features[0].properties.FIRSTIMAGE + "'>")
        .addTo(map)
    })
  }

}

export default Landing
