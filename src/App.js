import React, { useState, useMemo } from 'react';
import './App.css';

import Main from './components/Main';
import data from './data/data.json';
import excludeCountries from './data/excludeCountries.json';
import CountryList from './components/CountryList';
import DateSelector from './components/DateSelector';
import CountrySelector from './components/CountrySelector';
import viewCharts from './dataProcessing/viewCharts';


function App() {
  const [since, setSince] = useState(null)
  const [country, setCountry] = useState('total');

  const countries = useMemo(() => {
    return Object.keys(data)
      .filter(countryName => !excludeCountries.includes(countryName))
      .sort();
  }, []);

  const chartsViewData = useMemo(() => viewCharts(data, country, since), [country, since]);

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
        <DateSelector onDateSelected={setSince} />
        <CountrySelector onCountrySelected={setCountry} country={country} countries={countries} />
      </div>

      <h2>Confirmed cases ({country})</h2>
      <Main casesData={chartsViewData.cases} difference={chartsViewData.casesDifference} growth={chartsViewData.casesGrowth} label="Confirmed cases" />

      <h2>Deaths ({country})</h2>
      <Main casesData={chartsViewData.deaths} difference={chartsViewData.deathsDifference} growth={chartsViewData.deathsGrowth} label="Deaths" />

      <CountryList
        label="Countries with the biggest cases change"
        data={data}
        dataSeriesKey="confirmed"
        calc={(curr, prev) => (curr === 0 ? 0.0 : (curr - prev))}
        formatter={v => v.toLocaleString()}
        setCountry={setCountry}
        excludeCountries={excludeCountries}
      />

      <CountryList
        label="Countries with the biggest growth"
        data={data}
        dataSeriesKey="confirmed"
        calc={(curr, prev) => (curr === 0 ? 0.0 : (curr - prev) / prev * 100)}
        formatter={v => v.toFixed(1).toLocaleString() + '%'}
        setCountry={setCountry}
        excludeCountries={excludeCountries}
      />

      <CountryList
        label="Countries with the biggest deaths change"
        data={data}
        dataSeriesKey="deaths"
        calc={(curr, prev) => (curr === 0 ? 0.0 : (curr - prev))}
        formatter={v => v.toLocaleString()}
        setCountry={setCountry}
        excludeCountries={excludeCountries}
      />

      <CountryList
        label="Countries with the biggest deaths growth"
        data={data}
        dataSeriesKey="deaths"
        calc={(curr, prev) => (curr === 0 ? 0.0 : (curr - prev) / prev * 100)}
        formatter={v => v.toFixed(1).toLocaleString() + '%'}
        setCountry={setCountry}
        excludeCountries={excludeCountries}
      />
    </div>
  );
}

export default App;
