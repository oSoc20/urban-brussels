
import arrowRight from '../../assets/icons/arrow-icon.svg'

const eventHandler = require('event-handler')

const pagination = function (paginationWrapper, data) {
  const events = new eventHandler()

  let currentPage = data.currentPage || 1
  const itemsPerPage = data.itemsPerPage || 30
  const step = data.step || 3
  const size = Math.ceil(data.totalItems / itemsPerPage)

  if (typeof (data.onInit) === 'function') {
    events.on('init', data.onInit)
  }
  if (typeof (data.onPageChanged) === 'function') {
    events.on('pageChanged', data.onPageChanged)
  }

  let navArrows
  const numPages = size
  let firstLoad = true

  /**
     * @param {function} callback
     * @returns {pagination}
     */
  this.onPageChanged = function (callback) {
    if (currentPage === 1 && numPages === 1) {
      document.querySelector('.pagination').classList.add('is-hidden')
    } else {
      document.querySelector('.pagination').classList.remove('is-hidden')
    }
    events.on('pageChanged', callback)
    return this
  }

  /**
     * @returns {number}
     */
  this.getCurrentPage = function () {
    return currentPage
  }

  this.getPrevPage = function () {
    if (currentPage > 1) {
      return currentPage--
    }

    return false
  }

  this.getNextPage = function () {
    if (currentPage < numPages) {
      return currentPage++
    }

    return false
  }

  const paginationContainer = function (paginationWrapper) {
    const template = [
      `<a class="arrowLeft"><img src="${arrowRight}" /></a>`,
      '<span></span>',
      `<a class="arrowRight"><img src="${arrowRight}" /></a>`
    ]
    paginationWrapper.innerHTML = template.join('')
  }

  const arrows = function (paginationWrapper) {
    navArrows = paginationWrapper.getElementsByTagName('a')
    navArrows[0].addEventListener('click', function () {
      prevPage(paginationWrapper)
    }, false)
    navArrows[1].addEventListener('click', function () {
      nextPage(paginationWrapper)
    }, false)
  }

  const prevPage = function (paginationWrapper) {
    if (currentPage > 1) {
      currentPage--
      changeContent(paginationWrapper)
    }
  }

  const nextPage = function (paginationWrapper) {
    if (currentPage < numPages) {
      currentPage++
      changeContent(paginationWrapper)
    }
  }

  const changeContent = function (paginationWrapper) {
    if (firstLoad === false) {
      events.fire('pageChanged', [currentPage])
    }

    if (firstLoad === true) {
      firstLoad = false
    }

    const pageNumbersWrapper = paginationWrapper.getElementsByTagName('span')[0]
    pageNumbersWrapper.innerHTML = paginationTemplate()
    attachPageEvents(paginationWrapper, pageNumbersWrapper.getElementsByTagName('a'))
  }

  const attachPageEvents = function (paginationWrapper, pageLinks) {
    for (let i = 0; i < pageLinks.length; i++) {
      pageLinks[i].addEventListener('click', function () {
        currentPage = this.innerText
        changeContent(paginationWrapper)
      }, false)
    }
  }

  const paginationTemplate = function () {
    let template = ''
    const elementsToShow = step * 2

    const add = {
      pageNum: function (start, end) {
        for (let i = start; i <= end; ++i) {
          if (i === currentPage) {
            template += '<a class="current pagNumber">' + i + '</a>'
          } else {
            template += '<a class="pagNumber">' + i + '</a>'
          }
        }
      },
      startDots: function () {
      // add first currentPage with separator
        template += '<a class="pagNumber">1</a><i class="pagDots">...</i>'
      },

      endDots: function () {
        template += '<i class="pagDots">...</i><a class="pagNumber">' + numPages + '</a>'
      },
      totalPages: function () {
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
        template += '<p class="pagination__page"> ' + currentPage + ' / ' + numPages + '</p>'
      }
    }

    if (elementsToShow >= numPages) {
      add.pageNum(1, numPages)
    } else {
      if (currentPage < elementsToShow) {
        add.pageNum(1, elementsToShow)
        add.endDots()
      } else if (currentPage > numPages - elementsToShow) {
        add.startDots()
        add.pageNum(numPages - elementsToShow, numPages)
      } else {
        add.startDots()
        add.pageNum(currentPage - step, parseInt(currentPage) + parseInt(step))
        add.endDots()
      }
    }
    add.totalPages()
    return template
  }

  const createPagination = function (paginationWrapper) {
    paginationContainer(paginationWrapper)
    arrows(paginationWrapper)
    changeContent(paginationWrapper)
  }

  createPagination(paginationWrapper)
  events.fire('init', currentPage)
}

module.exports = pagination
