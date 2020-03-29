const fs = require('fs');
const path = require('path');
const CsvReadableStream = require('csv-reader');

const dailyReportsUrl = './data_sources/COVID-19/csse_covid_19_data/csse_covid_19_daily_reports';

const result = {};

function csvRead(filename) {
  const inputStream = fs.createReadStream(filename, 'utf8');
 
  const result = [];
  inputStream
      .pipe(new CsvReadableStream({ parseNumbers: false }))
      .on('data', function (row) {
          result.push(row);
      });
  return new Promise((resolve) => {
    inputStream.on('end', function () {
      resolve(result);
    });
  });
}

function parseCell(value) {
  if (value === '') {
    return 0;
  }
  return parseInt(value, 10);
}

function appendFile(filename, data) {
  const topLocationColumnName = 'Country/Region';
  const topLocationColumnName2 = 'Country_Region';
  const confirmedColumnName = 'Confirmed';
  const deathsColumnName = 'Deaths';
  const recoveredColumnName = 'Recovered';

  let topLocationIndex = data[0].findIndex(columnName => columnName === topLocationColumnName);
  if (topLocationIndex === -1) {
    topLocationIndex = data[0].findIndex(columnName => columnName === topLocationColumnName2);
  }
  const confirmedIndex = data[0].findIndex(columnName => columnName === confirmedColumnName);
  const deathsIndex = data[0].findIndex(columnName => columnName === deathsColumnName);
  const recoveredIndex = data[0].findIndex(columnName => columnName === recoveredColumnName);


  const partialResult = {};

  data.forEach((dataRow, index) => {
    if (index === 0) {
      return;
    }

    const key = dataRow[topLocationIndex];

    if (partialResult[key] === undefined) {
      partialResult[key] = [
        parseCell(dataRow[confirmedIndex]),
        parseCell(dataRow[deathsIndex]),
        parseCell(dataRow[recoveredIndex])
      ];
    } else {
      partialResult[key][0] += parseCell(dataRow[confirmedIndex]);
      partialResult[key][1] += parseCell(dataRow[deathsIndex]);
      partialResult[key][2] += parseCell(dataRow[recoveredIndex]);
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
  })


  const date = filename.substring(0, filename.indexOf('.'));

  Object.keys(partialResult).forEach(key => {
    if (result[key] === undefined) {
      result[key] = {
        confirmed: [],
        deaths: [],
        recovered: [],
      }
    }
    result[key].confirmed.push([date, partialResult[key][0]]);
    result[key].deaths.push([date, partialResult[key][1]]);
    result[key].recovered.push([date, partialResult[key][2]]);
  })
}

function load() {
  fs.readdir(path.resolve(dailyReportsUrl), async function(err, items) {

    const excludeFiles = ['README.md', '.gitignore'];
  
    for (const file of items) {
      if (excludeFiles.includes(file)) {
        continue;
      }

      const data = await csvRead(dailyReportsUrl + '/' + file);
      appendFile(file, data);
    }
    console.log(JSON.stringify(result, null, '  '))
  });
}

load();