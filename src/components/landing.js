import SearchBar from './SearchBar/searchbar.js'

let Landing = {
   render : async () => {
       let view =  /*html*/`
      <div id="map"></div>
    
      <div class="fun-fact-box">
        <div id="landing_search"></div>
        <div class="inside-box">
          <div class="inside-text" id="text_1">
                <h4 id="funFact1"> Did you know about <button type="button" id="buttonArchitect"> Architect </button> built 20 buildings of <button type="button"id="buttonType"> Type </button> and <button type="button" id="buttonStyle"> Style </button>.</h4>
            </div>
          </div>
          <br>
            <div class="inside-box">
              <div class="inside-text" id="text_2">
                <h4>Did you know about <button type="button"id="buttonArchitect"> Architect </button> built 20 buildings of <button type="button" id="buttonType"> Type </button> and <button type="button" id="buttonStyle"> Style </button></h4>
              </div>
            </div>
        <div class="navButton" id="clickButton">
          <button type="button" class="arrow previous" id="previous"> &#8249; </button>
          <button type="button" class="arrow next" id="next"> &#8250; </button>
          </div>
        </div>
       `
       return view
   }
   , after_render: async () => {
     //Search bar code
    SearchBar.displaySearchBar("landing_search");
    SearchBar.searchFunction();

    mapboxgl.accessToken = 'pk.eyJ1IjoiYW5hZHYxOCIsImEiOiJja2NibWI1dmIyNjh4MzBvMDJzazJlNzI0In0.n6nqsasihr0Cmsik6AU3zQ';

    var map = new mapboxgl.Map({
       container: document.getElementById("map"),
       style:'mapbox://styles/anadv18/ckcofi5sh06gk1ilj0xc7e0lg', // stylesheet location
       center: [4.34552806, 50.83076536],
       zoom: 15, // starting zoom
    });
    
    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
 
    console.log(map);
    map.on('load', function () {
        map.addSource ('trees',{
            type: 'geojson',
            data: 'https://api.urban-brussels.osoc.be/autocomplete?lang=fre&query=victor'
        });
        map.addLayer({
            id: 'trees-heat',
            type: 'heatmap',
            source: 'trees',
            maxzoom: 15,
            paint: {
              'fill-color': '#ffffff',
              'fill-opacity': 1
}});
          map.addLayer({
            id: 'trees-point',
            type: 'circle',
            source: 'trees',
            minzoom: 14,
            paint: {
              // increase the radius of the circle as the zoom level and dbh value increases
              'circle-radius': {
                property: 'dbh',
                type: 'exponential',
                stops: [
                  [{ zoom: 15, value: 1 }, 5],
                  [{ zoom: 15, value: 62 }, 10],
                  [{ zoom: 22, value: 1 }, 20],
                  [{ zoom: 22, value: 62 }, 50],
                ]
              },
              'circle-stroke-color': 'black',
              'circle-opacity': {
                stops: [
                  [14, 0],
                  [15, 1]
                ]
              }
            }
          }, 'waterway-label');

      });
map.on ('sourcedata', (event) => {
  if (event.isSourceLoaded === true)
  {map.querySourceFeatures("trees").forEach((feature) => {
    //console.log(feature);
     console.log (feature.properties);
     console.log (feature.properties['STYLE_NL']);
       var popup =  new mapboxgl.Popup({ closeOnClick:false })
       .setLngLat(feature.geometry.coordinates)
       .setHTML(`<img src="${feature.properties["FIRSTIMAGE"]}">` + `<h1>${feature.properties["CITIES_NL"]}</h1>`  + '<p>BE Central <br> Kantersteen 10/12, <br> 1000 Brussels </p>')
       .addTo(map);
   }); }
})
//Slideshow for Fun facts
    $(document).ready(function() {
        $('#previous').on('click', function(){
          // Change to the previous image
          $('#text_' + currentText).stop().fadeOut(1);
          decreaseText();
          $('#text_' + currentText).stop().fadeIn(1);
        }); 
        $('#next').on('click', function(){
          // Change to the next image
          $('#text_' + currentText).stop().fadeOut(1);
          increaseText();
          $('div .inside-box:not(:nth-of-type(2))').show();
          $('#text_' + currentText).stop().fadeIn(1);

          console.log(currentText);
        }); 
      
        var currentText = 1;
        var totalTexts = 3;
      
        function increaseText() {
          /*Increase currentImage by 1.
          * Resets to 1 if larger than totalImages
          */
          ++currentText;
          if(currentText > totalTexts) {
            currentText = 1;
          }
        }
        function decreaseText() {
          /* Decrease currentImage by 1.
          * Resets to totalImages if smaller than 1
          */
          --currentText;
          if(currentText < 1) {
            currentText = totalTexts;
          }
        }
      });
   }


}

export default Landing;