/**
 * This module displays and contains the logic of the pagination used for the buildings list page
 */

/** Modules import */
import arrowRight from '../../assets/icons/arrow-icon.svg'
import BuildingsList from '../BuildingsList/buildingslist'

/** Variable declarations */
let currentPage
let itemsPerPage
let size
let navArrows
let numPages
let firstLoad

const Pagination = {
  /**
   * Sets the variables for creating the pagination
   * Calling the right functions to create the pagination and displaying the right list of items
   * @param {HTMLElement} paginationWrapper - HTML element that will contain the pagination
   * @param {Object} data - an object that will contain the current page, the total items and the number of items per page
   */
  init: (paginationWrapper, data) => {
    currentPage = data.currentPage || 1
    itemsPerPage = data.itemsPerPage || 30
    size = Math.ceil(data.totalItems / itemsPerPage)
    numPages = size
    firstLoad = true

    Pagination.createPagination(paginationWrapper)
    BuildingsList.displayContent(currentPage)
  },

  /**
   * Hidde the pagination when there is only one page
   */
  onPageChanged: () => {
    if (currentPage === 1 && numPages === 1) {
      document.querySelector('.pagination').classList.add('is-hidden')
    } else {
      document.querySelector('.pagination').classList.remove('is-hidden')
    }
    return this
  },

  /**
   * Create the arrows for the pagination
   * @param {HTMLElement} paginationWrapper - HTML element that will contain the pagination
   */
  paginationContainer: (paginationWrapper) => {
    const template = [
      `<a class="arrowLeft"><img src="${arrowRight}" /></a>`,
      '<span></span>',
      `<a class="arrowRight"><img src="${arrowRight}" /></a>`
    ]
    paginationWrapper.innerHTML = template.join('')
  },

  /**
   * Detect when clicking on the next or previous arrow
   * @param {HTMLElement} paginationWrapper - HTML element that will contain the pagination
   */
  arrows: (paginationWrapper) => {
    navArrows = paginationWrapper.getElementsByTagName('a')
    navArrows[0].addEventListener('click', function () {
      Pagination.prevPage(paginationWrapper)
    }, false)
    navArrows[1].addEventListener('click', function () {
      Pagination.nextPage(paginationWrapper)
    }, false)
  },

  /**
   * Decrease currentPage if current page is bigger than 1
   * Call function to change the list of shown items
   * @param {HTMLElement} paginationWrapper - HTML element that will contain the pagination
   */
  prevPage: (paginationWrapper) => {
    if (currentPage > 1) {
      currentPage--
      Pagination.changeContent(paginationWrapper)
    }
  },

  /**
   * Increase currentPage if current page is smaller than the total number of pages
   * Call function to change the list of shown items
   * @param {HTMLElement} paginationWrapper - HTML element that will contain the pagination
   */
  nextPage: (paginationWrapper) => {
    if (currentPage < numPages) {
      currentPage++
      Pagination.changeContent(paginationWrapper)
    }
  },

  /**
   * Change the list of shown items
   * Call the function to show the current page and total number of pages
   * @param {HTMLElement} paginationWrapper - HTML element that will contain the pagination
   */
  changeContent: (paginationWrapper) => {
    if (firstLoad === false) {
      BuildingsList.displayContent(currentPage)
    } else {
      firstLoad = false
    }

    const pageNumbersWrapper = paginationWrapper.getElementsByTagName('span')[0]
    pageNumbersWrapper.innerHTML = Pagination.paginationTemplate()
  },

  /**
   * Hidde previous arrow when current page equals 1
   * Hidde next arrow when current page equals total number of pages
   * Show the current page and total number of pages
   */
  paginationTemplate: () => {
    if (currentPage === 1) {
      document.querySelector('.arrowLeft').classList.add('is-hidden')
    } else {
      document.querySelector('.arrowLeft').classList.remove('is-hidden')
    }

    if (currentPage === numPages) {
      document.querySelector('.arrowRight').classList.add('is-hidden')
    } else {
      document.querySelector('.arrowRight').classList.remove('is-hidden')
    }
    return '<p class="pagination__page"> ' + currentPage + ' / ' + numPages + '</p>'
  },

  /**
   * Call functions to create arrows and detecting click on arrows
   * Call function to change the list of shown items
   * @param {HTMLElement} paginationWrapper - HTML element that will contain the pagination
   */
  createPagination: (paginationWrapper) => {
    Pagination.paginationContainer(paginationWrapper)
    Pagination.arrows(paginationWrapper)
    Pagination.changeContent(paginationWrapper)
  }
}

export default Pagination
