export default function dateFormat(date) {
  // omg, use moment instead of this crap
  return date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + ("0" + date.getDate()).slice(-2);
}