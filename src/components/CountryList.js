import React, { useMemo } from 'react';
import './CountryList.css';

// this component is crappy refactor result
function makeCountryList(data, dataSeriesKey, calc, excludeCountries) {
  const list = [];

  Object.keys(data).forEach((countryName) => {

    const dataSeries = data[countryName][dataSeriesKey];

    const dataSeriesNumber = dataSeries.length;
    if (dataSeriesNumber < 2 || excludeCountries.includes(countryName)) {
      return;
    }
    const last = dataSeries[dataSeriesNumber - 1][1];
    const previous = dataSeries[dataSeriesNumber - 2][1];
    const change = calc(last, previous);

    list.push([countryName, change]);

  });

  list.sort((a, b) => (b[1] - a[1]));

  return list;
}


export default function CountryList({label, data, dataSeriesKey, calc, formatter, setCountry, excludeCountries}) {
  const clickCountryHandler = (country) => {
    return () => setCountry(country);
  }

  const biggestChangeCountries = useMemo(() => makeCountryList(data, dataSeriesKey, calc, excludeCountries), []);

  return (
    <>
      <h2>{label}</h2>
      <div className="CountryList-biggest-change">
        {biggestChangeCountries.slice(0, 25).map((data, i) => (
          <div key={data[0]}>
            {i+1}. <a onClick={clickCountryHandler(data[0])}>
              {data[0]}
            </a> {formatter(data[1])}
          </div>

        ))}
      </div>
    </>
  )
}