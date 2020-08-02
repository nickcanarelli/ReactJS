import React from 'react';
import {Map as LeafletMap, TileLayer } from 'react-leaflet';
import '../styles/Map.scss';
import { showDataOnMap } from '../utils/util';

function Map({ countries, casesType, center, zoom }) {
  return (
    <div className="map">
      <div className="body">
        <LeafletMap center={center} zoom={zoom}>
          <TileLayer
            url='https://api.mapbox.com/styles/v1/nickcanarelli/ckddic63q3sid1imy4h688kmb/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoibmlja2NhbmFyZWxsaSIsImEiOiJja2Q2bG8yaDYwNWVnMnFucW9nenZ6bHlhIn0.ptytm2IG6Oth-D54Y1WRTA'                        
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          {showDataOnMap(countries, casesType)}
        </LeafletMap>
      </div>
    </div>
  )
}

export default Map;
