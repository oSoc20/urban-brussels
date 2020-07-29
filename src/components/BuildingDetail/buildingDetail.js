/**
 * This module displays and contains the logic of the detail page of a specific building
 */

/** Modules import */
import styleIcon from '../../assets/icons/style-icon.svg'
import typeIcon from '../../assets/icons/type-icon.svg'
import architectIcon from '../../assets/icons/architect-icon.svg'
import watchIcon from '../../assets/icons/eye-icon.svg'
import buildingList from '../BuildingsList/buildingslist'
import mapDetail from './map'

/** Variable declarations */
let randomClicked

const detail = {
  /**
   * Sets the variables for showing the detail information of a building
   * Create and display the detail information of a building
   * @param {object} map - Map object, the map shown on the list page.
   * @param {object} item -  Object that contains all the informaion about the building that was clicked on
   * @param {object} popup - Popup object that is visible on the map in the list page
   * @param {boolean} randomBuildingClicked - Boolean that is true when clicked on random button on landing page
   */
  showDetail: (map, item, popup, randomBuildingClicked = false) => {
    randomClicked = randomBuildingClicked
    detail.toggleClasses()
    if (!randomClicked) {
      popup.remove()
      detail.toggleMapLayers(map, 'none')
    }

    mapDetail.init(map, item)
    const detailSection = document.querySelector('.detail-popup__overflow')
    detailSection.innerHTML = ''
    const building = item[0].properties
    let html = `
    <div class="detail-popup__row">
        <div class="detail-popup__img-container">
          <img class="detail-popup__img" src="${building.image}" alt="" />
          <img class="watch__icon" src="${watchIcon}" alt="icon watch image">
        </div>

        <div class="detail-popup__address">`

    if (building.name != null && building.name !== 'null') {
      html += `<h1 class="detail-popup__name">${building.name}</h1>`
    }

    html += `
            <h2 class="detail-popup__address__street"> ${building.street} ${building.number} </h2>
            <h2 class="detail-popup__address__municipality">${building.zip_code} ${building.city}</h2>
        </div>
      </div>
      <div class="detail-popup-info">`

    html += detail.showTags(building.styles, styleIcon, 'style', 'Styles')
    html += detail.showTags(building.typologies, typeIcon, 'type', 'Types')
    html += detail.showTags(building.intervenants, architectIcon, 'architect', 'Architects')

    html += `
       </div>
        <a target="_blank" href="${building.url}" class="button button--dark" id="iris_link">` + window.langText.iris_link + `</a>
      </div>`

    detailSection.innerHTML = html
  },

  /**
   * Hidde or show (toggle) the building list and de detail information
   * Resize the map from the building list
   * Detect when clicking on the go back button
   */
  toggleClasses: () => {
    if (!randomClicked) {
      document.querySelector('.section__list').classList.toggle('is-not-visible')
      document.querySelector('.switch').classList.toggle('is-not-visible')
      document.querySelector('.map-building-list').classList.toggle('map-building-list__detail')
    }
    document.querySelector('.detail-popup').classList.toggle('open')
    const btnBack = document.querySelector('.btn--back')
    btnBack.classList.toggle('is-visible')
    if (btnBack.classList.contains('is-visible')) {
      btnBack.addEventListener('click', buildingList.goBack)
    }
  },

  /**
   * Hidde or show (toggle) all layers of the mapbox map visible on the buildingslist page
   * Resize the map
   * @param {object} map - Map object, the map shown on the list page.
   * @param {string} toggle - visible or none, to show or hide the layers on the map
   */
  toggleMapLayers: (map, toggle) => {
    map.resize()
    map.setLayoutProperty('clusters', 'visibility', toggle)
    map.setLayoutProperty('cluster-count', 'visibility', toggle)
    map.setLayoutProperty('unclustered-point', 'visibility', toggle)
  },

  /**
   * Create and show the different tags: styles, types and architects
  * @param {Array} item - Array containing all tags from one category (style, type or architect)
  * @param {image} icon - Image that belongs to the category
  * @param {string} name - Name of the category
  * @param {string} namePlural - Plural name of the category
   */
  showTags: (item, icon, name, namePlural) => {
    let html = ''
    if (item != null && item !== 'null') {
      html += `
        <div class="detail-popup__tags-group">
            <div class="tag__category">
              <img class="tag__icon" src="${icon}" alt="icon ${name} tags">
              <h3 class="tag__group-name">${namePlural}</h3>
              <div class="line line--${name}"></div>
            </div>
              <div class="detail-popup__tags">
                  <div  class="tag tag--${name}">${item}</div>
            </div>
        </div>`
    }
    return html
  },

  /**
   * Go back to the building list page
   * @param {object} map - Map object, the map shown on the list page.
   */
  goBack: (map) => {
    detail.toggleClasses()
    document.querySelector('#switch').checked = true
    detail.toggleMapLayers(map, 'visible')
    map.removeLayer('points')
    map.removeSource('points')

    map.easeTo({
      center: [4.4006, 50.8452],
      zoom: 10.24
    })
  }
}

export default detail
