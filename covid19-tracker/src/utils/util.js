import React from 'react';
import numeral from 'numeral';
import { Circle, Popup } from 'react-leaflet';

const casesTypeColors = {
  cases: {
    hex: '#1e90ff',
    multiplier: 800,
  },
  recovered: {
    hex: '#2ed573',
    multiplier: 1200,
  },
  deaths: {
    hex: '#ff4757',
    multiplier: 2000,
  },
};

export const sortData = (data) => {
  const sortedData = [...data];

  return sortedData.sort((a, b) => a.cases > b.cases ? -1 : 1);
};

export const prettyPrintStat = (stat) => 
  stat 
    ? `+${numeral(stat).format('0.0a')}`
    : '+0';

// Draw circles on the map
export const showDataOnMap = (data, casesType='cases') => 
  data.map((country) => (
    <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}
      fillOpacity={0.4}
      color={casesTypeColors[casesType].hex}
      fillColor={casesTypeColors[casesType].hex}
      radius={
        Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
      }
    >
      <Popup>
        <div className="map__popup">
          <div className="country_info">
            <div style={{backgroundImage: `url(${country.countryInfo.flag})`}} className="flag"></div>
            <div className="country">{country.country}</div>
          </div>
          <div className="cases">Cases: {numeral(country.cases).format('0,0')}</div>
          <div className="recovered">Recovered: {numeral(country.recovered).format('0,0')}</div>
          <div className="deaths">Deaths: {numeral(country.deaths).format('0,0')}</div>
        </div>
      </Popup>
    </Circle>
  ));