import React, { useRef, useMemo } from 'react';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Label,
} from 'recharts';
import './Chart.css';
import useDimensions from '../hooks/useDimensions';
import formatBigNumber from '../functions/formatBigNumber';

export default function Chart({label, chartData}) {
  const contentRef = useRef();
  const [width, height] = useDimensions(contentRef);

  const processedChartData = useMemo(() => {
    return chartData.map(dp => {
      const copy = { ...dp };
      copy.value = dp.value < 0 ? 0.0 : dp.value; // ignore negative values!
      return copy; 
    });
  }, [chartData]);

  return (
    <div className="Chart" ref={contentRef}>
    <BarChart
      width={width}
      height={height}
      data={processedChartData}
      margin={{
        top: 40, right: 20, left: 0, bottom: 40,
      }}
    >
      <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" />
      <XAxis stroke="#888888" dataKey="name">
      <Label value={label} position="bottom"></Label>
        </XAxis>
      <YAxis stroke="#888888" tickFormatter={tick => formatBigNumber(tick)}>
          
        </YAxis>
      <Tooltip />
     
      <Bar dataKey="value" fill="#8884d8">
      {
        chartData.map((entry, index) => {
          //const date = new Date(entry.name);
          //const isWeekend = date.getDay() === 0 || date.getDay() === 6;
          return (
          <Cell cursor="pointer" fill={isWeekend ? /*'#82ca9d'*/ '#8884d8' : '#8884d8'} key={`cell-${index}`} />
        )})
      }
      </Bar>
      
    </BarChart>
    </div>
  )
}
