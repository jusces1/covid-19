import HighStocks from "highcharts/highstock";
import {
  convertDataToChartData,
  convertDataToLinearChartData,
  convertDataToPPercent,
  convertDataToPopulationConfirmedData,
  convertDataToTileMap,
} from "./utils";
import { STATES_NAMES } from "./constants";

/**
 * Custom Axis extension to allow emulation of negative values on a logarithmic
 * Y axis. Note that the scale is not mathematically correct, as a true
 * logarithmic axis never reaches or crosses zero.
 */
(function (H) {
  // Pass error messages
  H.Axis.prototype.allowNegativeLog = true;

  // Override conversions
  H.Axis.prototype.log2lin = function (num) {
    var isNegative = num < 0,
      adjustedNum = Math.abs(num),
      result;
    if (adjustedNum < 10) {
      adjustedNum += (10 - adjustedNum) / 10;
    }
    result = Math.log(adjustedNum) / Math.LN10;
    return isNegative ? -result : result;
  };
  H.Axis.prototype.lin2log = function (num) {
    var isNegative = num < 0,
      absNum = Math.abs(num),
      result = Math.pow(10, absNum);
    if (result < 10) {
      result = (10 * (result - 1)) / (10 - 1);
    }
    return isNegative ? -result : result;
  };
})(HighStocks);

// Load module after Highcharts is loaded
require("highcharts/modules/exporting")(HighStocks);
require("highcharts/modules/data")(HighStocks);
require("highcharts/modules/pattern-fill")(HighStocks);
require("highcharts/indicators/regressions")(HighStocks);

HighStocks.setOptions({
  lang: {
    resetZoom: "Reset Zoom",
  },
});

export function createColumnCharts(data, title) {
  const chartData = convertDataToLinearChartData(data, "positive");
  HighStocks.chart("column-chart", {
    chart: {
      type: "column",
      zoomType: "x",
      resetZoomButton: {
        position: {
          align: "left",
        },
      },
    },
    caption: {
      text: "Sources: The COVID Tracking Project, The GailFosler Group",
      align: "right",
    },
    title: {
      text: `Daily New COVID-19 Cases in ${
        title.includes("Total") ? "U.S." : title
      }`,
      style: {
        fontSize: 18,
      },
    },
    credits: {
      enabled: false,
    },
    yAxis: {
      title: {
        text: "Number of Cases",
      },
      labels: {
        formatter: function () {
          return HighStocks.numberFormat(this.value, 0, ".", ",");
        },
      },
    },
    xAxis: {
      type: "datetime",
      dateTimeLabelFormats: {
        week: "%b %e",
        day: "%b %e",
      },
    },
    series: [
      {
        name: "COVID-19 Cases",
        data: chartData,
        color: "grey",
      },
    ],
    exporting: {
      buttons: {
        contextButton: {
          menuItems: ["downloadPNG", "downloadSVG"],
          y: -2,
        },
      },
    },
  });
}

export function createLineCharts(data, title) {
  const chartData = convertDataToChartData(data, "totalTestResults");
  HighStocks.setOptions({
    lang: {
      thousandsSep: ",",
    },
  });
  HighStocks.chart("linear-chart", {
    chart: {
      type: "spline",
      zoomType: "x",
      resetZoomButton: {
        position: {
          align: "left",
        },
      },
    },
    caption: {
      text: "Sources: The COVID Tracking Project, The GailFosler Group",
      align: "right",
    },
    title: {
      text: `Total Cumulative COVID-19 Cases in ${
        title.includes("Total") ? "U.S." : title
      }`,
      style: {
        fontSize: 18,
      },
    },
    credits: {
      enabled: false,
    },
    tooltip: {
      shared: true,
      crosshairs: false,
    },
    yAxis: [
      {
        title: {
          text: "Number of Cases",
          style: {
            color: "#059FF3",
          },
        },
        labels: {
          formatter: function () {
            return HighStocks.numberFormat(this.value, 0, ".", ",");
          },
          style: {
            color: "#059FF3",
          },
        },
        gridLineColor: "white",
      },
      {
        opposite: true,
        title: {
          text: "Logarithmic Axis",
          style: {
            color: "orange",
          },
        },
        min: 0,
        labels: {
          style: {
            color: "orange",
          },
          formatter: function () {
            return HighStocks.numberFormat(this.value, 0, ".", ",");
          },
        },
        type: "logarithmic",
        allowNegativeLog: true,
        gridLineColor: "white",
      },
    ],
    xAxis: {
      type: "datetime",
      dateTimeLabelFormats: {
        week: "%b %e",
        day: "%b %e",
      },
    },
    series: [
      {
        name: "COVID-19 Cases",
        data: chartData,
        color: "#059FF3",
      },
      {
        name: "Logarithmic Scale",
        data: chartData,
        yAxis: 1,
        color: "orange",
      },
    ],
    exporting: {
      buttons: {
        contextButton: {
          menuItems: ["downloadPNG", "downloadSVG"],
        },
      },
    },
  });
}

export function createColumnTestCharts(data, title) {
  const chartData = convertDataToLinearChartData(data, "totalTestResults");
  const totalPPrecent = convertDataToPPercent(data, "totalTestResults");

  HighStocks.chart("column-chart-testings", {
    chart: {
      type: "column",
      zoomType: "x",
      resetZoomButton: {
        position: {
          align: "left",
        },
      },
    },
    caption: {
      text: `Sources: The COVID Tracking Project, The GailFosler Group`,
      useHTML: true,
      align: "right",
    },
    title: {
      text: `COVID-19 Testing In ${
        title.includes("Total") ? "U.S." : title
      } Per Day`,
      style: {
        fontSize: 18,
      },
    },
    legend: {
      title: {
        align: "center",
        style: {
          textAlign: "center",
        },
      },
    },
    credits: {
      enabled: false,
    },
    yAxis: [
      {
        title: {
          text: "Number of Tests",
          style: {
            color: "#059FF3",
          },
        },
        gridLineColor: "white",
        min: 0,
        labels: {
          formatter: function () {
            return HighStocks.numberFormat(this.value, 0, ".", ",");
          },
          style: {
            color: "#059FF3",
          },
        },
      },
      {
        opposite: true,
        title: {
          text: "Percent",
          style: {
            color: "orange",
          },
        },
        min: 0,
        max: 100,
        tickAmount: 5,
        endOnTick: true,
        labels: {
          style: {
            color: "orange",
          },
          formatter: function () {
            return HighStocks.numberFormat(this.value, 0, ".", ",");
          },
        },
      },
    ],
    xAxis: {
      type: "datetime",
      dateTimeLabelFormats: {
        week: "%b %e",
        day: "%b %e",
      },
    },
    plotOptions: {
      series: {
        allowPointSelect: true,
        marker: {
          enabled: true,
        },
      },
    },
    series: [
      {
        name: "COVID-19 Tests",
        data: chartData,
        color: "#059FF3",
      },
      {
        name: "Percent Positive",
        type: "spline",
        yAxis: 1,
        states: {
          hover: {
            lineWidthPlus: 0,
          },
        },
        lineWidth: 0,
        data: totalPPrecent,
        color: "orange",
      },
    ],
    exporting: {
      buttons: {
        contextButton: {
          menuItems: ["downloadPNG", "downloadSVG"],
          y: -2,
        },
      },
    },
  });
}

export function createColumnChartPopulationConfirmed(data) {
  const chartData = convertDataToPopulationConfirmedData(data);
  HighStocks.chart("column-chart-population-confirmed", {
    chart: {
      type: "column",
      zoomType: "x",
      resetZoomButton: {
        position: {
          align: "left",
        },
      },
    },
    caption: {
      useHTML: true,
      text:
        "Sources: The COVID Tracking Project, U.S. Census Bureau, The GailFosler Group",
      align: "right",
    },
    title: {
      text: `Top 20 States/Territories, Share of Population With COVID-19`,
      style: {
        fontSize: 18,
      },
    },
    credits: {
      enabled: false,
    },
    yAxis: {
      title: {
        text: "Percent",
      },
    },
    xAxis: {
      categories: chartData.y,
    },
    series: [
      {
        name: "Percent of Population, Cumulative",
        data: chartData.x,
        color: "#7cb588",
      },
    ],
    exporting: {
      buttons: {
        contextButton: {
          menuItems: ["downloadPNG", "downloadSVG"],
          y: -2,
        },
      },
    },
  });
}

export function createTilemap(data) {
  const chartData = convertDataToTileMap(data);
  Highcharts.chart("tilemap", {
    chart: {
      type: "tilemap",
      inverted: true,
    },

    title: {
      text: "U.S. states by Covid-19 positive results",
    },
    caption: {
      useHTML: true,
      text:
        "Sources: The COVID Tracking Project, U.S. Census Bureau, The GailFosler Group",
      align: "right",
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      visible: false,
    },

    yAxis: {
      visible: false,
    },
    exporting: {
      buttons: {
        contextButton: {
          menuItems: ["downloadPNG", "downloadSVG"],
          y: -2,
        },
      },
    },
    colorAxis: {
      dataClasses: [
        {
          from: 0,
          to: 1000,
          color: "#F9EDB3",
          name: "< 1000",
        },
        {
          from: 1000,
          to: 10000,
          color: "#FFC428",
          name: "1000 - 10k",
        },
        {
          from: 10000,
          to: 100000,
          color: "#FF7987",
          name: "10k - 10k",
        },
        {
          from: 100000,
          color: "#FF2371",
          name: "> 100k",
        },
      ],
    },

    tooltip: {
      headerFormat: "",
      pointFormat:
        "Positive cases of <b> {point.name}</b> is <b>{point.value}</b>",
    },

    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          format: "{point.hc-a2}",
          color: "#000000",
          style: {
            textOutline: false,
          },
        },
      },
    },

    series: [
      {
        name: "",
        data: chartData,
      },
    ],
  });
}

export function createSelect(states, data) {
  const select = document.getElementById("states");

  for (let i = 0; i < Object.keys(STATES_NAMES).length; i++) {
    const option = document.createElement("option");
    option.text = STATES_NAMES[Object.keys(STATES_NAMES)[i]];
    option.value = Object.keys(STATES_NAMES)[i];
    select.add(option);
  }
  select.addEventListener("change", (e) => {
    createColumnCharts(
      data.filter((rec) => rec.state === e.target.value),
      STATES_NAMES[e.target.value]
    );
    createLineCharts(
      data.filter((rec) => rec.state === e.target.value),
      STATES_NAMES[e.target.value]
    );
    createColumnTestCharts(
      data.filter((rec) => rec.state === e.target.value),
      STATES_NAMES[e.target.value]
    );
  });
}
