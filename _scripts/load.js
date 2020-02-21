const cheerio = require('cheerio');
const fetch = require('node-fetch');

const chinaCasesUrl = 'https://en.wikipedia.org/wiki/2019%E2%80%9320_coronavirus_outbreak';

function containsText(cheerio, selector, text) {
  return cheerio(selector).filter(function() {
    return cheerio(this).text().includes(text);
  });
}

function wikiExtractNumberFromTableCell(string) {
  const parentheses = /\(.*\)/gi
  let numberString = '';
  numberString = string.replace(parentheses, '');
  const commas = /,*/gi
  numberString = string.replace(commas, '');
  return parseInt(numberString);
}

fetch(chinaCasesUrl)
  .then(response => response.text())
  .then(text => {
    const th = containsText(cheerio.load(text), 'th', 'COVID-19 cases in mainland China');
    const table = th.parents('table');
    const rows = table.find('tr');

    const data = [
    ];
    rows.each(function(i, e) {
      const dataRow = [];
      const dateSpan = cheerio(this).find('td span.nowrap');
      if (dateSpan.length) {
        dataRow[0] = dateSpan.text();
      }
      const casesTds = cheerio(this).find('td table td');
      if (casesTds.length) {
        const numbers = casesTds.text().split('\n');
        const number = wikiExtractNumberFromTableCell(numbers[1] !== '' ? numbers[1] : numbers[0]);
        //console.log('number: ', casesTds.text())
        dataRow[1] = number; // yep, overwrite first one
      }
      if (dataRow.length && dataRow[0]) {
        data.push(dataRow);
      }
    })

    console.log(JSON.stringify(data, null,'  '));
  })
