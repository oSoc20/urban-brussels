import React, { useRef, useEffect, useState } from "react";
import "./Map.css";
import mapboxgl from 'mapbox-gl';
import markerBuilding from './assets/icons/building_marker.png';


mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const Map = () => {
    const mapContainerRef = useRef(null);
    const [markerIsClicked, setIsClicked ] = useState(false);
    const [selectedBuilding, setSelectedBuilding ] = useState({
        'city': null,
        'street': null,
        'number': null,            
        'img': null 
    });


    //Initialize map after render
    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: process.env.REACT_APP_MAPBOX_STYLE,
            center: [4.3270, 50.8787],
            zoom: 12.71
        });

        map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

        map.on('load', () => {
            map.loadImage(markerBuilding, ( error, image) => {
              if (error) throw error;
              map.addImage('markerBuilding', image);
            });
            showBuildingLayer(map);
        });

        //Remove map on unmount
        return () => map.remove();
    }, []);

    const showBuildingLayer = map => {
        map.addSource('buildingsJette', {
            type: 'geojson',
            data: 'https://gis.urban.brussels/geoserver/ows?service=wfs&version=2.0.0&request=GetFeature&TypeName=BDU_DMS_PROT:Inventaire_Irismonument&outputformat=application/json&cql_filter=CITY%20=%20%271090%27&srsname=EPSG:4326'
        });

        map.addLayer({
            id: 'buildingsJette',
            type: 'symbol',
            source: 'buildingsJette',
            filter: ['!', ['has', 'point_count']],
            layout: {
              visibility: 'visible',
              'icon-image': 'markerBuilding',
              'icon-size': 0.1
            }, 
        });

        map.on('click', (e) => {setIsClicked(false);});
      

        map.on('click', 'buildingsJette', e => {
            setIsClicked(true);

            setSelectedBuilding({
                'city': e.features[0].properties.CITIES_NL,
                'street': e.features[0].properties.STREET_NL,
                'number': e.features[0].properties.NUMBER,
                'img': e.features[0].properties.FIRSTIMAGE
            })
        });

        map.on('mouseenter', 'buildingsJette', () => {
            map.getCanvas().style.cursor = 'pointer';
        });
             
        map.on('mouseleave', 'buildingsJette', () => {
            map.getCanvas().style.cursor = '';
        });
    }

    
    return (
        <div>
            <div className='sidebarStyle'> <div>Jette </div> </div>
            <div className="mapContainer" ref={mapContainerRef} />;
            <div className= {"detail-popup " + (markerIsClicked ? 'shown' : '')}>
                <div className="small-version">
                    <div className="scrolling">
                        <div className="city">{selectedBuilding.city}</div>
                        <div className="street">{selectedBuilding.street} {selectedBuilding.number}</div>
                        <div className="thumbnail">
                          <img src={selectedBuilding.img} alt="" className="img-responsive" />
                        </div>
                        <div className="description">
                           Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer semper vitae est feugiat laoreet. 
                           Ut eu placerat mi. In hac habitasse platea dictumst. Duis commodo vitae lacus in maximus. 
                           Donec nisl sem, bibendum nec nisi eget, viverra bibendum purus. Etiam tincidunt viverra lacus, 
                           vel sodales sapien. Aliquam sed erat dui. Nunc non malesuada turpis, eget viverra tellus. 
                        </div>
                        <div className="square-button read-more">Read More</div>
                        <div className="tags-title">Style tags</div>
                        <div className="tags">
                            <span className="tag">Baroque</span>
                            <span className="tag">Romanesque</span>
                            <span className="tag">Bauhaus</span>
                            <span className="tag">Neo-classical</span>
                            <span className="tag">Renaissance</span>
                            <span className="tag">Gothic</span>
                            <span className="tag">Modernist</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Map;