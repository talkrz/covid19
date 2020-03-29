import React from 'react';
import './App.css';

import Main from './components/Main';
import data from './data/data.json';

function App() {

  return (
    <div className="App">
      <h1>Monitoring the Coronavirus disease 2019 spread pace</h1>
      <a target="_blank" rel="noopener noreferrer" href="https://github.com/talkrz/2019ncov">Github</a>

      <h2>Total cases</h2>

      <p>Source: <a target="_blank" rel="noopener noreferrer"
          href="https://gisanddata.maps.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6"
        >gisanddata.maps.arcgis.com
        </a>
      </p>

      <Main data={data['total'].confirmed} />

      <h2>Total deaths</h2>

      <p>Source: <a target="_blank" rel="noopener noreferrer"
          href="https://gisanddata.maps.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6"
        >gisanddata.maps.arcgis.com
        </a>
      </p>
      <Main data={data['total'].deaths} />
    </div>
  );
}



export default App;
