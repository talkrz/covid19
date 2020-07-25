const fs = require('fs');
const CsvReadableStream = require('csv-reader');

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

module.exports = { csvRead };