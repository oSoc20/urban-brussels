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
  init: (paginationWrapper, data) => {
    currentPage = data.currentPage || 1
    itemsPerPage = data.itemsPerPage || 30
    size = Math.ceil(data.totalItems / itemsPerPage)
    numPages = size
    firstLoad = true

    Pagination.createPagination(paginationWrapper)
    BuildingsList.displayContent(currentPage)
  },

  onPageChanged: () => {
    if (currentPage === 1 && numPages === 1) {
      document.querySelector('.pagination').classList.add('is-hidden')
    } else {
      document.querySelector('.pagination').classList.remove('is-hidden')
    }
    return this
  },

  paginationContainer: (paginationWrapper) => {
    const template = [
      `<a class="arrowLeft"><img src="${arrowRight}" /></a>`,
      '<span></span>',
      `<a class="arrowRight"><img src="${arrowRight}" /></a>`
    ]
    paginationWrapper.innerHTML = template.join('')
  },

  arrows: (paginationWrapper) => {
    navArrows = paginationWrapper.getElementsByTagName('a')
    navArrows[0].addEventListener('click', function () {
      Pagination.prevPage(paginationWrapper)
    }, false)
    navArrows[1].addEventListener('click', function () {
      Pagination.nextPage(paginationWrapper)
    }, false)
  },

  prevPage: (paginationWrapper) => {
    if (currentPage > 1) {
      currentPage--
      Pagination.changeContent(paginationWrapper)
    }
  },

  nextPage: (paginationWrapper) => {
    if (currentPage < numPages) {
      currentPage++
      Pagination.changeContent(paginationWrapper)
    }
  },
  changeContent: (paginationWrapper) => {
    if (firstLoad === false) {
      BuildingsList.displayContent(currentPage)
    } else {
      firstLoad = false
    }

    const pageNumbersWrapper = paginationWrapper.getElementsByTagName('span')[0]
    pageNumbersWrapper.innerHTML = Pagination.paginationTemplate()
  },

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

  createPagination: (paginationWrapper) => {
    Pagination.paginationContainer(paginationWrapper)
    Pagination.arrows(paginationWrapper)
    Pagination.changeContent(paginationWrapper)
  }
}

export default Pagination
