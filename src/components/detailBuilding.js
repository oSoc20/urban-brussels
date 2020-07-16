import mapboxgl from 'mapbox-gl'
import styleIcon from '../assets/icons/style-icon.svg'
import typeIcon from '../assets/icons/type-icon.svg'
import architectIcon from '../assets/icons/architect-icon.svg'

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
{/* <img class="detail-popup__img" src="https://monument.heritage.brussels/medias/500/buildings/10900023/10900023_0007_P01.jpg" alt="" />
<h1 class="detail-popup__name">The name of the building</h1>
<h2 class="detail-popup__address">Capartlaan 7 1090 Jette</h2> */}