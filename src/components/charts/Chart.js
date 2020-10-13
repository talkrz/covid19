import React, { useRef, useMemo } from 'react';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Label,
} from 'recharts';
import './Chart.css';
import useDimensions from '../../hooks/useDimensions';
import formatBigNumber from '../../functions/formatBigNumber';

export default function Chart({color, label, chartData}) {
  const contentRef = useRef();
  const [width, height] = useDimensions(contentRef);

  const style = {
    light: {
      axesColor: "#aaa",
      axesFontSize: "14px",
      gridColor: "#f0f0f0",
    },
  }

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
      <CartesianGrid vertical={false} stroke={style.light.gridColor} strokeDasharray="2 3" />
      <XAxis tick={{fontSize: style.light.axesFontSize}} stroke={style.light.axesColor} dataKey="name">
      <Label value={label} position="bottom"></Label>
        </XAxis>
      <YAxis tick={{fontSize: style.light.axesFontSize}} stroke={style.light.axesColor} tickFormatter={tick => formatBigNumber(tick)}>
          
        </YAxis>
      <Tooltip />
     
      <Bar dataKey="value" fill={color}>
      {
        chartData.map((entry, index) => {
          //const date = new Date(entry.name);
          //const isWeekend = date.getDay() === 0 || date.getDay() === 6;
          return (
          <Cell cursor="pointer" fill={color} key={`cell-${index}`} />
        )})
      }
      </Bar>
      
    </BarChart>
    </div>
  )
}
