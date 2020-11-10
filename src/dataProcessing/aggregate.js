import { aperture } from "ramda";

export function averageByDayOfWeek(data) {
  const sumByDayOfWeek = (acc, dataPoint) => {
    const date = new Date(dataPoint[0]);
    const dow = date.getDay();

    acc[dow][0] += dataPoint[2];
    acc[dow][1]++;
    return acc;
  }

  const sums = data.reduce(sumByDayOfWeek, [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]);

  return sums.map(sum => sum[0] /= sum[1]);
}

export function movingAverage(data, number) {
  const result = aperture(number, data).map((part) => part.reduce((acc, curr) => (acc + (curr > 0 ? curr : 0)), 0) / part.length);
  const diff = data.length - result.length;
  for(let i = 0; i < diff; ++i) {
    result.unshift(0);
  }
  return result;
}