export default function averageByDayOfWeek(data) {
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