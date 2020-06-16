import { iniCharts } from "./script/chart";
import axios from "axios";

import "./styles/style.css";

async function init() {
  document.getElementById(
    "covid-19-charts-container"
  ).innerHTML = `<select id="states"></select>
  <div class="chart-container">
    <div class="chart">
      <div class="linear-chart" id="linear-chart"></div>
    </div>
    <div class="chart">
      <div class="column-char" id="column-chart"></div>
    </div>
  </div>
  <div class="chart-container">
    <div class="chart">
      <div class="column-chart-testings" id="column-chart-testings"></div>
    </div>
    <div class="chart">
      <div
        class="column-chart-population-confirmed"
        id="column-chart-population-confirmed"
      ></div>
    </div>
  </div>
  <div class="chart-container">
  <div class="chart">
    <div class="tilemap" id="tilemap"></div>
  </div>
</div>
  `;
  const usHistData = await axios.get("https://covidtracking.com/api/us/daily");
  const stateHistData = await axios.get(
    "https://covidtracking.com/api/states/daily"
  );
  const statetData = await axios.get("https://covidtracking.com/api/states");

  iniCharts(stateHistData.data, usHistData.data, statetData.data);
}

init();
