import React from 'react';


export default function CountrySelector({ onCountrySelected, country, countries }) {

  const changeCountryHandler = (e) => {
    onCountrySelected(e.target.value);
  }

  return (
    <div>
      <label>Location:</label>
      <select onChange={changeCountryHandler} value={country}>
        {countries.map((countryKey) => (
          <option key={countryKey} value={countryKey}>{countryKey}</option>
        ))}
      </select>
    </div>
  )
}