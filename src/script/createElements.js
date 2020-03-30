import Highcharts from "highcharts/highstock";
import {
  convertDataToChartData,
  convertDataToLinearChartData,
  convertDataToPPercent
} from "./utils";

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

const statesNames = {
  USA: "Total U.S.",
  AK: "Alaska",
  AL: "Alabama",
  AR: "Arkansas",
  AZ: "Arizona",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DC: "District of Columbia",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  IA: "Iowa",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  MA: "Massachusetts",
  MD: "Maryland",
  ME: "Maine",
  MI: "Michigan",
  MN: "Minnesota",
  MO: "Missouri",
  MS: "Mississippi",
  MT: "Montana",
  NC: "North Carolina",
  ND: "North Dakota",
  NE: "Nebraska",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NV: "Nevada",
  NY: "New York",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VA: "Virginia",
  VT: "Vermont",
  WA: "Washington",
  WI: "Wisconsin",
  WV: "West Virginia",
  WY: "Wyoming",
  PR: "Puerto Rico",
  VI: "U.S. Virgin Islands",
  GU: "Guam",
  MP: "Northern Mariana Islands",
  AS: "American Samoa"
};

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
      }`
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
    title: {
      text: `Total Cumulative COVID-19 Cases in ${
        title.includes("Total") ? "U.S." : title
      }`
    },
    credits: {
      enabled: false
    },
    caption: {
      text: "Sources: The COVID Tracking Project, The GailFosler Group",
      align: "right"
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
        name: "COVID-19 Tests",
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
      zoomType: "x"
    },
    caption: {
      text: "Sources: The COVID Tracking Project, The GailFosler Group",
      align: "right"
    },
    title: {
      text: `COVID-19 Testing In ${
        title.includes("Total") ? "U.S." : title
      } Per Day`
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
        name: "COVID-19 Cases",
        data: chartData,
        color: "#059FF3"
      },
      {
        name: "Share Positive",
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

export function createSelect(states, data) {
  const select = document.getElementById("states");
  const option = document.createElement("option");
  option.text = "Total U.S.";
  option.value = "USA";
  select.add(option);

  for (let i = 0; i < Object.keys(statesNames).length; i++) {
    if (statesNames[states[i]]) {
      const option = document.createElement("option");
      option.text = statesNames[states[i]];
      option.value = states[i];
      select.add(option);
    }
  }
  select.addEventListener("change", e => {
    console.log(e.target.value);
    createColumnCharts(
      data.filter(rec => rec.state === e.target.value),
      statesNames[e.target.value]
    );
    createLineCharts(
      data.filter(rec => rec.state === e.target.value),
      statesNames[e.target.value]
    );
    createColumnTestCharts(
      data.filter(rec => rec.state === e.target.value),
      statesNames[e.target.value]
    );
  });
}
