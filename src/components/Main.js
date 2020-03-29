import React, { useEffect, useState } from 'react';
import Chart from './Chart';
import './Main.css';

function calculateExponent(data) {
  return data.map((dataPoint, i) => {
    const exp = Math.log(dataPoint[1]);
    const diff = i === 0
      ? 0.0
      : Math.log(data[i][1]) - Math.log(data[i-1][1]);
    const growth = i === 0
      ? 0.0
      : (data[i][1] - data[i-1][1]) / data[i-1][1] * 100;
    return [
      dataPoint[0], // date
      dataPoint[1], // number of cases
      exp, // exponent of function
      diff, // derivative of the exponent aka growth rate
      growth, // growth in %
    ]
  })
}

export default function Main({ data }) {
  const [table, setTable] = useState([]);
  const [avgGrowth, setAvgGrowth] = useState(0.0);
  const [predictedValue, setPredictedValue] = useState(0.0);
  const [chartDataCases, setChartDataCases] = useState([]);
  const [chartDataGrowth, setChartDataGrowth] = useState([]);

  useEffect(() => {
    const tableData = calculateExponent(data);
    setTable(tableData);

    const lastNElements = 2;
    const avgExponent = tableData.slice(-lastNElements).reduce((acc, curr) => {
      return acc + curr[3];
    }, 0.0) / lastNElements;

    const avgChange = tableData.slice(-lastNElements).reduce((acc, curr) => {
      return acc + curr[4];
    }, 0.0) / lastNElements;
 
    const forecast = Math.pow(Math.E, Math.log(data[data.length - 1][1]) + avgExponent);
    
    setChartDataCases(data.map(dp => ({
      name: dp[0],
      value: dp[1]
    })).concat([
      {
        name: 'forecast',
        isForecast: true,
        value: forecast.toFixed(),
      }
    ]));

    setChartDataGrowth(tableData.map(dp => ({
      name: dp[0],
      value: dp[4]
    })).concat([
      {
        name: 'forecast',
        isForecast: true,
        value: avgChange.toFixed(3),
      }
    ]));
    

    setAvgGrowth(avgChange);
    setPredictedValue(forecast)
  }, [data])
  return (
    <>
      <table className="Main-table">
        <thead>
          <tr>
            <th className="Main-date">Date</th>
            <th className="Main-number">Confirmed cases</th>
            <th className="Main-number">Change</th>
          </tr>
        </thead>
      
        <tbody>
          {table.map(dataPoint => (
            <tr key={dataPoint[0]}>
              <td className="Main-date">{dataPoint[0]}</td>
              <td className="Main-number">{dataPoint[1]}</td>
              <td className="Main-number">{dataPoint[4].toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="Main-charts">
        <Chart label="Confirmed cases" chartData={chartDataCases} />
        <Chart label="Change" chartData={chartDataGrowth} />
      </div>
      <div className="Main-prediction">
        <div>Avg change: {avgGrowth.toFixed(3)}%</div>
        <div>Predicted next value: {predictedValue.toFixed()}</div>
      </div>
      <hr className="Main-divider"></hr>
    </>
  )
}