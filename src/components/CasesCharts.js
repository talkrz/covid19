import React, { useEffect, useState, useMemo } from 'react';
import Chart from './charts/Chart';
import './CasesCharts.css';
import '../commonStyles/table.css';
import WeekDistributionChart from './charts/WeekDistributionChart';
import averageByDayOfWeek from '../dataProcessing/aggregate';

export default function CasesCharts({ tableData, label }) {
  const [chartDataCases, setChartDataCases] = useState([]);
  const [chartDataGrowth, setChartDataGrowth] = useState([]);
  const [chartDataChange, setChartDataChange] = useState([]);

  const colorPalette = [
    '#8884D9',
    '#E6CD81',
    '#87CC9D',
    '#F09182',
  ];

  const dowDistribution = useMemo(() => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dowDist = averageByDayOfWeek(tableData);
    return dowDist.map((number, dow) => {
      return {
        name: dayNames[dow],
        value: number
      }
    });
  }, [tableData]);

  const reversedTableData = useMemo(() => tableData.slice().reverse(), [tableData])

  useEffect(() => {
    setChartDataCases(tableData.map(dp => ({
      name: dp[0],
      value: dp[1]
    })));

    setChartDataGrowth(tableData.map(dp => ({
      name: dp[0],
      value: dp[3]
    })));

    setChartDataChange(tableData.map(dp => ({
      name: dp[0],
      value: dp[2]
    })));
  }, [tableData]);

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
            {reversedTableData.map((dataPoint) => (
              <tr key={dataPoint[0]}>
                <td className="Main-date">{dataPoint[0]}</td>
                <td className="Main-number">{dataPoint[1].toLocaleString()}</td>
                <td className="Main-number">{dataPoint[2].toLocaleString()}</td>
                <td className="Main-number">{dataPoint[3].toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="Main-divider"></hr>
    </>
  )
}

