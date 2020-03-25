import {
  createSelect,
  createColumnCharts,
  createLineCharts
} from "./createElements";

function uniqueState(arr, fn) {
  var unique = {};
  var distinct = [];
  arr.forEach(function(x) {
    var key = fn(x);
    if (!unique[key]) {
      distinct.push(key);
      unique[key] = true;
    }
  });
  return distinct;
}

export function iniCharts(statesData, us) {
  const usData = us.map(x => {
    return { state: "USA", ...x };
  });
  const data = [...statesData, ...usData];
  const states = uniqueState(statesData, function(x) {
    return x.state;
  });
  createSelect(states, data);
  createColumnCharts(
    data.filter(rec => rec.state === "USA"),
    "Total U.S."
  );
  createLineCharts(
    data.filter(rec => rec.state === "USA"),
    "Total U.S."
  );
}
