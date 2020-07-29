/**
 * This module contains all the endpoints and requests made to the API
 */

const Api = {

  /**
   * Fetches buildings data depending on search
   * @param {Object} json - the body of the request, contains all the tags and keywords of the user
   */

  searchData: async (json) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(json)
    }
    try {
      const response = await fetch('https://api.urban-brussels.osoc.be/search', options)
      const json = await response.json()
      return json
    } catch (err) {
      console.log('Error getting documents', err)
    }
  },

  /**
   * Fetches data for autocomplete
   * @param {string} lang - the language the data should be returned
   * @param {string} query - the string typed by the user in the search bar
   */

  getAutocomplete: async (lang, query) => {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    try {
      const response = await fetch('https://api.urban-brussels.osoc.be/autocomplete?lang=' + lang + '&query=' + query, options)
      const json = await response.json()
      return json
    } catch (err) {
      console.log('Error getting documents', err)
    }
  },

  /**
   * Fetches random buildings data
   * @param {string} lang: the language the data should be returned
   * @param {number} limit: the number of results that will be returned
   */

  searchRandom: async (lang, limit) => {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    try {
      const response = await fetch('https://api.urban-brussels.osoc.be/search/random?lang=' + lang + '&limit=' + limit, options)
      const json = await response.json()
      return json
    } catch (err) {
      console.log('Error getting documents', err)
    }
  },

  /**
   * Fetches stats about the dataset
   * @param {Object} json - the body of the request, contains all the tags and keywords of the user
   */

  getStats: async (json) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(json)
    }
    try {
      const response = await fetch('https://api.urban-brussels.osoc.be/stats', options)
      const json = await response.json()
      return json
    } catch (err) {
      console.log('Error getting documents', err)
    }
  },

  /**
   * Fetches fun facts about the dataset
   * @param {string} lang: the language the data should be returned
   * @param {number} limit: the number of results that will be returned
   */

  getFunFacts: async (lang, limit) => {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    try {
      const response = await fetch('https://api.urban-brussels.osoc.be/funfacts?lang=' + lang + '&limit=' + limit, options)
      const json = await response.json()
      return json
    } catch (err) {
      console.log('Error getting documents', err)
    }
  }

}

export default Api
