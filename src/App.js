import React, { useState } from 'react';
import './App.css';

import Main from './components/Main';
import data from './data/data.json';
import dateFormat from './functions/dateFormat';

function App() {
  const [since, setSince] = useState(null)

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
      case '6m':
        date.setMonth(date.getMonth() - 6);
        break;
      default:
        date.setFullYear(2018);
    }
    setSince(dateFormat(date));
  }
  return (
    <div className="App">
      <h1>Monitoring the Coronavirus disease 2019 spread pace</h1>
      <a target="_blank" rel="noopener noreferrer" href="https://github.com/talkrz/2019ncov">Github</a>

      <div className="App-filters">
        <label>Display data from:</label>
        <select onChange={changeSinceHandler}>
          <option value="beginning">all dates</option>
          <option value="1w">last week</option>
          <option value="1m">last month</option>
          <option value="2m">last 2 months</option>
          <option value="3m">last 3 months</option>
          <option value="6m">last 6 months</option>
          <option value="1y">last year</option>
        </select>
      </div>
      <h2>Total cases</h2>

      <p>Source: <a target="_blank" rel="noopener noreferrer"
          href="https://gisanddata.maps.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6"
        >gisanddata.maps.arcgis.com
        </a>
      </p>

      <Main data={data['total'].confirmed} since={since} />

      <h2>Total deaths</h2>

      <p>Source: <a target="_blank" rel="noopener noreferrer"
          href="https://gisanddata.maps.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6"
        >gisanddata.maps.arcgis.com
        </a>
      </p>
      <Main data={data['total'].deaths} since={since} />
    </div>
  );
}



export default App;
