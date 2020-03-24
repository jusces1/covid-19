export function convertDataToChartData(data) {
  let date;
  const convertedData = data.map(rec => {
    if (typeof rec.date === "number") {
      date =
        rec.date.toString().substr(0, 4) +
        "-" +
        rec.date.toString().substr(4, 2) +
        "-" +
        rec.date.toString().substr(6);
    } else date = rec.date;
    return [new Date(date).getTime(), rec.positive];
  });
  return convertedData;
}

function compare(a, b) {
  const bandA = a.date;
  const bandB = b.date;

  let comparison = 0;
  if (bandA > bandB) {
    comparison = 1;
  } else if (bandA < bandB) {
    comparison = -1;
  }
  return comparison;
}

export function convertDataToLinearChartData(data) {
  data.sort(compare);
  const convertedData = data.map((rec, key) => {
    const prevKey = key - 1;
    const val = key > 0 ? rec.positive - data[prevKey].positive : rec.positive;
    let date;
    if (typeof rec.date === "number") {
      date =
        rec.date.toString().substr(0, 4) +
        "-" +
        rec.date.toString().substr(4, 2) +
        "-" +
        rec.date.toString().substr(6);
    } else date = rec.date;

    return [new Date(date).getTime(), val];
  });
  return convertedData;
}
