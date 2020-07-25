const fs = require('fs');
const path = require('path');
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

  const partialResult = {};

  data.forEach((dataRow, index) => {
    if (index === 0) {
      return;
    }

    const countryName = dataRow[countryNameIndex];

    if (partialResult[countryName] === undefined) {
      partialResult[countryName] = [
        parseCell(dataRow[confirmedIndex]),
        parseCell(dataRow[deathsIndex]),
        parseCell(dataRow[recoveredIndex])
      ];
    } else {
      partialResult[countryName][0] += parseCell(dataRow[confirmedIndex]);
      partialResult[countryName][1] += parseCell(dataRow[deathsIndex]);
      partialResult[countryName][2] += parseCell(dataRow[recoveredIndex]);
    }

    if (partialResult['total'] === undefined) {
      partialResult['total'] = [
        parseCell(dataRow[confirmedIndex]),
        parseCell(dataRow[deathsIndex]),
        parseCell(dataRow[recoveredIndex])
      ];
    } else {
      partialResult['total'][0] += parseCell(dataRow[confirmedIndex]);
      partialResult['total'][1] += parseCell(dataRow[deathsIndex]);
      partialResult['total'][2] += parseCell(dataRow[recoveredIndex]);
    }
  });

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
    }
    console.log(JSON.stringify(result, null, '  '))
  });
}

load();