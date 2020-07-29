/** The file enables the BuildingPopUp on the map of the Building List page
 * Import Modules */
import mapboxgl from 'mapbox-gl'

/** Variable declarations */
let popup

const popupBuilding = {
  /** Initializing map
   * map: loads the map
   */
  init: (map) => {
    popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      maxWidth: 'max-content'
    })
    /** Pop-up of one building and its features on the map
     * e: calls on features from API
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

    map.on('mouseleave', 'unclustered-point', () => {
      map.getCanvas().style.cursor = ''
      popup.remove()
    })

    return popup
  },
  /** PopUp displayed when hovering over the point
   * event: when you hover over the point
   * map: loads the map
   * currentPage: number of pages displayed
   * itemsPerPage: how many buildings to display on the page
   * data: getting the data from API
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

  removePopup: () => {
    if (popup) { popup.remove() }
  }
}

export default popupBuilding
