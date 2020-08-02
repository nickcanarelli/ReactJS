import React, { useState, useEffect } from 'react';
import { FormControl, Select, MenuItem } from '@material-ui/core';
import InfoBox from './components/InfoBox';
import Map from './components/Map';
import Table from './components/Table';
import { sortData, prettyPrintStat } from './utils/util';
import LineGraph from './components/LineGraph';
import 'leaflet/dist/leaflet.css';

import {ReactComponent as Logo } from './assets/logo.svg';
import './styles/App.scss';

// https://disease.sh/v3/covid-19/countries

// STATE = How to write a variable in REACT
// USEEFFECT = Runs a piece of code based on given condition
// async = sends a requests, waits for it, does something with info

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34, lng: -40 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState('cases');

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then(response => response.json())
      .then(data => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => ({
          name: country.country, // United Sates, United Kingdom, Frane
          value: country.countryInfo.iso2 // USA, UK, FR
        }));

        const sortedData = sortData(data);
        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);
      });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url = 
      countryCode === 'worldwide'
        ? 'https://disease.sh/v3/covid-19/all'
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then(data => {
        // Country Code
        setCountry(countryCode);
        
        // All of the data from country response
        setCountryInfo(data);

        if(countryCode !== 'worldwide'){        
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          setMapZoom(4);
        } else {
          setMapCenter({lat: 34.80746, lng: -40.4796});
          setMapZoom(3);
        }
      });
  };

  console.log('COUNTRY INFO', countryInfo);

  return (
    <div className="app">
      <div className="app__header">
        <div className="brand">
          <Logo />COVID-19 Analytics
        </div>
        <div className="dropdown">
          <FormControl className="app__dropdown">
            <Select variant="outlined" value={country} onChange={onCountryChange}>
              <MenuItem  value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem key={country.name} value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>
      
      <div className="app__container">
        <div className="app__left">
          <div className="infoBox__container">
            <InfoBox
              isCases
              active={casesType === 'cases'}
              onClick={e => setCasesType('cases')}
              title="Coronavirus Cases"
              cases={prettyPrintStat(countryInfo.todayCases)}
              total={prettyPrintStat(countryInfo.cases)}
            />
            <InfoBox 
              isRecovered
              active={casesType === 'recovered'}
              onClick={e => setCasesType('recovered')}
              title="Recovered"
              cases={prettyPrintStat(countryInfo.todayRecovered)}
              total={prettyPrintStat(countryInfo.recovered)}
            />
            <InfoBox 
              isDeaths
              active={casesType === 'deaths'}
              onClick={e => setCasesType('deaths')}
              title="Deaths"
              cases={prettyPrintStat(countryInfo.todayDeaths)}
              total={prettyPrintStat(countryInfo.deaths)}
            />
          </div>
          <div className="map__container">
            <Map countries={mapCountries} casesType={casesType} center={mapCenter} zoom={mapZoom}/>
          </div>
        </div>

        <div className="app__right">
          <div className="body">
            <div className="table">
              <div className="title">
                Live Cases by Country
              </div>
              <Table countries={tableData} />
            </div>
            <div className="chart">
              <div className="title">
                Worldwide new {casesType}
              </div>
              <LineGraph className="app_graph" casesType={casesType} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
