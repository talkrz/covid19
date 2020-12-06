import React, { useMemo } from 'react';
import Chart from './charts/Chart';
import './CasesCharts.css';
import '../commonStyles/table.css';

export default function CasesCharts({ tableData, label }) {
  const colorPalette = [
    '#8884D9',
    '#E6CD81',
    '#87CC9D',
    '#F09182',
  ];

  // const dowDistribution = useMemo(() => {
  //   const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  //   return tableData.dayOfWeekAverages.map((number, dow) => ({
  //     name: dayNames[dow],
  //     value: number
  //   }));
  // }, [tableData]);

  const reversedTableData = useMemo(() => tableData.allInOne.slice().reverse(), [tableData])
  const chartDataCases = useMemo(() => (tableData.allInOne.map(dp => ({ name: dp[0], value: dp[1] }))), [tableData]);
  // const chartDataGrowth = useMemo(() => (tableData.allInOne.map(dp => ({ name: dp[0], value: dp[3]}))), [tableData]);
  const chartDataChange = useMemo(() => (tableData.allInOne.map(dp => ({ name: dp[0], value: dp[2] }))), [tableData]);
  // const chartDataChangeWeeklyAdjusted = useMemo(() => (tableData.allInOneWeeklyAdjusted.map(dp => ({ name: dp[0], value: dp[2] }))), [tableData]);
  const chartWeeklyCases = useMemo(() => (tableData.differenceWeekly.map(dp => ({ name: dp[0], value: dp[1]}))), [tableData]);

  return (
    <>
      <div className="Main-charts">
        <Chart color={colorPalette[0]} label={label} chartData={chartDataCases} />
        <Chart color={colorPalette[0]} label="Change" chartData={chartDataChange} ignoreNegativeValues={true} />
        <Chart color={colorPalette[0]} label="Weekly change" chartData={chartWeeklyCases} ignoreNegativeValues={true} />
      </div>

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

