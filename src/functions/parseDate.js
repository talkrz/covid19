
// parse date from DD-MM-YYYY format of input data
export default function parseDate(dateString) {
  const parts = dateString.split('-');
  return `${parts[2]}-${parts[0]}-${parts[1]}`;
}