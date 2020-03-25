import { iniCharts } from "./script/chart";
import axios from "axios";

import "./styles/style.css";

async function init() {
  const usData = await axios.get("https://covidtracking.com/api/us/daily");
  const stateData = await axios.get(
    "https://covidtracking.com/api/states/daily"
  );
  iniCharts(stateData.data, usData.data);
}

init();
