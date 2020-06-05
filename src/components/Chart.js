import React, { useRef } from 'react';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Label,
} from 'recharts';
import './Chart.css';
import useDimensions from '../hooks/useDimensions';

export default function Chart({label, chartData}) {
  const contentRef = useRef();
  const [width, height] = useDimensions(contentRef);
  console.log(chartData)
  return (
    <div className="Chart" ref={contentRef}>
    <BarChart
      width={width}
      height={height}
      data={chartData}
      margin={{
        top: 40, right: 20, left: 0, bottom: 40,
      }}
    >
      <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" />
      <XAxis stroke="#888888" dataKey="name">
      <Label value={label} position="bottom"></Label>
        </XAxis>
      <YAxis stroke="#888888" tickFormatter={tick => {
        let unit = '';

        if (tick > 1000000) {
          tick = tick / 1000000;
          unit = 'M';
        } else if (tick > 1000) {
          tick = tick / 1000;
          unit = 'k';
        }
          return tick.toLocaleString() + unit;
        }}>
          
        </YAxis>
      <Tooltip />
     
      <Bar dataKey="value" fill="#8884d8">
      {
        chartData.map((entry, index) => (
          <Cell cursor="pointer" fill={entry.isForecast ? '#82ca9d' : '#8884d8'} key={`cell-${index}`} />
        ))
      }
      </Bar>
      
    </BarChart>
    </div>
  )
}
