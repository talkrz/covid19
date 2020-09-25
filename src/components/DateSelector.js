import React from 'react';
import dateFormat from '../functions/dateFormat';

export default function DateSelector({ onDateSelected }) {

  const changeDateHandler = (e) => {
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
    onDateSelected(dateFormat(date));
  }

  return (
    <div>
      <label>Display data from:</label>
      <select onChange={changeDateHandler}>
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
  )
}