import {
  createSelect,
  createColumnCharts,
  createLineCharts,
  createColumnTestCharts,
  createColumnChartPopulationConfirmed,
  createTilemap,
} from "./createElements";

function uniqueState(arr, fn) {
  var unique = {};
  var distinct = [];
  arr.forEach(function (x) {
    var key = fn(x);
    if (!unique[key]) {
      distinct.push(key);
      unique[key] = true;
    }
  });
  return distinct;
}

function convertData(statesHistData, usHist) {
  const usDataHist = usHist.map((x) => {
    return { state: "USA", ...x };
  });
  const data = [...statesHistData, ...usDataHist];
  const states = uniqueState(statesHistData, function (x) {
    return x.state;
  });
  return { data, states };
}

export function iniCharts(statesHistData, usHist, state) {
  const hist = convertData(statesHistData, usHist);
  createSelect(hist.states, hist.data);

  createColumnCharts(
    hist.data.filter((rec) => rec.state === "USA"),
    "Total U.S."
  );

  createLineCharts(
    hist.data.filter((rec) => rec.state === "USA"),
    "Total U.S."
  );
  createColumnTestCharts(
    hist.data.filter((rec) => rec.state === "USA"),
    "Total U.S."
  );
  createColumnChartPopulationConfirmed(state);
  createTilemap(state);
}
