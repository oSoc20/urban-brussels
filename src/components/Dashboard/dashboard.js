/**
 * Modules import
 */
import mapboxgl from 'mapbox-gl'
import Api from '../api.js'
import Chart from './charts.js'

/**
 * Variable declarations
 */
const style = process.env.MAPBOX_STYLE
const token = process.env.MAPBOX_ACCESS_TOKEN

let map
let data
const moveMap = true
let popup
const itemsPerPage = 4
const features = []
let coordinates

const Dashboard = {
  render: async () => {
    const view = /* html */ `
<div class="grid-container">
<main class="main">
    <div class="main-overview">
        <div class="item">
          <div class="chart_title">Buildings per architect</div>
          <div class="ct-chart1" id="chart1"></div>
        </div>
        <div class="item">
          <div class="chart_title">Buildings per style</div>
          <div class="ct-chart2" id="chart2"></div>
        </div>
        <div class="item">
          <div class="chart_title">Buildings per typology</div>
          <div class="ct-chart3" id="chart3"></div>
        </div>
        <div class="item" id="map_dashboard">
        </div>
    </div>
    <div class="item">
          <div class="chart_title">Buildings over time</div>
          <div class="ct-chart4" id="chart4"></div>
        </div>
</main>
<footer class="footer"></footer>
</div>
          `
    return view
  },
  after_render: async () => {
    coordinates = {
      long: 4.34031002,
      lat: 50.88432209
    }
    let centerMap

    window.innerWidth > 880
      ? (centerMap = coordinates.long - 0.02)
      : (centerMap = coordinates.long)

    mapboxgl.accessToken = token

    var map = new mapboxgl.Map({
      container: document.getElementById('map_dashboard'),
      style, // stylesheet location
      center: [4.3517, 50.8503],
      zoom: 12.71 // starting zoom
    })
    map.on('load', function () {
      // Add a new source from our GeoJSON data and
      // set the 'cluster' option to true. GL-JS will
      // add the point_count property to your source data.
      map.addSource('buildings', {
        type: 'geojson',
        // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
        // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
        data:
          'https://gis.urban.brussels/geoserver/ows?service=wfs&version=2.0.0&request=GetFeature&TypeName=BSO_DML_BESC:Inventaris_Irismonument&outputformat=application/json&cql_filter=CITY%20=%20%271090%27&srsname=EPSG:4326',
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
      })

      // ADDING CLUSTER STARTS FROM HERE
      map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'buildings',
        filter: ['has', 'point_count'],
        paint: {
          //   * Blue, 20px circles when point count is less than 100
          //   * Yellow, 30px circles when point count is between 100 and 750
          //   * Pink, 40px circles when point count is greater than or equal to 750
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#8F9BCC',
            100,
            '#476291',
            750,
            '#212E44'
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
      })

      map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'buildings',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12
        },
        paint: {
          'text-color': '#ffffff'
        }
      })

      map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'buildings',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#212E44',
          'circle-radius': 11,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#fff'
        }
      })

      map.addSource('unclustered-locations', {
        type: 'geojson',
        data: data,
        cluster: false,
        clusterMaxZoom: 14,
        clusterRadius: 50
      })

      map.addLayer({
        id: 'hidden-locations',
        type: 'circle',
        source: 'unclustered-locations',
        paint: {
          'circle-radius': 0
        }
      })

      // inspect a cluster on click
      map.on('click', 'clusters', function (e) {
        var features = map.queryRenderedFeatures(e.point, {
          layers: ['clusters']
        })
        var clusterId = features[0].properties.cluster_id
        map
          .getSource('buildings')
          .getClusterExpansionZoom(clusterId, function (err, zoom) {
            if (err) return

            map.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom
            })
          })
      })
      // CHANGE PROPERTY.
      map.on('click', 'unclustered-point', function (e) {
        var coordinates = e.features[0].geometry.coordinates.slice()
        var mag = e.features[0].properties.mag
        var houses

        if (e.features[0].properties.houses === 1) {
          houses = 'yes'
        } else {
          houses = 'no'
        }
        // CHANGE coordinates
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
        }

        new mapboxgl.Popup()
          .setLngLat(coordinates) // COORDINATES TO DO
          .setHTML('magnitude: ' + mag + '<br>Was there a tsunami?: ' + houses)
          .addTo(map)
      })

      map.on('mouseenter', 'clusters', function () {
        map.getCanvas().style.cursor = 'pointer'
      })
      map.on('mouseleave', 'clusters', function () {
        map.getCanvas().style.cursor = ''
      })
    })
    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right')

    // Retrieve stats data
    const data = await Api.getStats()

    // Declare labels and series arrays
    const styleArray = []
    const sValArray = []
    const architectArray = []
    const aValArray = []
    const typologyArray = []
    const tValArray = []

    // Store top 10 in arrays
    for (let index = 0; index < 10; index++) {
      styleArray[index] = Object.keys(data.BuildingsPerStyle)[index]
      sValArray[index] = Object.values(data.BuildingsPerStyle)[index]
      architectArray[index] = Object.keys(data.BuildingsPerIntervenant)[index]
      aValArray[index] = Object.values(data.BuildingsPerIntervenant)[index]
      typologyArray[index] = Object.keys(data.BuildingsPerTypography)[index]
      tValArray[index] = Object.values(data.BuildingsPerTypography)[index]
    }

    // Buildings per architect
    Chart.createHBarChart('.ct-chart1', architectArray, aValArray)

    // Buildings per style
    Chart.createHBarChart('.ct-chart2', styleArray, sValArray)

    // Buildings per typology
    Chart.createHBarChart('.ct-chart3', typologyArray, tValArray)

    // Buildings over time (timeline)
    Chart.createTimeline('.ct-chart4', Object.keys(data.BuildingsPerYear), Object.values(data.BuildingsPerYear))
  }
}

export default Dashboard
