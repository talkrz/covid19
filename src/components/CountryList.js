import React, { useMemo } from 'react';
import './CountryList.css';
import '../commonStyles/table.css';

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
    return () => {
      setCountry(country);
      window.scrollTo(0, 0);
    }
  }

  const biggestChangeCountries = useMemo(
    () => makeCountryList(data, dataSeriesKey, calc, excludeCountries),
    [data, dataSeriesKey, calc, excludeCountries]
  );

  return (
    <>
      <h2>{label}</h2>

      <table className="beautiful-table">
        <thead>
          <tr>
            <th className="CountryList-number">No.</th>
            <th className="CountryList-name">Country</th>
            <th className="CountryList-number">Value</th>
          </tr>
        </thead>
        <tbody>
          {biggestChangeCountries.slice(0, 25).map((data, i) => (
            <tr key={data[0]}>
              <td>{i+1}.</td>
              <td className="CountryList-name"><span className="CountryList-set-country" onClick={clickCountryHandler(data[0])}>{data[0]}</span></td>
              <td className="CountryList-number">{formatter(data[1])}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}