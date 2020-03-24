import { iniCharts } from "./script/chart";
import axios from "axios";

import "./styles/style.css";

async function init() {
  const usData = await axios.get("https://covidapi.info/api/v1/country/usa");
  const stateData = await axios.get(
    "https://covidtracking.com/api/states/daily"
  );
  iniCharts(stateData.data, usData.data.result);
}

init();
