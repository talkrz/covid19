export default function formatBigNumber(number) {
  let unit = '';
  let result = number;

  if (result > 1000000) {
    result = result / 1000000;
    unit = 'M';
  } else if (result > 1000) {
    result = result / 1000;
    unit = 'k';
  }
  return result.toLocaleString() + unit;
}