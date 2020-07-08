import React, { useRef, useEffect } from "react";
import "./App.css";
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const App = () => {
    const mapContainerRef = useRef(null);

    //Initialize map after render
    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: process.env.REACT_APP_MAPBOX_STYLE,
            center: [4.355, 50.847],
            zoom: 11.5
        });

        map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

        //Remove map on unmount
        return () => map.remove();
    }, []);

    return <div className="mapContainer" ref={mapContainerRef} />;
};

export default App;