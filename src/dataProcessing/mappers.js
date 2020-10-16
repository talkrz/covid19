import dateFormat from '../functions/dateFormat';
import parseDate from '../functions/parseDate';

export function normalizeDate(dataPoint) {
  const result = dataPoint.slice();
  result[0] = dateFormat(new Date(parseDate(dataPoint[0])));
  return result;
}