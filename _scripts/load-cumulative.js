const fetch = require('node-fetch');

const url = 'https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/cases_time_v3/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=Report_Date_String%20asc&resultOffset=0&resultRecordCount=2000&cacheHint=true';

const dataKey = process.argv[2];

const dataKeys = [
  'Other_Locations',
  'Mainland_China',
];

if (!dataKey || !dataKeys.includes(dataKey)) {
  console.log('Invalid data key');
  process.exit(-1);
}

fetch(url)
  .then(response => response.json())
  .then(json => {
    const result = [];
    json.features.forEach(dataRow => {
      result.push([
        dataRow.attributes['Report_Date_String'].replace(/\//gi, '-'),
        dataRow.attributes[dataKey]
      ]);
    })
    console.log(JSON.stringify(result, null, '  '))
  })