const fs = require('fs');
const path = require('path');
const { reduceBy, reduce } = require('ramda');
const { csvRead } = require('./functions/csvRead');

const dailyReportsUrl = './data_sources/COVID-19/csse_covid_19_data/csse_covid_19_daily_reports';

const result = {};

function parseCell(value) {
  if (value === '') {
    return 0;
  }
  return parseInt(value, 10);
}

function discoverInputDataColumns(data) {
  const topLocationColumnName = 'Country/Region';
  const topLocationColumnName2 = 'Country_Region';
  const subLocationColumnName = 'Province/State';
  const subLocationColumnName2 = 'Province_State';
  const confirmedColumnName = 'Confirmed';
  const deathsColumnName = 'Deaths';
  const recoveredColumnName = 'Recovered';

  // country/region column name varies across different files
  let countryNameIndex = data[0].findIndex(columnName => columnName === topLocationColumnName);
  if (countryNameIndex === -1) {
    countryNameIndex = data[0].findIndex(columnName => columnName === topLocationColumnName2);
  }

  let provinceNameIndex = data[0].findIndex(columnName => columnName === subLocationColumnName);
  if (provinceNameIndex === -1) {
    provinceNameIndex = data[0].findIndex(columnName => columnName === subLocationColumnName2);
  }

  const confirmedIndex = data[0].findIndex(columnName => columnName === confirmedColumnName);
  const deathsIndex = data[0].findIndex(columnName => columnName === deathsColumnName);
  const recoveredIndex = data[0].findIndex(columnName => columnName === recoveredColumnName);

  return [countryNameIndex, provinceNameIndex, confirmedIndex, deathsIndex, recoveredIndex];
}

function appendResultsGroupedByLocation(data, date, locationNameIndex, confirmedIndex, deathsIndex, recoveredIndex) {
  const sumCasesNumbers = (acc, inputDataRow) => {
    acc[0] += parseCell(inputDataRow[confirmedIndex]);
    acc[1] += parseCell(inputDataRow[deathsIndex]);
    acc[2] += parseCell(inputDataRow[recoveredIndex]);
    return acc;
  }

  const locationName = (inputDataRow) => (inputDataRow[locationNameIndex]);

  const byCountryPartialResult = reduceBy(sumCasesNumbers, [0, 0, 0], locationName, data);
  const totalPartialResult = reduce(sumCasesNumbers, [0, 0, 0], data);
  const partialResult = { ...byCountryPartialResult, total: totalPartialResult };

  Object.keys(partialResult).forEach(locationName => {
    if (result[locationName] === undefined) {
      result[locationName] = {
        confirmed: [],
        deaths: [],
        recovered: [],
      }
    }
    result[locationName].confirmed.push([date, partialResult[locationName][0]]);
    result[locationName].deaths.push([date, partialResult[locationName][1]]);
    result[locationName].recovered.push([date, partialResult[locationName][2]]);
  });
}

function appendFile(filename, data) {
  const [ countryNameIndex, provinceNameIndex, confirmedIndex, deathsIndex, recoveredIndex ] = discoverInputDataColumns(data);

  // remove header element leaving only data rows
  data.shift();
  const date = filename.substring(0, filename.indexOf('.'));
  appendResultsGroupedByLocation(data, date, countryNameIndex, confirmedIndex, deathsIndex, recoveredIndex);
}

function load() {
  fs.readdir(path.resolve(dailyReportsUrl), async function(err, filenames) {

    const excludeFiles = ['README.md', '.gitignore'];
  
    for (const filename of filenames) {
      if (excludeFiles.includes(filename)) {
        continue;
      }

      const data = await csvRead(dailyReportsUrl + '/' + filename);
      appendFile(filename, data);
    }
    console.log(JSON.stringify(result, null, '  '))
  });
}

load();