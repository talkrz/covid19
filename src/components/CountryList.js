import React from 'react';
import './CountryList.css';
import '../commonStyles/table.css';

export default function CountryList({label, countryList, formatter, setCountry}) {
  const clickCountryHandler = (country) => {
    return () => {
      setCountry(country);
      window.scrollTo(0, 0);
    }
  }

  return (
    <>
      <h2 className="CountryList-header">{label}</h2>

      <table className="beautiful-table">
        <thead>
          <tr>
            <th className="CountryList-number">No.</th>
            <th className="CountryList-name">Country</th>
            <th className="CountryList-number">Value</th>
          </tr>
        </thead>
        <tbody>
          {countryList.slice(0, 25).map((data, i) => (
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