import React, { useRef } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Label,
} from 'recharts';
import './WeekDistributionChart.css';
import useDimensions from '../../hooks/useDimensions';
import formatBigNumber from '../../functions/formatBigNumber';

export default function WeekDistributionChart({color, label, chartData}) {
  const contentRef = useRef();
  const [width, height] = useDimensions(contentRef);

  return (
    <div className="WeekDistributionChart" ref={contentRef}>
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
      <YAxis stroke="#888888" tickFormatter={tick => formatBigNumber(tick)}>
          
        </YAxis>
      <Tooltip />
     
      <Bar dataKey="value" fill={color}>
      </Bar>
      
    </BarChart>
    </div>
  )
}
