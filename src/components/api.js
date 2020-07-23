const Api = {

  // Fetches buildings data from the API

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

  searchFunFacts: async (lang, limit) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        lang: lang,
        limit: limit
      }
    }
    try {
      const response = await fetch('https://urban-brussels-api-dev.netlify.app/.netlify/functions/app/getInfo/fun-facts', options)
      const json = await response.json()
      return json
    } catch (err) {
      console.log('Error getting documents', err)
    }
  },

  getInfo: async () => {

  },

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
  }

  // Add more functions
}

export default Api
