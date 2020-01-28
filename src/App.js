import React from 'react';
import MathJax from 'react-mathjax';
import './App.css';

import Main from './components/Main';


const data = [
  ['2020-01-16', 45],
  ['2020-01-17', 62],
  ['2020-01-18', 121],
  ['2020-01-19', 198],
  ['2020-01-20', 291],
  ['2020-01-21', 440],
  ['2020-01-22', 571],
  ['2020-01-23', 830],
  ['2020-01-24', 1287],
  ['2020-01-25', 1975],
  ['2020-01-26', 2744],
  ['2020-01-27', 4515],
]

const dataRest = [
  ['2020-01-20', 4],
  ['2020-01-21', 6],
  ['2020-01-22', 8],
  ['2020-01-23', 14],
  ['2020-01-24', 25],
  ['2020-01-25', 40],
  ['2020-01-26', 57],
  ['2020-01-27', 64],
  ['2020-01-28', 80],
]

function App() {


  return (
    <div className="App">
      <h1>Monitoring the Wuhan virus spread pace</h1>
      <h2>China</h2>
      <p>Source: <a target="_blank" rel="noopener noreferrer"
          href="https://en.wikipedia.org/wiki/Timeline_of_the_2019–20_Wuhan_coronavirus_outbreak"
        >wikipedia.org
        </a>
      </p>
      <Main data={data} />
      <h2>Rest of the world</h2>
      <p>Source: <a target="_blank" rel="noopener noreferrer"
          href="https://gisanddata.maps.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6"
        >gisanddata.maps.arcgis.com
        </a>
      </p>
      <Main data={dataRest} />
      <MathJax.Provider>
        <p className="Main-description">The forcast is calculated assuming number of cases follows exponential growth <MathJax.Node inline="true" formula="x(t) = e^{kt}"></MathJax.Node> where k is the "growth factor"</p>
      </MathJax.Provider>
    </div>
  );
}

export default App;
