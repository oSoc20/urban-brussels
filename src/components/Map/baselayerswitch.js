// Rendering of the search bar
import dropdownIcon from '../../assets/icons/dropdown-icon.svg'

const BaseLayerSwitch = {
  displayBaseLayerSwitch: (containerIdName) => {
    document.getElementById(containerIdName).innerHTML = /* html */`
    <div class="dropdown_layers">
      <div class="dropdown_menu">
        <button id="main-button"><img id="layers_icon" src="${dropdownIcon}"/>
        </button>
        <div class="menu_class" id="menu">
          <a><button id="grayscale">URBIS</button></a>
          <a><button id="aerial">Aerial Imagery</button></a>
          <a><button id="mapbox">OpenStreetMap</button></a>
        </div>
      </div>
    </div>
          `
  },
  showGrayScale: (map, layerId) => {
    map.addLayer({
      id: 'wms-layer-grayscale',
      type: 'raster',
      source: 'wms-source-grayscale',
      paint: {}
    }, layerId)
    if (map.getLayer('wms-layer-aerial')) {
      map.removeLayer('wms-layer-aerial')
    }
  },
  showAerial: (map, layerId) => {
    map.addLayer({
      id: 'wms-layer-aerial',
      type: 'raster',
      source: 'wms-source-aerial',
      paint: {}
    }, layerId)
    if (map.getLayer('wms-layer-grayscale')) {
      map.removeLayer('wms-layer-grayscale')
    }
  },
  showMapbox: (map) => {
    if (map.getLayer('wms-layer-grayscale')) {
      map.removeLayer('wms-layer-grayscale')
    }
    if (map.getLayer('wms-layer-aerial')) {
      map.removeLayer('wms-layer-aerial')
    }
  },
  addEventListener: (map, layerId) => {
    document.getElementById('grayscale').addEventListener('click', () => {
      BaseLayerSwitch.showGrayScale(map, layerId)
    })
    document.getElementById('aerial').addEventListener('click', () => {
      BaseLayerSwitch.showAerial(map, layerId)
    })
    document.getElementById('mapbox').addEventListener('click', () => {
      BaseLayerSwitch.showMapbox(map)
    })
  },
  initSources: (map, language) => {
    // Dutch grayscale layer//
    map.addSource('wms-source-grayscale', {
      type: 'raster',
      tiles: [
            `https://geoservices-urbis.irisnet.be/geoserver/ows/?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=false&width=256&height=256&layers=urbis${language.toUpperCase()}Gray`
      ],
      tileSize: 256
    })
    // Aerial Imagery layer //
    map.addSource('wms-source-aerial', {
      type: 'raster',
      tiles: [
        'https://geoservices-urbis.irisnet.be/geoserver/ows/?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=false&width=256&height=256&layers=Urbis:Ortho2019'
      ],
      tileSize: 256
    })
  }
}
export default BaseLayerSwitch
