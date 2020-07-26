
const map = {
  init: (map, item) => {
    const coordinatesItem = {
      long: item[0].geometry.coordinates[0],
      lat: item[0].geometry.coordinates[1]
    }

    map.addSource('points', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [coordinatesItem.long, coordinatesItem.lat]
            }
          }
        ]
      }
    })
    map.addLayer({
      id: 'points',
      type: 'symbol',
      source: 'points',
      layout: {
        'icon-image': 'pulsing-dot'
      }
    })

    map.easeTo({
      center: [coordinatesItem.long, coordinatesItem.lat],
      zoom: 13
    })
  }
}

export default map
