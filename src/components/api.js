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
      const response = await fetch('https://urban-brussels-api-dev.netlify.app/.netlify/functions/app/getInfo/byZipCode/1090', options)
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
  }

  // Add more functions
}

export default Api
