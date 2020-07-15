import mapboxgl from 'mapbox-gl'

const DetailBuilding = {
  render: async () => {
    const view = /* html */`
    <div id="mapContainer" class="map-building-detail"></div>
    <section class= "detail-popup  is-visible">
    <div class="detail-popup__container">
      <div class="detail-popup__overflow">
        <div class="detail-popup__row">
          <img class="detail-popup__img" src=https://monument.heritage.brussels/medias/500/buildings/10900023/10900023_0007_P01.jpg alt="" />
          
          <div class="detail-popup__address">
            <h1 class="detail-popup__address__street"> Capartlaan 7 </h1>
            <h1 class="detail-popup__address__municipality">1090 Jette</h1>
          </div>
        </div>
      </div>
   
    </div>
  </section>

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
