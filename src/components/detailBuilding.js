import mapboxgl from 'mapbox-gl'
import styleIcon from '../assets/icons/style-icon.svg'
import typeIcon from '../assets/icons/type-icon.svg'
import architectIcon from '../assets/icons/architect-icon.svg'
import watchIcon from '../assets/icons/eye-icon.svg'

const DetailBuilding = {
  render: async () => {
    const view = /* html */`
    <div id="mapContainer" class="map-building-detail"></div>

    <section class= "detail-popup  is-visible">
    <div class="detail-popup__container">

      <div class="detail-popup__overflow">
 
      <div class="detail-popup__row">
        <div class="detail-popup__img-container">
          <img class="detail-popup__img" src=https://monument.heritage.brussels/medias/500/buildings/10900023/10900023_0007_P01.jpg alt="" />
          <img class="watch__icon" src="${watchIcon}" alt="icon watch image">
        </div>

        

        <div class="detail-popup__address">
            <h1 class="detail-popup__name">The name of the building</h1>

            <h2 class="detail-popup__address__street"> Capartlaan 7 </h2>
            <h2 class="detail-popup__address__municipality">1090 Jette</h2>

        </div>
      </div>


        <div class="detail-popup-info" >
          <div class="detail-popup__tags-group">
            <div class="tag__category">
              <img class="tag__icon" src="${styleIcon}" alt="icon style tags">
              <h3 class="tag__group-name">Styles</h3>
              <div class="line line--style"></div>
            </div>
              <div class="detail-popup__tags">
                  <div class="tag tag--style">Eclectisme</div>
                  <div  class="tag tag--style">Eclectisme</div>
                  <div  class="tag tag--style">Eclectisme</div>
              </div>
          </div>
          <div class="detail-popup__tags-group">
            <div class="tag__category">
              <img class="tag__icon" src="${typeIcon}" alt="icon type tags">
              <h3 class="tag__group-name">Types</h3>
              <div class="line line--type"></div>
            </div>
              <div class="detail-popup__tags">
                  <div  class="tag tag--type">Former farm</div>
              </div>
          </div>
          <div class="detail-popup__tags-group">
            <div class="tag__category">
              <img class="tag__icon" src="${architectIcon}" alt="icon architect tags">
              <h3 class="tag__group-name">Architects</h3>
              <div class="line line--architect"></div>
            </div> 
              <div class="detail-popup__tags">
                  <div class="tag-group-architect">
                      <div class="tag tag--architect">R. Lambert</div>
                      <div class="tag tag--architect">1916</div>
                  </div>
              </div>
          </div>
        </div>

        <a href="" class="button button--dark" >Get to know more</a>
      </div>
   
    </div>
  </section>
  
  <div class="img-modal">
    <span class="btn-close">&times;</span>
    <div class="img-modal__content">
      <img class="img-model__img" src="https://monument.heritage.brussels/medias/500/buildings/10900023/10900023_0007_P01.jpg">
  </div>    

          `
    return view
  },
  after_render: async () => {
    const coordinates = {
      long: 4.32120602,
      lat: 50.88532209
    }

    const centerMap = coordinates.long - 0.0200

    mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN
    const map = new mapboxgl.Map({
      container: 'mapContainer',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [centerMap, coordinates.lat],
      zoom: 12.71
    })

    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right')

    const size = 200

    const pulsingDot = {
      width: size,
      height: size,
      data: new Uint8Array(size * size * 4),

      onAdd: function () {
        const canvas = document.createElement('canvas')
        canvas.width = this.width
        canvas.height = this.height
        this.context = canvas.getContext('2d')
      },

      render: function () {
        const duration = 2000
        const t = (performance.now() % duration) / duration

        const radius = (size / 2) * 0.3
        const outerRadius = (size / 2) * 0.7 * t + radius
        const context = this.context

        context.clearRect(0, 0, this.width, this.height)
        context.beginPath()
        context.arc(
          this.width / 2,
          this.height / 2,
          outerRadius,
          0,
          Math.PI * 2
        )
        context.fillStyle = 'rgba(33, 33, 68,' + (1 - t) + ')'
        context.fill()

        context.beginPath()
        context.arc(
          this.width / 2,
          this.height / 2,
          radius,
          0,
          Math.PI * 2
        )
        context.fillStyle = 'rgba(33, 33, 68, 1)'
        context.strokeStyle = 'white'
        context.lineWidth = 2 + 4 * (1 - t)
        context.fill()
        context.stroke()

        this.data = context.getImageData(
          0,
          0,
          this.width,
          this.height
        ).data

        map.triggerRepaint()
        return true
      }
    }

    map.on('load', function () {
      map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 })
      map.addSource('points', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [coordinates.long, coordinates.lat]
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
    })
    const clickHandlerWatchImg = () => {
      document.querySelector('.img-modal').style.display = 'block'
      document.querySelector('body').style.overflow = 'hidden'
    }

    const clickHandlerCloseImg = () => {
      document.querySelector('.img-modal').style.display = 'none'
      document.querySelector('body').style.overflow = 'auto'
    }

    const watchButton = document.querySelector('.watch__icon')
    const closeButton = document.querySelector('.btn-close')
    watchButton.addEventListener('click', clickHandlerWatchImg)
    closeButton.addEventListener('click', clickHandlerCloseImg)
  }
}

export default DetailBuilding
