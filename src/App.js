import React, { useState, useMemo } from 'react';
import './App.css';

import Main from './components/Main';
import data from './data/data.json';
import excludeCountries from './data/excludeCountries.json';
import dateFormat from './functions/dateFormat';



function App() {
  const [since, setSince] = useState(null)
  const [country, setCountry] = useState('total');

  const changeSinceHandler = (e) => {
    const date = new Date();

    switch(e.target.value) {
      case '1w':
        date.setDate(date.getDate() - 7);
        break;
      case '1m':
        date.setMonth(date.getMonth() - 1);
        break;
      case '2m':
        date.setMonth(date.getMonth() - 2);
        break;
      case '3m':
        date.setMonth(date.getMonth() - 3);
        break;
      case '4m':
        date.setMonth(date.getMonth() - 4);
        break;
      case '6m':
        date.setMonth(date.getMonth() - 6);
        break;
      default:
        date.setFullYear(2018);
    }
    setSince(dateFormat(date));
  }

  const changeCountryHandler = (e) => {
    setCountry(e.target.value);
  }

  const clickCountryHandler = (country) => {
    return () => setCountry(country);
  }

  const biggestChangeCountries = useMemo(() => {
    const countriesByChange = [];
    
    Object.keys(data).forEach((countryName) => {
      const dataSeriesNumber = data[countryName].deaths.length;
      if (dataSeriesNumber < 2 || excludeCountries.includes(countryName)) {
        return;
      }
      const last = data[countryName].confirmed[dataSeriesNumber - 1][1];
      const previous = data[countryName].confirmed[dataSeriesNumber - 2][1];
      const change = (last === 0)
        ? 0.0
        : (last - previous) / previous * 100;

        if (change >= 2.0) {
          countriesByChange.push([countryName, change]);
        }
    });

    countriesByChange.sort((a, b) => (b[1] - a[1]));
    return countriesByChange;
  }, []);

  const countries = useMemo(() => {
    return Object.keys(data)
      .filter(countryName => !excludeCountries.includes(countryName))
      .sort();
  }, []);

  return (
    <div className="App">
      <h1>Monitoring the Coronavirus disease 2019 spread pace</h1>
      <div className="App-source">Source code: <a target="_blank" rel="noopener noreferrer" href="https://github.com/talkrz/2019ncov">Github</a></div>
      <div className="App-source">COVID-19 data source: <a target="_blank" rel="noopener noreferrer"
          href="https://github.com/CSSEGISandData/COVID-19"
        >JHU CSSE COVID-19 Data
        </a>
      </div>

      <div className="App-filters">
        <div>
          <label>Display data from:</label>
          <select onChange={changeSinceHandler}>
            <option value="beginning">all dates</option>
            <option value="1w">last week</option>
            <option value="1m">last month</option>
            <option value="2m">last 2 months</option>
            <option value="3m">last 3 months</option>
            <option value="4m">last 4 months</option>
            <option value="6m">last 6 months</option>
            <option value="1y">last year</option>
          </select>
        </div>

        <div>
          <label>Location:</label>
          <select onChange={changeCountryHandler} value={country}>
            {countries.map((countryKey) => (
              <option key={countryKey} value={countryKey}>{countryKey}</option>
            ))}
          </select>
        </div>


      </div>

      <h2>Confirmed cases ({country})</h2>
      <Main data={data[country].confirmed} since={since} label="Confirmed cases" />

      <h2>Deaths ({country})</h2>
      <Main data={data[country].deaths} since={since} label="Deaths" />

      <h2>Countries with the biggest growth</h2>
      <div className="App-countries-biggest-change">
        {biggestChangeCountries.map((data, i) => (
          <div key={data[0]}>
            {i+1}. <a onClick={clickCountryHandler(data[0])}>
              {data[0]}
            </a> {data[1].toFixed(1)} %
          </div>

        ))}
      </div>

    </div>
  );
}



export default App;
