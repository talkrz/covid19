import React, { useState, useMemo } from 'react';
import data from '../../data/data.json';
import excludeCountries from '../../data/excludeCountries.json';
import viewCharts from '../../dataProcessing/viewCharts';
import viewCountryLists from '../../dataProcessing/viewCountryLists';
import CasesCharts from '../CasesCharts';
import CountryList from '../CountryList';
import DateSelector from '../DateSelector';
import CountrySelector from '../CountrySelector';
import './HomePage.css';

export default function HomePage() {
  const [since, setSince] = useState(null)
  const [country, setCountry] = useState('total');

  const countries = useMemo(() => {
    return Object.keys(data)
      .filter(countryName => !excludeCountries.includes(countryName))
      .sort();
  }, []);

  const chartsViewData = useMemo(() => viewCharts(data, country, since), [country, since]);
  const countryLists = useMemo(() => viewCountryLists(data, excludeCountries), []);

  return (
    <div className="HomePage">
      <h1>Monitoring the Coronavirus disease 2019 spread pace</h1>

      <div className="HomePage-source">Source code: <a target="_blank" rel="noopener noreferrer" href="https://github.com/talkrz/2019ncov">Github</a></div>
      <div className="HomePage-source">COVID-19 data source: <a target="_blank" rel="noopener noreferrer"
          href="https://github.com/CSSEGISandData/COVID-19"
        >JHU CSSE COVID-19 Data
        </a>
      </div>

      <div className="HomePage-filters">
        <DateSelector onDateSelected={setSince} />
        <CountrySelector onCountrySelected={setCountry} country={country} countries={countries} />
      </div>

      <h2>Confirmed cases ({country})</h2>
      <CasesCharts
        label="Confirmed cases"
        tableData={chartsViewData.cases}
      />

      <h2>Deaths ({country})</h2>
      <CasesCharts
        label="Deaths"
        tableData={chartsViewData.deaths}
      />

      <CountryList
        label="Countries with the biggest cases change"
        countryList={countryLists.casesDifference}
        formatter={v => v.toLocaleString()}
        setCountry={setCountry}
      />

      <CountryList
        label="Countries with the biggest growth"
        countryList={countryLists.casesPercentage}
        formatter={v => v.toFixed(1).toLocaleString() + '%'}
        setCountry={setCountry}
      />

      <CountryList
        label="Countries with the biggest deaths change"
        countryList={countryLists.deathsDifference}
        formatter={v => v.toLocaleString()}
        setCountry={setCountry}
      />

      <CountryList
        label="Countries with the biggest deaths growth"
        countryList={countryLists.deathsPercentage}
        formatter={v => v.toFixed(1).toLocaleString() + '%'}
        setCountry={setCountry}
      />
    </div>
  )
}