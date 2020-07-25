const fs = require('fs');
const path = require('path');
const R = require('ramda');
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
  const confirmedColumnName = 'Confirmed';
  const deathsColumnName = 'Deaths';
  const recoveredColumnName = 'Recovered';

  // country/region column name varies across different files
  let countryNameIndex = data[0].findIndex(columnName => columnName === topLocationColumnName);
  if (countryNameIndex === -1) {
    countryNameIndex = data[0].findIndex(columnName => columnName === topLocationColumnName2);
  }
  const confirmedIndex = data[0].findIndex(columnName => columnName === confirmedColumnName);
  const deathsIndex = data[0].findIndex(columnName => columnName === deathsColumnName);
  const recoveredIndex = data[0].findIndex(columnName => columnName === recoveredColumnName);

  return [countryNameIndex, confirmedIndex, deathsIndex, recoveredIndex];
}



function appendFile(filename, data) {
  const [ countryNameIndex, confirmedIndex, deathsIndex, recoveredIndex ] = discoverInputDataColumns(data);

  // remove header element leaving only data rows
  data.shift();

  const sumCasesNumbers = (acc, inputDataRow) => {
    acc[0] += parseCell(inputDataRow[confirmedIndex]);
    acc[1] += parseCell(inputDataRow[deathsIndex]);
    acc[2] += parseCell(inputDataRow[recoveredIndex]);
    return acc;
  }

  const countryName = (inputDataRow) => (inputDataRow[countryNameIndex]);

  const byCountryPartialResult = R.reduceBy(sumCasesNumbers, [0, 0, 0], countryName, data);
  const totalPartialResult = R.reduce(sumCasesNumbers, [0, 0, 0], data);
  const partialResult = { ...byCountryPartialResult, total: totalPartialResult };

  const date = filename.substring(0, filename.indexOf('.'));

  Object.keys(partialResult).forEach(countryName => {
    if (result[countryName] === undefined) {
      result[countryName] = {
        confirmed: [],
        deaths: [],
        recovered: [],
      }
    }
    result[countryName].confirmed.push([date, partialResult[countryName][0]]);
    result[countryName].deaths.push([date, partialResult[countryName][1]]);
    result[countryName].recovered.push([date, partialResult[countryName][2]]);
  })
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

      process.exit(1)
    }
    console.log(JSON.stringify(result, null, '  '))
  });
}

load();