import { difference, percentGrowth } from "./growth";
import { normalizeDate } from "./mappers";

function makeCountryList(data, dataSeriesKey, calc, excludeCountries) {
  const list = [];

  Object.keys(data)
    .filter(countryName => !excludeCountries.includes(countryName))
    .filter(countryName => data[countryName][dataSeriesKey].length > 1)
    .forEach((countryName) => {
      const dataSeries = data[countryName][dataSeriesKey].map(normalizeDate);

      dataSeries.sort((a, b) => {
        if (a[0] > b[0]) return 1;
        if (a[0] < b[0]) return -1;
        return 0;
      })

      const dataSeriesNumber = dataSeries.length;
      const last = dataSeries[dataSeriesNumber - 1][1];
      const previous = dataSeries[dataSeriesNumber - 2][1];
      const change = calc(previous, last);

      list.push([countryName, change]);
    });

  list.sort((a, b) => (b[1] - a[1]));

  return list;
}

export default function viewCountryLists(data, excludeCountries) {
  const deathsDifference = makeCountryList(data, 'deaths', difference, excludeCountries);
  const deathsPercentage = makeCountryList(data, 'deaths', percentGrowth, excludeCountries);
  const casesDifference = makeCountryList(data, 'confirmed', difference, excludeCountries);
  const casesPercentage = makeCountryList(data, 'confirmed', percentGrowth, excludeCountries);

  return {
    deathsDifference,
    deathsPercentage,
    casesDifference,
    casesPercentage,
  }
}