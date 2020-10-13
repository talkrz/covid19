import React, { useEffect, useState, useMemo } from 'react';
import Chart from './Chart';
import './Main.css';
import '../commonStyles/table.css';
import dateFormat from '../functions/dateFormat';
import parseDate from '../functions/parseDate';
import WeekDistributionChart from './charts/WeekDistributionChart';

export default function Main({ data, since, label }) {
  const [chartDataCases, setChartDataCases] = useState([]);
  const [chartDataGrowth, setChartDataGrowth] = useState([]);
  const [chartDataChange, setChartDataChange] = useState([]);

  const colorPalette = [
    '#8884D9',
    '#E6CD81',
    '#87CC9D',
    '#F09182',
  ];

  const visibleDataSeries = useMemo(() => {
    const extendedData = calculateGrowth(data);

    return extendedData
      .map(normalizeDate)
      .filter(dateSince(since));
  }, [data, since]);

  const dowDistribution = useMemo(() => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dowDist = calculateDowDistribution(visibleDataSeries);
    return dowDist.map((number, dow) => {
      return {
        name: dayNames[dow],
        value: number
      }
    });
  }, [visibleDataSeries]);

  useEffect(() => {
    setChartDataCases(visibleDataSeries.map(dp => ({
      name: dp[0],
      value: dp[1]
    })));

    setChartDataGrowth(visibleDataSeries.map(dp => ({
      name: dp[0],
      value: dp[4]
    })));

    setChartDataChange(visibleDataSeries.map(dp => ({
      name: dp[0],
      value: dp[5]
    })));
  }, [visibleDataSeries]);

  return (
    <>
      <div className="Main-charts">
        <Chart color={colorPalette[0]} label={label} chartData={chartDataCases} />
        <Chart color={colorPalette[0]} label="Change" chartData={chartDataChange} />
        <Chart color={colorPalette[0]} label="Change in %" chartData={chartDataGrowth} />
      </div>

      <h3>Weekly oscillation</h3>
      <WeekDistributionChart color={colorPalette[1]} label="Averages by day of week" chartData={dowDistribution} />

      <h3>Data points</h3>
      <div className="Main-tableContainer">
        <table className="beautiful-table">
          <thead>
            <tr>
              <th className="Main-date">Date</th>
              <th className="Main-number">{label}</th>
              <th className="Main-number">Change</th>
              <th className="Main-number">Change (%)</th>
            </tr>
          </thead>

          <tbody>
            {visibleDataSeries.slice().reverse().map(dataPoint => (
              <tr key={dataPoint[0]}>
                <td className="Main-date">{dataPoint[0]}</td>
                <td className="Main-number">{dataPoint[1].toLocaleString()}</td>
                <td className="Main-number">{dataPoint[5].toLocaleString()}</td>
                <td className="Main-number">{dataPoint[4].toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="Main-divider"></hr>
    </>
  )
}

function calculateDowDistribution(data) {
  const weekArray = () => ([0, 0, 0, 0, 0, 0, 0]);
  const reduceResult = data.reduce((acc, curr) => {
    const date = new Date(curr[0]);
    const dow = date.getDay();
    acc['numberOfCases'][dow] += curr[5];
    acc['numberOfDataPoints'][dow]++;
    return acc;
  }, {
    numberOfCases: weekArray(),
    numberOfDataPoints: weekArray(),
  });

  const result = weekArray();
  reduceResult['numberOfDataPoints'].forEach((_, dow) => {
    result[dow] = reduceResult['numberOfCases'][dow] / reduceResult['numberOfDataPoints'][dow];
  });

  return result;
}

function calculateGrowth(data) {
  return data.map((dataPoint, i) => {
    const exp = Math.log(dataPoint[1]);
    const diff = i === 0
      ? 0.0
      : Math.log(data[i][1]) - Math.log(data[i-1][1]);
    
    const difference = i === 0
      ? 0
      : data[i][1] - data[i-1][1];

    const growth = (i === 0 || data[i-1][1] === 0)
      ? 0.0
      : (data[i][1] - data[i-1][1]) / data[i-1][1] * 100;
    return [
      dataPoint[0], // date
      dataPoint[1], // number of cases
      exp, // exponent of function
      diff, // derivative of the exponent aka growth rate
      growth, // growth in %
      difference, // change between currend and previous value
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