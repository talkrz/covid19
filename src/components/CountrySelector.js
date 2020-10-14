import React, { useEffect, useState } from 'react';
import Autosuggest from 'react-autosuggest';
import './CountrySelector.css';

export default function CountrySelector({ onCountrySelected, country, countries }) {
  const [suggestions, setSuggestions] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    setInputValue(country === 'total' ? '' : country);
  }, [country]);

  const searchCountries = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : countries.filter(c =>
      c.toLowerCase().includes(inputValue)
    ).slice(0, 20);
  };

  const onChange = (event, { newValue }) => {
    setInputValue(newValue);
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(searchCountries(value));
  };

  const inputProps = {
    placeholder: 'Country',
    value: inputValue,
    onChange,
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const onSuggestionSelected = (event, {suggestion}) => {
    onCountrySelected(suggestion);
  }

  const renderSuggestion = suggestion => (
    <div>
      {suggestion}
    </div>
  );

  return (
    <div className="CountrySelector">
      <label>Location:</label>
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        onSuggestionSelected={onSuggestionSelected}
        getSuggestionValue={(suggestion) => (suggestion)}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
    </div>
  )
}