import { aperture } from 'ramda';

function difference(prev, curr) {
  return curr - prev;
}

function percentGrowth(prev, curr) {
  if (prev === 0) {
    return 0;
  }
  return (curr - prev) / prev * 100;
}

// function exponentDifference(prev, curr) {
//   return Math.log(curr) - Math.log(prev);
// }

export function calculateDifference(dataPoints) {
  return aperture(2, dataPoints).map((pair) => difference(pair[0], pair[1]));
}

export function calculatePercentGrowth(dataPoints) {
  return aperture(2, dataPoints).map((pair) => percentGrowth(pair[0], pair[1]));
}