import mapboxgl from 'mapbox-gl'

const DetailBuilding = {
  render: async () => {
    const view = /* html */`
    <div id="mapContainer" class="mapContainer"></div>

          `
    return view
  },
  after_render: async () => {
    mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN
    const map = new mapboxgl.Map({
      container: 'mapContainer',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [4.3270, 50.8787],
      zoom: 12.71
    })

    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right')
  }
}

export default DetailBuilding
