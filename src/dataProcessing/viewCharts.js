import { dateSince } from "./filters";
import { normalizeDate } from "./mappers";
import { calculateDifference, calculatePercentGrowth } from "./growth";
import { averageByDayOfWeek, movingAverage } from "./aggregate";

const makeDataForCharts = (inputData, since) => (
  inputData
    .map(normalizeDate)
    .filter(dateSince(since))
    .sort((a, b) => {
      if (a[0] > b[0]) return 1;
      if (a[0] < b[0]) return -1;
      return 0;
    })
);

function makeView(data, country, since, dataPointType) {
  const cumulative = makeDataForCharts(data[country][dataPointType], since);
  const cumulativeFlat = cumulative.map(dataPoint => dataPoint[1]);

  const difference = calculateDifference(cumulativeFlat);
  const growth = calculatePercentGrowth(cumulativeFlat);

  const weeklyAverage = movingAverage(difference, 7);

  const allInOne = cumulative.map((dataPoint, i) => {
    return [
      dataPoint[0],
      dataPoint[1],
      i === 0 ? 0 : difference[i - 1],
      i === 0 ? 0 : growth[i - 1],
      i === 0 ? 0 : weeklyAverage[i - 1]
    ]
  });

  const dayOfWeekAverages = averageByDayOfWeek(allInOne);


  const weeklyMean = dayOfWeekAverages.reduce((acc, curr) => (acc + (curr > 0 ? curr : 0)), 0) / dayOfWeekAverages.length;
  const adjustmentCoefficients = dayOfWeekAverages.map(v => (v > 0 ? v : 0) / weeklyMean);

  const allInOneWeeklyAdjusted = cumulative.map((dataPoint, i) => {
    const date = new Date(dataPoint[0]);
    const dow = date.getDay();

    return [
      dataPoint[0],
      dataPoint[1],
      i === 0 ? 0 : difference[i - 1] / (adjustmentCoefficients[dow] > 0 ? adjustmentCoefficients[dow] : 1),
      i === 0 ? 0 : growth[i - 1],
    ]
  });

  const differenceWeekly = [];
  let tmpSum = 0;
  allInOne.forEach((dataPoint, i) => {
    const date = new Date(dataPoint[0]);
    const dow = date.getDay();
    tmpSum += dataPoint[2];
    if (dow === 0 || i === allInOne.length - 1) {
      differenceWeekly.push([dataPoint[0], tmpSum]);
      tmpSum = 0;
    }
  });

  return {
    cumulative,
    difference,
    growth,
    allInOne,
    dayOfWeekAverages,
    allInOneWeeklyAdjusted,
    differenceWeekly,
  }
}

export default function viewCharts(data, country, since) {
  return {
    cases: makeView(data, country, since, 'confirmed'),
    deaths: makeView(data, country, since, 'deaths'),
  }
}