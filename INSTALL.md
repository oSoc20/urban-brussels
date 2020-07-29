# Front-End install

## Run locally

1. Clone the project
   ```bash
   git clone https://github.com/oSoc20/urban-brussels.git
   ```

2. Copy the `.env.example` to `.env`
   ``` bash
   cp .env.example .env
   ```

3. Replace the `MY_SECRET_MAPBOX_ACCESS_TOKEN` value by your generated Mapbox access token

4. Install the necessary packages
   ``` bash
   npm install
   ```

5. Run the project
   ``` bash
   npm run bundle
   ```

The default api 

**NOTE:** The default api url used is https://api.urban-brussels.osoc.be, get to know more about it in the 
[the backend](https://github.com/oSoc20/urban-brussels-api) repository.
