import { dateSince } from "./filters";
import { normalizeDate } from "./mappers";
import { calculateDifference, calculatePercentGrowth } from "./growth";

const makeDataForCharts = (inputData, since) => (
  inputData
    .map(normalizeDate)
    .filter(dateSince(since))
);

export default function viewCharts(data, country, since) {
  const cases = makeDataForCharts(data[country].confirmed, since);
  const deaths = makeDataForCharts(data[country].deaths, since);

  const casesValues = cases.map(dataPoint => dataPoint[1]);
  const deathsValues = deaths.map(dataPoint => dataPoint[1]);

  const casesDifference = calculateDifference(casesValues);
  const deathsDifference = calculateDifference(deathsValues);
  const casesGrowth = calculatePercentGrowth(casesValues);
  const deathsGrowth = calculatePercentGrowth(deathsValues);

  const casesAllInOne = cases.map((dataPoint, i) => {
    return [
      dataPoint[0],
      dataPoint[1],
      i === 0 ? 0 : casesDifference[i - 1],
      i === 0 ? 0 : casesGrowth[i - 1]
    ]
  });

  const deathsAllInOne = deaths.map((dataPoint, i) => {
    return [
      dataPoint[0],
      dataPoint[1],
      i === 0 ? 0 : deathsDifference[i - 1],
      i === 0 ? 0 : deathsGrowth[i - 1]
    ]
  });

  return {
    cases,
    deaths,
    casesAllInOne,
    deathsAllInOne,
  }
}