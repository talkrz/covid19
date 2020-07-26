import React, { useEffect, useState, useMemo } from 'react';
import Chart from './Chart';
import './Main.css';
import dateFormat from '../functions/dateFormat';
import parseDate from '../functions/parseDate';

export default function Main({ data, since, label }) {
  const [chartDataCases, setChartDataCases] = useState([]);
  const [chartDataGrowth, setChartDataGrowth] = useState([]);

  const visibleDataSeries = useMemo(() => {
    const extendedData = calculateGrowth(data);

    return extendedData
      .map(normalizeDate)
      .filter(dateSince(since));
  }, [data, since]);

  const avgGrowth = useMemo(() => {
    const lastNElements = 2;
    return visibleDataSeries.slice(-lastNElements).reduce((acc, curr) => {
      return acc + curr[4];
    }, 0.0) / lastNElements;
  }, [visibleDataSeries]);

  const forecast = useMemo(() => {
    const lastNElements = 2;
    const avgExponent = visibleDataSeries.slice(-lastNElements).reduce((acc, curr) => {
      return acc + curr[3];
    }, 0.0) / lastNElements;

    return Math.pow(Math.E, Math.log(visibleDataSeries[visibleDataSeries.length - 1][1]) + avgExponent);
  }, [visibleDataSeries])
  

  useEffect(() => {
    setChartDataCases(visibleDataSeries.map(dp => ({
      name: dp[0],
      value: dp[1]
    })).concat([
      {
        name: 'forecast',
        isForecast: true,
        value: forecast.toFixed(),
      }
    ]));

    setChartDataGrowth(visibleDataSeries.map(dp => ({
      name: dp[0],
      value: dp[4]
    })).concat([
      {
        name: 'forecast',
        isForecast: true,
        value: avgGrowth.toFixed(3),
      }
    ]));
  }, [visibleDataSeries, forecast, avgGrowth]);

  return (
    <>
      <div className="Main-tableContainer">
        <table className="Main-table">
          <thead>
            <tr>
              <th className="Main-date">Date</th>
              <th className="Main-number">{label}</th>
              <th className="Main-number">Change</th>
            </tr>
          </thead>

          <tbody>
            {visibleDataSeries.map(dataPoint => (
              <tr key={dataPoint[0]}>
                <td className="Main-date">{dataPoint[0]}</td>
                <td className="Main-number">{dataPoint[1].toLocaleString()}</td>
                <td className="Main-number">{dataPoint[4].toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="Main-charts">
        <Chart label={label} chartData={chartDataCases} />
        <Chart label="Change" chartData={chartDataGrowth} />
      </div>
      <div className="Main-prediction">
        <div>Avg change: {avgGrowth.toFixed(3)}%</div>
        <div>Predicted next value: {forecast.toFixed()}</div>
      </div>
      <hr className="Main-divider"></hr>
    </>
  )
}

function calculateGrowth(data) {
  return data.map((dataPoint, i) => {
    const exp = Math.log(dataPoint[1]);
    const diff = i === 0
      ? 0.0
      : Math.log(data[i][1]) - Math.log(data[i-1][1]);

    const growth = (i === 0 || data[i-1][1] === 0)
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

function normalizeDate(dataPoint) {
  const result = dataPoint.slice();
  result[0] = dateFormat(new Date(parseDate(dataPoint[0])));
  return result;
}

function dateSince(since) {
  return (dataPoint) => {
    return since === null || dataPoint[0] > since;
  }
}