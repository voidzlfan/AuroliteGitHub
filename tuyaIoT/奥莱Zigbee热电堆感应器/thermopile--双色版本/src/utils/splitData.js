export default function(data) {
  if (data.length !== 128) {
    return [];
  }
  let arr = [];
  let temp = 0;
  while (temp < 128) {
    arr.push(data[temp] + data[temp + 1]);
    temp += 2;
  }
  return arr;
}
