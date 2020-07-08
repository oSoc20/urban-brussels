import React, { useRef, useEffect } from "react";
import "./Map.css";
import mapboxgl from 'mapbox-gl';
import markerBuilding from './assets/icons/building_marker.png';


mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const Map = () => {
    const mapContainerRef = useRef(null);

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
            map.loadImage(markerBuilding, ( error, image)=> {
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
    }

    return <div className="mapContainer" ref={mapContainerRef} />;
};

export default Map;