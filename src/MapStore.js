import React, { Component } from 'react';
import './App.css';

import { withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps';
import MarkerClusterer from 'react-google-maps/lib/addons/MarkerClusterer';

function getStores(value) {
  return fetch(`https://fnw-ml.herokuapp.com/us/stores/search?zip_code=${value}`, {method:'GET'})
}

const GettingStartedGoogleMap = withGoogleMap(props => (
  <GoogleMap
    defaultZoom={4}
    defaultCenter={{ lat: 42.877742, lng: -97.380979 }} >

    <MarkerClusterer
      averageCenter
      enableRetinaIcons
      gridSize={60}
    >
   
    {props.markers.map((marker, index) => (
      <Marker
        {...marker}
        onClick={() => props.onMarkerClick(marker)}>

        {marker.showInfo && (
          <InfoWindow onCloseClick={() => props.onMarkerClose(marker)}>
            <div>
              <h4>{marker.store_name}</h4>
              <p>{marker.address}, {marker.city}, {marker.state}</p>
            </div>
          </InfoWindow>
        )}

        </Marker>
    ))}

    </MarkerClusterer>

  </GoogleMap>
));

export default class MapStore extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      markers: []
    }
  }

  componentWillMount() {
    fetch('https://fnw-ml.herokuapp.com/us/stores', {method:'GET'})
      .then(response => response.json())
      .then(stores => {
        const markers = stores.map((store, index) => {
          return {
            ...store,
            key: index,
            position: {
              lat: parseFloat(store.location.lat),
              lng: parseFloat(store.location.lng)
            }
          }
        });

        this.setState({ markers })
      })
  }

  onChange(event) {
    this.setState({ value: event.target.value });
  }

  onClick(event) {
    const value = this.state.value;

    getStores(value)
      .then(response => response.json())
      .then(stores => {
        const markers = stores.map((store, index) => {
          return {
            ...store,
            position: {
              lat: parseFloat(store.location.lat),
              lng: parseFloat(store.location.lng)
            },
            key: index
          }
        });

        this.setState({ markers })
      })
  }

  handleMarkerClick(targetMarker) {
    this.setState({
      markers: this.state.markers.map(marker => {
        if (marker === targetMarker) {
          return {
            ...marker,
            showInfo: true,
          };
        }
        return marker;
      }),
    });
  }

  handleMarkerClose(targetMarker) {
    this.setState({
      markers: this.state.markers.map(marker => {
        if (marker === targetMarker) {
          return {
            ...marker,
            showInfo: false,
          };
        }
        return marker;
      })
    });
  }

  renderStores() {
      return this.state.markers.map((store, index) => (
          <li key={index}>
            <h4>{store.store_name}</h4>
            <p>{store.address}, {store.city}, {store.state}</p>
          </li>
        )
      )
  }

  render() {
    return (
      <div className="App">
        <div id="search">
          <input type="text" defaultValue="" onChange={this.onChange.bind(this)} />
          <button onClick={this.onClick.bind(this)}>Search</button>
          <ul>
            {this.renderStores()}
          </ul>
        </div>
        <div id="map">
          <GettingStartedGoogleMap
              containerElement={<div style={{ height: `100%` }} />}
              mapElement={<div style={{ height: `100%` }} />}
              onMarkerClick={this.handleMarkerClick.bind(this)}
              onMarkerClose={this.handleMarkerClose.bind(this)}
              markers={this.state.markers}
          />
        </div>
      </div>
    );
  }
}