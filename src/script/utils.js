import { STATES_POPULATION } from "./constants";

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

export function convertDataToLinearChartData(data, column) {
  data.sort(compare);
  const convertedData = data.map((rec, key) => {
    const prevKey = key - 1;
    const val = key > 0 ? rec[column] - data[prevKey][column] : rec[column];
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

export function convertDataToPPercent(data) {
  data.sort(compare);
  const convertedData = data.map((rec, key) => {
    const prevKey = key - 1;
    const val = key > 0 ? rec.positive - data[prevKey].positive : rec.positive;
    const val2 =
      key > 0
        ? rec.totalTestResults - data[prevKey].totalTestResults
        : rec.totalTestResults;
    const result =
      val && val2 ? parseFloat(((val / val2) * 100).toFixed(2)) : 0;
    let date;
    if (typeof rec.date === "number") {
      date =
        rec.date.toString().substr(0, 4) +
        "-" +
        rec.date.toString().substr(4, 2) +
        "-" +
        rec.date.toString().substr(6);
    } else date = rec.date;

    return [new Date(date).getTime(), result];
  });
  return convertedData;
}

export function convertDataToPopulationConfirmedData(data) {
  const convertedData = data.map((rec, key) => {
    const val = parseFloat(
      ((rec.positive / STATES_POPULATION[rec.state]) * 100).toFixed(2)
    );
    return [rec.state, val];
  });

  convertedData.sort((a, b) => {
    return b[1] - a[1];
  });
  const chart = convertedData.slice(0, 20);
  return { x: chart.map(x => x[1]), y: chart.map(x => x[0]) };
}
