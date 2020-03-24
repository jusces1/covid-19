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

  const usData = await axios.get("https://covidtracking.com/api/us/daily");
  const stateData = await axios.get(
    "https://covidtracking.com/api/states/daily"
  );
  iniCharts(stateData.data, usData.data, convertedDataUS);
}

function initGoogleCharts() {
  console.log(process.env.TESTAS);
  const query = new google.visualization.Query(process.env.GOOGLE_DOCS);
  query.send(response => init(response));
}

google.charts.setOnLoadCallback(() => initGoogleCharts());
