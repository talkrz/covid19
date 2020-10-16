export function dateSince(since) {
  return (dataPoint) => {
    return since === null || dataPoint[0] > since;
  }
}