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

  const style = {
    light: {
      axesColor: "#aaa",
      axesFontSize: "14px",
      gridColor: "#f0f0f0",
    },
  }

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
      <CartesianGrid vertical={false} stroke={style.light.gridColor} strokeDasharray="3 3" />
      <XAxis tick={{fontSize: style.light.axesFontSize}} stroke={style.light.axesColor} dataKey="name">
      <Label value={label} position="bottom"></Label>
        </XAxis>
      <YAxis tick={{fontSize: style.light.axesFontSize}} stroke={style.light.axesColor} tickFormatter={tick => formatBigNumber(tick)}>
        </YAxis>
      <Tooltip />
     
      <Bar dataKey="value" fill={color}>
      </Bar>
      
    </BarChart>
    </div>
  )
}
