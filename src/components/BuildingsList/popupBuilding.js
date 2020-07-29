/** The file enables the BuildingPopUp on the map of the Building List page
 * Import Modules */
import mapboxgl from 'mapbox-gl'

/** Variable declarations */
let popup

const popupBuilding = {
  /** Initializing map
   * map: Map object.
   */
  init: (map) => {
    popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      maxWidth: 'max-content'
    })
    /** When you hover on an unclustered point on the map a popup is created and visible
     */
    map.on('mouseenter', 'unclustered-point', (e) => {
      map.getCanvas().style.cursor = 'pointer'
      const coordinates = e.features[0].geometry.coordinates.slice()
      const building = e.features[0].properties
      const str = `
      <div class="pop-up">
        <img class="pop-up__img" src="${building.image}" alt="">
        <div class="pop-up__address">
          <p class="pop-up__info">${building.street} ${building.number} </p>
          <p class="pop-up__info">${building.zip_code} ${building.city}</p>
        </div>
      </div>
      `
      popup
        .setLngLat(coordinates)
        .setHTML(str)
        .addTo(map)
    })

    /** When you leave an unclustered point the popup is removed
     */
    map.on('mouseleave', 'unclustered-point', () => {
      map.getCanvas().style.cursor = ''
      popup.remove()
    })

    return popup
  },
  /** When you hover on a building in the list a popup is created and visible
   * event: Current event
   * map: Map object
   * currentPage: Number of the current page in the list
   * itemsPerPage: Number of items per page
   * data: object with building information to show in the popup
  */
  hoverHandlerPopupBuilding: (event, map, currentPage = 1, itemsPerPage, data) => {
    // popup.remove()
    const address = event.currentTarget.dataset.address
    for (let i = (currentPage - 1) * itemsPerPage; i < (currentPage * itemsPerPage) && i < data.length; i++) {
      const building = data[i].properties
      const addressData = `${building.street} ${building.number} ${building.zip_code} ${building.city}`
      if (address === addressData) {
        const str = `
        <div class="pop-up">
          <img class="pop-up__img" src="${building.image}" alt="">
          <div class="pop-up__address">
            <p class="pop-up__info">${building.street} ${building.number}</p>
            <p class="pop-up__info">${building.zip_code} ${building.city}</p>
          </div>
        </div>
        `
        popup
          .setLngLat(data[i].geometry.coordinates.slice())
          .setHTML(str)
          .addTo(map)

        map.easeTo({
          center: data[i].geometry.coordinates,
          zoom: 16
        })
      }
    }
  },

  /** Remove popup
  */
  removePopup: () => {
    if (popup) { popup.remove() }
  }
}

export default popupBuilding
