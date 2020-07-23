const Api = {

  // Fetches buildings data from the API
  getData: async () => {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    try {
      const response = await fetch('https://gis.urban.brussels/geoserver/ows?service=wfs&version=2.0.0&request=GetFeature&TypeName=BSO_DML_BESC:Inventaris_Irismonument&outputformat=application/json&cql_filter=CITY%20=%20%271090%27&srsname=EPSG:4326', options)
      const json = await response.json()
      // console.log(json)
      return json
    } catch (err) {
      console.log('Error getting documents', err)
    }
  },

  searchData: async (lang, type, value, limit, offset) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        lang: lang,
        type: type,
        value: value,
        limit: limit,
        offset: offset
      }
    }
    try {
      const response = await fetch('https://urban-brussels-api-dev.netlify.app/.netlify/functions/app/getInfo/search', options)
      const json = await response.json()
      // console.log(json)
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
        'Content-Type': 'application/json',
        lang: lang,
        limit: limit
      }
    }
    try {
      const response = await fetch('https://urban-brussels-api-dev.netlify.app/.netlify/functions/app/getInfo/search/random', options)
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
      // console.log(json)
      return json
    } catch (err) {
      console.log('Error getting documents', err)
    }
  }

  // Add more functions
}

export default Api
