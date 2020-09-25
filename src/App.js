import React, { useState, useMemo } from 'react';
import './App.css';

import Main from './components/Main';
import data from './data/data.json';
import excludeCountries from './data/excludeCountries.json';
import dateFormat from './functions/dateFormat';
import CountryList from './components/CountryList';



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

      <CountryList
        label="Countries with the biggest cases change"
        data={data}
        dataSeriesKey="confirmed"
        calc={(curr, prev) => (curr === 0 ? 0.0 : (curr - prev))}
        formatter={v => v.toLocaleString() + ' cases'}
        setCountry={setCountry}
        excludeCountries={excludeCountries}
      />

      <CountryList
        label="Countries with the biggest growth"
        data={data}
        dataSeriesKey="confirmed"
        calc={(curr, prev) => (curr === 0 ? 0.0 : (curr - prev) / prev * 100)}
        formatter={v => v.toFixed(1).toLocaleString() + ' %'}
        setCountry={setCountry}
        excludeCountries={excludeCountries}
      />

      <CountryList
        label="Countries with the biggest deaths change"
        data={data}
        dataSeriesKey="deaths"
        calc={(curr, prev) => (curr === 0 ? 0.0 : (curr - prev))}
        formatter={v => v.toLocaleString() + ' deaths'}
        setCountry={setCountry}
        excludeCountries={excludeCountries}
      />

      <CountryList
        label="Countries with the biggest deaths growth"
        data={data}
        dataSeriesKey="deaths"
        calc={(curr, prev) => (curr === 0 ? 0.0 : (curr - prev) / prev * 100)}
        formatter={v => v.toFixed(1).toLocaleString() + ' %'}
        setCountry={setCountry}
        excludeCountries={excludeCountries}
      />
    </div>
  );
}



export default App;
