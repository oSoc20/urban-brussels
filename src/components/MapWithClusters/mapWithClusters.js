/**
 * This module displays a map that contains cluster points of locations
 */

import mapboxgl from 'mapbox-gl'
import BaseLayerSwitch from '../Map/baselayerswitch.js'

let map
const MapWithClusters = {
<<<<<<< HEAD
  /** Initializing data */
=======
  /**
   * Initiates and displays the map
   */
>>>>>>> c577d768dbf9cc4538265fea8794383999ee80e9
  init: (data) => {
    // Positioning the map and navigation control
    mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN
    map = new mapboxgl.Map({
      container: 'clusterMap',
      style: process.env.MAPBOX_STYLE,
      center: [4.4006, 50.8452],
      zoom: 10.24
    })

    // Add controls to the bottom right to the map
    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right')
    if (!data) {
      data = {
        type: 'FeatureCollection',
        features: []
      }
    }
<<<<<<< HEAD
    /** Loading the map and three layers */
=======

    // Load the sources, markers and layers on the map
>>>>>>> c577d768dbf9cc4538265fea8794383999ee80e9
    map.on('load', () => {
      if (window.location.hash === '#/list') {
        BaseLayerSwitch.displayBaseLayerSwitch('baselayer_container', true)
      } else {
        BaseLayerSwitch.displayBaseLayerSwitch('baselayer_container', false)
      }
      BaseLayerSwitch.addEventListener(map, 'clusters')
      BaseLayerSwitch.initSources(map, 'FR')

      map.addSource('buildings', {
        /** Adding building layer from GeoJSON data */
        type: 'geojson',
        data: data,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50
      })

      map.addSource('unclustered-locations', {
        type: 'geojson',
        data: data,
        cluster: false,
        clusterMaxZoom: 14,
        clusterRadius: 50
      })

      map.addLayer({
        // Changing clusters style and count on zoom
        id: 'clusters',
        type: 'circle',
        source: 'buildings',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#5C9983',
            100,
            '#24674F',
            750,
            '#003221'
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
          'circle-color': '#24674F',
          'circle-radius': 11,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#fff'
        }
      })

      map.addLayer({
        id: 'hidden-locations',
        type: 'circle',
        source: 'unclustered-locations',
        paint: {
          'circle-radius': 0
        }
      })

      map.on('mouseenter', 'clusters', () => {
        map.getCanvas().style.cursor = 'pointer'
      })
      map.on('mouseleave', 'clusters', () => {
        map.getCanvas().style.cursor = ''
      })

      map.on('click', 'clusters', (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ['clusters']
        })
        const clusterId = features[0].properties.cluster_id
        map.getSource('buildings').getClusterExpansionZoom(
          clusterId,
          (err, zoom) => {
            if (err) return

            map.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom
            })
          }
        )
      })
    })
    return map
  }
}

export default MapWithClusters
