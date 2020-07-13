const Api = {
    
    //Fetches buildings data from the API
    //TODO localstorage
    getData : async () => {
        const options = {
           method: 'GET',
           headers: {
               'Content-Type': 'application/json'
           }
       };
       try {
           const response = await fetch(`https://urban-brussels-api-dev.netlify.app/.netlify/functions/app/getInfo/byZipCode/1090`, options)
           const json = await response.json();
           //console.log(json)
           return json
       } catch (err) {
           console.log('Error getting documents', err)
       }
    }
}

export default Api;