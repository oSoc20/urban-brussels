import mapboxgl from "mapbox-gl"
import Api from '../api.js'

const Dashboard = {
  render: async () => {
    const view = /* html */`
<div class="grid-container">
<main class="main">
    <div class="main-overview">
        <div class="item">
            <div class="ct-chart1" id="chart1">Buildings per architect</div>
        </div>
        <div class="item">
            <div class="ct-chart2" id="chart2">Buildings per style
            </div>
        </div>
        <div class="item">
            <div id="chart3">Buildings per typography</div>
        </div>
        <div class="item" id="map_dashboard">
        </div>
    </div>
</main>
<footer class="footer"></footer>
</div>
          `
    return view
  },
  after_render: async () => {
    mapboxgl.accessToken = 'pk.eyJ1IjoieWFubmFhIiwiYSI6ImNrY2JwdGl1bTI3Ym0yem8wdmMyd3NhNHEifQ.b2WEZ63ZaouutZ65wXpfxg';

    var map = new mapboxgl.Map({
      container: document.getElementById("map_dashboard"),
      style: 'mapbox://styles/yannaa/ckcui6mpa0gqh1io64uoyg6nf', // stylesheet location
      center: [4.3517, 50.8503],
      zoom: 12.71, // starting zoom
    });
    map.on('load', function () {
      // Add a new source from our GeoJSON data and
      // set the 'cluster' option to true. GL-JS will
      // add the point_count property to your source data.
      map.addSource('buildings', {
        type: 'geojson',
        // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
        // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
        data: "https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson",
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
      });

      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "buildings",
        filter: ["has", "point_count"],
        paint: {
          //   * Blue, 20px circles when point count is less than 100
          //   * Yellow, 30px circles when point count is between 100 and 750
          //   * Pink, 40px circles when point count is greater than or equal to 750
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#CC8F9A',
            100,
            '#91475D',
            750,
            '#91475D'
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
        source: 'buildings',
        filter: ['has', 'point_count'],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
      });

      map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "buildings",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#11b4da",
          "circle-radius": 4,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff",
        },
      });

      // inspect a cluster on click
      map.on("click", "clusters", function (e) {
        var features = map.queryRenderedFeatures(e.point, {
          layers: ["clusters"],
        });
        var clusterId = features[0].properties.cluster_id;
        map.getSource('buildings').getClusterExpansionZoom(
          clusterId,
          function (err, zoom) {
            if (err) return;

            map.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom
            });
          }
        );
      });
      //CHANGE PROPERTY.
      map.on('click', 'unclustered-point', function (e) {
        var coordinates = e.features[0].geometry.coordinates.slice();
        var mag = e.features[0].properties.mag;
        var houses;

        if (e.features[0].properties.houses === 1) {
          houses = "yes";
        } else {
          houses = "no";
        }
        //CHANGE coordinates
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
          .setLngLat(coordinates) //COORDINATES TO DO
          .setHTML("magnitude: " + mag + "<br>Was there a tsunami?: " + houses)
          .addTo(map);
      });

      map.on("mouseenter", "clusters", function () {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "clusters", function () {
        map.getCanvas().style.cursor = "";
      });
    });
    map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

    console.log(map);

    //Get api data
    let data = await Api.getStats();

    //BUILDINGS PER STYLE
    new Chartist.Bar('.ct-chart2', {
      labels: Object.keys(data["stylesPerCity"][0]["styles"]),
      series: [
        Object.values(data["stylesPerCity"][0]["styles"])
      ]
    }, {
      reverseData: true,
      horizontalBars: true,
      axisY: {
        offset: 200,
        showLabel: true,
      },
      chartPadding: {
        top: 15,
        right: 15,
        bottom: 5,
        left: 10
      },
    }
      , ['screen and (max-width: 480px)', {
        reverseData: true,
        horizontalBars: true
      }]
    );

    //buildings per architect
    let architectArray = [];
    let valueArray = [];

    //let arr = Object.entries(data.BuildingsPerIntervenant);

    for (let index = 0; index < 10; index++) {
      architectArray[index] = Object.keys(data.BuildingsPerIntervenant)[index];
      valueArray[index] = Object.values(data.BuildingsPerIntervenant)[index];
    }

    let bar = new Chartist.Bar('.ct-chart1', {
      labels: architectArray,
      series: [
        valueArray
      ]
    }, {
      reverseData: true,
      horizontalBars: true,
      axisY: {
        offset: 200,
        showLabel: true,
      }
    });

  }


}

export default Dashboard
