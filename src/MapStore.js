import React, { Component } from 'react';
import './App.css';

import { withGoogleMap, GoogleMap, Marker, InfoWindow, Circle } from 'react-google-maps';
import MarkerClusterer from 'react-google-maps/lib/addons/MarkerClusterer';

function getStores(value) {
  return fetch(`http://localhost:3000/us/stores/location?lng=${value.lng}&lat=${value.lat}2&radius=25`, {method:'GET'})
}

const RADIUS = 1.60934 * 25 * 1000;

const GettingStartedGoogleMap = withGoogleMap(props => (
  <GoogleMap
    zoom={props.zoom}
    center={props.center} >

    <Circle
      center={props.center}
      radius={RADIUS}
      options={{
        fillColor: '#81c14a',
        strokeColor: '#81c14a',
        strokeOpacity: 0.55,
        strokeWeight: 1,
        fillOpacity: 0.25,
      }}
   />
      <MarkerClusterer
        averageCenter
        enableRetinaIcons
        gridSize={20}
      >

        {props.markers.map((marker, index) => (
          <Marker
            {...marker}
            onClick={() => props.onMarkerClick(marker)}>

            {marker.showInfo && (
              <InfoWindow onCloseClick={() => props.onMarkerClose(marker)}>
                <div>
                  <h4>{marker.store_name}</h4>
                  <p>{marker.address}, {marker.city}, {marker.state}, {marker.zip_code}</p>
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
      bounds: '',
      zoom: 4,
      center: {
        lng: -97.0000,
        lat: 38.0000
      },
      markers: []
    }
  }

  componentWillMount() {
    fetch('http://localhost:3000/us/stores', {method:'GET'})
      .then(response => response.json())
      .then(stores => {
        const markers = stores.map((store, index) => {
          return {
            ...store,
            position: {
              lng: store.location.coordinates[0],
              lat: store.location.coordinates[1]
            },
            key: index
          }
        });

        this.setState({ 
          markers,
          //center: { lng: store.location.coordinates[0], lat: store.location.coordinates[1], },
          zoom: 8
        })
      })
    // fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=1421+Foxworthy+Avenue,+San+Jose,+CA,+United+States&key=AIzaSyAL6FyEf5Oql_lrQoYFoI3puPltEKyuHMs`, {method:'GET'})
    //   .then(response => response.json())
    //   .then(response => {
    //     const {lat, lng } = response.results[0].geometry.location;

    //     getStores({lat, lng})
    //     .then(response => response.json())
    //     .then(stores => {
    //       const markers = stores.map((store, index) => {
    //         return {
    //           ...store,
    //           position: {
    //             lng: store.location.coordinates[0],
    //             lat: store.location.coordinates[1]
    //           },
    //           key: index
    //         }
    //       });

    //       this.setState({ 
    //         markers,
    //         center: { lng: lng, lat: lat, },
    //         zoom: 8
    //       })
    //     })
    // })
    .catch(err => console.error(err));
  }

  onChange(event) {
    this.setState({ value: event.target.value });
  }

  onClick(event) {
    const value = this.state.value;

    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${value},+United+States&key=AIzaSyAL6FyEf5Oql_lrQoYFoI3puPltEKyuHMs`, {method:'GET'})
      .then(response => response.json())
      .then(response => {
        const {lat, lng } = response.results[0].geometry.location;

        getStores({lat, lng})
          .then(response => response.json())
          .then(stores => {
            const markers = stores.map((store, index) => {
              return {
                ...store,
                position: {
                  lng: store.location.coordinates[0],
                  lat: store.location.coordinates[1]
                },
                key: index
              }
            });

            this.setState({ 
              markers,
              center: { lng: lng, lat: lat, },
              zoom: 8
            })
          })
      })
      .catch(err => console.error(err));
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
          <li key={index} className="list-group-item">
            <h4>{store.store_name}</h4>
            <p>{store.address}, {store.city}, {store.state}, {store.zip_code}</p>
          </li>
        )
      )
  }

  render() {
    return (
      <div className="row">

        <div className="col-lg-12">
          <h1>NatureWise Stores</h1>
        </div>  

        
          <div id="search" className="col-lg-6">
            <div className="input-group" role="group">
              <input className="form-control" type="text" defaultValue="" placeholder="Zip code" onChange={this.onChange.bind(this)} />
              <span className="input-group-btn">
                <button type="button" className="btn btn-success" onClick={this.onClick.bind(this)}>Search</button>
              </span>
            </div>
            <div className="list-store">
              <ul className="list-group">
                {this.renderStores()}
              </ul>
            </div>
          </div>

          <div id="map" className="col-lg-6" style={{height:`435px`}}>
            <GettingStartedGoogleMap
                containerElement={<div style={{ height: `100%` }} />}
                mapElement={<div style={{ height: `100%` }} />}
                onMarkerClick={this.handleMarkerClick.bind(this)}
                onMarkerClose={this.handleMarkerClose.bind(this)}
                markers={this.state.markers}
                zoom={this.state.zoom}
                center={this.state.center}
            />
          </div>
        
      </div>
    );
  }
}