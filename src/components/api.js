const Api = {

  /**
   * Fetches buildings data depending on search
   * json: the tags and keywords chosen by the user
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
   * lang: the language the data should be returned
   * query: the user's search
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
   * lang: the language the data should be returned
   * limit: the number of results that will be returned
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
   */

  getStats: async () => {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    try {
      const response = await fetch('https://api.urban-brussels.osoc.be/stats', options)
      const json = await response.json()
      console.log(json)
      return json
    } catch (err) {
      console.log('Error getting documents', err)
    }
  },

  /**
   * Fetches fun facts about the dataset
   * lang: the language the data should be returned
   * limit: the number of results that will be returned
   */

  getFunFacts: async (lang, limit) => {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
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

  // Add more functions
}

export default Api
