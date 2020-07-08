import React from "react";
import "./App.css";
import mapboxgl from 'mapbox-gl';


mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    lng: 4.355,
    lat: 50.847,
    zoom: 11.5
    };
  }

  componentDidMount() {
    new mapboxgl.Map({
    container: this.mapContainer,
    style: process.env.REACT_APP_MAPBOX_STYLE,
    center: [this.state.lng, this.state.lat],
    zoom: this.state.zoom
    });
  }

  render() {
    return (
      <div>
          <div ref={el => this.mapContainer = el} className="mapContainer" />
      </div>
    );
  }
}