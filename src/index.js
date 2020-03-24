import { iniCharts } from "./script/chart";
import axios from "axios";

import "./styles/style.css";
google.charts.load("current", { packages: ["corechart"] });
function converUsLinearChartData(data) {
  const converted = data.map(rec => {
    return { date: rec.c[0].f, positive: rec.c[1].v, state: "USA-linear" };
  });
  return converted;
}
async function init(data) {
  const response = data.R.eg;
  const convertedDataUS = converUsLinearChartData(response);

  const usData = await axios.get("https://covidapi.info/api/v1/country/usa");
  const stateData = await axios.get(
    "https://covidtracking.com/api/states/daily"
  );
  iniCharts(stateData.data, usData.data.result, convertedDataUS);
}

function initGoogleCharts() {
  const query = new google.visualization.Query(
    `https://docs.google.com/spreadsheets/d/19UnTaiLiAo_X2we6Owl8jc4HYpNg2JXFjpI-j-qNCcA/gviz/tq?gid=0&headers=1&tq=`
  );
  query.send(response => init(response));
}

google.charts.setOnLoadCallback(() => initGoogleCharts());
