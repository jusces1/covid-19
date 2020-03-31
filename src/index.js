import { iniCharts } from "./script/chart";
import axios from "axios";

import "./styles/style.css";

async function init() {
  const usHistData = await axios.get("https://covidtracking.com/api/us/daily");
  const stateHistData = await axios.get(
    "https://covidtracking.com/api/states/daily"
  );
  const statetData = await axios.get("https://covidtracking.com/api/states");

  iniCharts(stateHistData.data, usHistData.data, statetData.data);
}

init();
