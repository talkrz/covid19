import React, { useEffect, useState } from 'react';
import MathJax from 'react-mathjax';
import './App.css';

import Main from './components/Main';

import data from './data/cumulative-china.json';
import dataRest from './data/cumulative-outside-china.json';
import dataByProvince from './data/new-china-by-province.json';

/**
 * A lot of shitty data juggling
 */
function prepareProvincesData(dataByProvince) {
  const result = {};

  dataByProvince.forEach(dayData => {
    const date = dayData['Date (CST)'];
    Object.keys(dayData).forEach(key => {
      if (key !== 'Date (CST)') {
        if (result[key] === undefined) {
          result[key] = [];
        }


        if (dayData[key] !== '') {
          result[key].push([
            date, dayData[key],
          ]);
        }
      }
    })
  });

  const resultArray = [];
  Object.keys(result).forEach(province => {

    let previousValue = 0.0;
    const cumulativeResult = result[province].map((dayRow) => {
      const newValue = dayRow[1] + previousValue;
      const newRow = [ dayRow[0], newValue];
      previousValue = newValue;
      return newRow;
    })

    resultArray.push({
      province,
      data: cumulativeResult,
    })
  })

  return resultArray;
}

function App() {
  const [byProvince, setByProvince] = useState([]);
  const [chosenProvince, chooseProvince] = useState(0);

  useEffect(() => {
    setByProvince(prepareProvincesData(dataByProvince));
  }, []);


  return (
    <div className="App">
      <h1>Monitoring the Wuhan virus spread pace</h1>
      <a target="_blank" rel="noopener noreferrer" href="https://github.com/talkrz/2019ncov">Github</a>

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

      <h2>China by provinces</h2>
      <div className="App-select-province">
        {byProvince.map((provinceData, i) => (
          <button
            key={provinceData.province}
            className={`App-select-button${i === chosenProvince ? ' App-select-button-selected' : ''}`}
            onClick={() => chooseProvince(i)}
          >
            {provinceData.province}
          </button>
        ))}
      </div>
      <p>Source: <a target="_blank" rel="noopener noreferrer"
          href="https://en.wikipedia.org/wiki/Timeline_of_the_2019%E2%80%9320_Wuhan_coronavirus_outbreak"
        >wikipedia.org
        </a>
      </p>
      {byProvince[chosenProvince] !== undefined && <Main data={byProvince[chosenProvince].data} />}

      <MathJax.Provider>
        <p className="Main-description">
          The forcast is calculated assuming number of cases follows exponential
          growth <MathJax.Node inline="true" formula="x(t) = e^{kt}"></MathJax.Node> where
          k is the "growth constant".
          For the exponential function k is constant. However in real life scenarios,
          like the virus outbreak, the exponential function is only an approximation.
          The real function is unknown, we don't know the time when the first infection occured,
          the data isn't accurate and complete either.

          Thus we defined the "growth factor" as rate of change of the
          exponent of infections.
        </p>
      </MathJax.Provider>
    </div>
  );
}

export default App;
