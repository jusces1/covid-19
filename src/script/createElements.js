import Highcharts from "highcharts/highstock";
import {
  convertDataToChartData,
  convertDataToLinearChartData,
  convertDataToPPercent,
  convertDataToPopulationConfirmedData
} from "./utils";
import { STATES_NAMES } from "./constants";

/**
 * Custom Axis extension to allow emulation of negative values on a logarithmic
 * Y axis. Note that the scale is not mathematically correct, as a true
 * logarithmic axis never reaches or crosses zero.
 */
(function(H) {
  // Pass error messages
  H.Axis.prototype.allowNegativeLog = true;

  // Override conversions
  H.Axis.prototype.log2lin = function(num) {
    var isNegative = num < 0,
      adjustedNum = Math.abs(num),
      result;
    if (adjustedNum < 10) {
      adjustedNum += (10 - adjustedNum) / 10;
    }
    result = Math.log(adjustedNum) / Math.LN10;
    return isNegative ? -result : result;
  };
  H.Axis.prototype.lin2log = function(num) {
    var isNegative = num < 0,
      absNum = Math.abs(num),
      result = Math.pow(10, absNum);
    if (result < 10) {
      result = (10 * (result - 1)) / (10 - 1);
    }
    return isNegative ? -result : result;
  };
})(Highcharts);

// Load module after Highcharts is loaded
require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/data")(Highcharts);
require("highcharts/modules/pattern-fill")(Highcharts);
require("highcharts/indicators/regressions")(Highcharts);

export function createColumnCharts(data, title) {
  const chartData = convertDataToLinearChartData(data, "positive");
  Highcharts.chart("column-chart", {
    chart: {
      type: "column",
      zoomType: "x"
    },
    caption: {
      text: "Sources: The COVID Tracking Project, The GailFosler Group",
      align: "right"
    },
    title: {
      text: `Daily New COVID-19 Cases in ${
        title.includes("Total") ? "U.S." : title
      }`,
      style: {
        fontSize: 12
      }
    },
    credits: {
      enabled: false
    },
    yAxis: {
      title: {
        text: "Number of Cases"
      },
      labels: {
        formatter: function() {
          return Highcharts.numberFormat(this.value, 0, ".", ",");
        }
      }
    },
    xAxis: {
      type: "datetime",
      dateTimeLabelFormats: {
        week: "%b %e",
        day: "%b %e"
      }
    },
    series: [
      {
        name: "COVID-19 Cases",
        data: chartData,
        color: "grey"
      }
    ],
    exporting: {
      buttons: {
        contextButton: {
          menuItems: ["downloadPNG", "downloadSVG"],
          y: -2
        }
      }
    }
  });
}

export function createLineCharts(data, title) {
  const chartData = convertDataToChartData(data, "totalTestResults");
  Highcharts.setOptions({
    lang: {
      thousandsSep: ","
    }
  });
  Highcharts.chart("linear-chart", {
    chart: {
      type: "spline",
      zoomType: "x"
    },
    caption: {
      text: "Sources: The COVID Tracking Project, The GailFosler Group",
      align: "right"
    },
    title: {
      text: `Total Cumulative COVID-19 Cases in ${
        title.includes("Total") ? "U.S." : title
      }`,
      style: {
        fontSize: 12
      }
    },
    credits: {
      enabled: false
    },
    tooltip: {
      shared: true,
      crosshairs: false
    },
    yAxis: [
      {
        title: {
          text: "Number of Cases",
          style: {
            color: "#059FF3"
          }
        },
        labels: {
          formatter: function() {
            return Highcharts.numberFormat(this.value, 0, ".", ",");
          },
          style: {
            color: "#059FF3"
          }
        },
        gridLineColor: "white"
      },
      {
        opposite: true,
        title: {
          text: "Logarithmic Axis",
          style: {
            color: "orange"
          }
        },
        min: 0,
        labels: {
          style: {
            color: "orange"
          },
          formatter: function() {
            return Highcharts.numberFormat(this.value, 0, ".", ",");
          }
        },
        type: "logarithmic",
        allowNegativeLog: true,
        gridLineColor: "white"
      }
    ],
    xAxis: {
      type: "datetime",
      dateTimeLabelFormats: {
        week: "%b %e",
        day: "%b %e"
      }
    },
    series: [
      {
        name: "COVID-19 Cases",
        data: chartData,
        color: "#059FF3"
      },
      {
        name: "Logarithmic Scale",
        data: chartData,
        yAxis: 1,
        color: "orange"
      }
    ],
    exporting: {
      buttons: {
        contextButton: {
          menuItems: ["downloadPNG", "downloadSVG"]
        }
      }
    }
  });
}

export function createColumnTestCharts(data, title) {
  const chartData = convertDataToLinearChartData(data, "totalTestResults");
  const totalPPrecent = convertDataToPPercent(data, "totalTestResults");

  Highcharts.chart("column-chart-testings", {
    chart: {
      type: "column",
      zoomType: "x",
      height: 440
    },
    caption: {
      text: `<span class="caption" x="200" style=" width: 100%; text-align: right; float: right;">
      Sources: The COVID Tracking Project, The GailFosler Group
    </span><br />
    <span class="caption-text" >
      Any 100% readings in early March indicate days when few tests were
      administered and only to those with severe, obvious symptoms.
    </span>`,
      useHTML: true,
      align: "right"
    },
    title: {
      text: `COVID-19 Testing In ${
        title.includes("Total") ? "U.S." : title
      } Per Day`,
      style: {
        fontSize: 12
      }
    },
    legend: {
      title: {
        align: "center",
        style: {
          textAlign: "center"
        }
      }
    },
    credits: {
      enabled: false
    },
    yAxis: [
      {
        title: {
          text: "Number of Tests",
          style: {
            color: "#059FF3"
          }
        },
        gridLineColor: "white",
        min: 0,
        labels: {
          formatter: function() {
            return Highcharts.numberFormat(this.value, 0, ".", ",");
          },
          style: {
            color: "#059FF3"
          }
        }
      },
      {
        opposite: true,
        title: {
          text: "Percent",
          style: {
            color: "orange"
          }
        },
        min: 0,
        max: 100,
        tickAmount: 5,
        endOnTick: true,
        labels: {
          style: {
            color: "orange"
          },
          formatter: function() {
            return Highcharts.numberFormat(this.value, 0, ".", ",");
          }
        }
      }
    ],
    xAxis: {
      type: "datetime",
      dateTimeLabelFormats: {
        week: "%b %e",
        day: "%b %e"
      }
    },
    series: [
      {
        name: "COVID-19 Tests",
        data: chartData,
        color: "#059FF3"
      },
      {
        name: "Percent Positive",
        type: "spline",
        yAxis: 1,
        states: {
          hover: {
            lineWidthPlus: 0
          }
        },
        lineWidth: 0,
        data: totalPPrecent,
        color: "orange"
      }
    ],
    exporting: {
      buttons: {
        contextButton: {
          menuItems: ["downloadPNG", "downloadSVG"],
          y: -2
        }
      }
    }
  });
}

export function createColumnChartPopulationConfirmed(data) {
  const chartData = convertDataToPopulationConfirmedData(data);
  Highcharts.chart("column-chart-population-confirmed", {
    chart: {
      type: "column",
      zoomType: "x"
    },
    caption: {
      useHTML: true,
      text: "Sources: The COVID Tracking Project, The GailFosler Group",
      align: "right"
    },
    title: {
      text: `Top 25 States & Territories by Share of Population with Confirmed COVID-19`,
      style: {
        fontSize: 12
      }
    },
    credits: {
      enabled: false
    },
    yAxis: {
      title: {
        text: "Percent"
      }
    },
    xAxis: {
      categories: chartData.y
    },
    series: [
      {
        name: "Percent of Population",
        data: chartData.x,
        color: "#7cb588"
      }
    ],
    exporting: {
      buttons: {
        contextButton: {
          menuItems: ["downloadPNG", "downloadSVG"],
          y: -2
        }
      }
    }
  });
}

export function createSelect(states, data) {
  const select = document.getElementById("states");
  const option = document.createElement("option");
  option.text = "Total U.S.";
  option.value = "USA";
  select.add(option);

  for (let i = 0; i < Object.keys(STATES_NAMES).length; i++) {
    if (STATES_NAMES[states[i]]) {
      const option = document.createElement("option");
      option.text = STATES_NAMES[states[i]];
      option.value = states[i];
      select.add(option);
    }
  }
  select.addEventListener("change", e => {
    createColumnCharts(
      data.filter(rec => rec.state === e.target.value),
      STATES_NAMES[e.target.value]
    );
    createLineCharts(
      data.filter(rec => rec.state === e.target.value),
      STATES_NAMES[e.target.value]
    );
    createColumnTestCharts(
      data.filter(rec => rec.state === e.target.value),
      STATES_NAMES[e.target.value]
    );
  });
}
