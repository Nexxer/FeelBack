import "./index.css";
import { optionsChart } from "./utils/chartConfig";
import dataFromJSON from "./test.json";
import Chart from "chart.js/auto";
import "chartjs-adapter-moment";

const moment = require("moment");
const _ = require("lodash");
moment.locale("us");

const ctx = document.getElementById("personalChart");
const buttonWeekChart = document.querySelector(".btn-week");
const buttonDayChart = document.querySelector(".btn-day");

const chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: dataToRender,
  },
  options: optionsChart,
});

buttonWeekChart.addEventListener("click", function () {
  dataPreparation(dataFromJSON, "week", chart);
});

buttonDayChart.addEventListener("click", function () {
  dataPreparation(dataFromJSON, "day", chart);
});

function dataPreparation(data = [], type = 'day', chart) {
  let selectionData = [];

  data.map((metric) => {
    const { dates_array, metric_name, values_array, metric_id } = metric;
    let informationByDay = [];

    for (let i = 0; i < dates_array.length; i++) {
      const graphPoint = {};

      if (type === "day") graphPoint.x = dates_array[i];
      if (type === "week") graphPoint.x = moment(dates_array[i]).week();
      graphPoint[metric_name] = values_array[i];
      informationByDay.push(graphPoint);

      // Объединяем все значения одной недели
      let informationByWeek = _(informationByDay)
        .groupBy("x")
        .map((v, k) => ({
          x: k,
          [metric_name]: _.map(v, metric_name),
        }))
        .value();

      // высчитываемсреднее значения для каждой недели
      informationByWeek.forEach((item) => {
        item[metric_name] = _.meanBy(item[metric_name]).toFixed(2);
      });

      // создаем данные для вывода в зависимости от выбранного формата
      selectionData[metric_id] =
        type === "day" ? informationByDay : informationByWeek;
    }
  });

  let dataForRendering = [];
  let j = 0;
  const color = [
    "Red",
    "Blue",
    "Black",
    "Green",
    "Purple",
    "Chocolate",
    "DarkGoldenRod",
  ];
  selectionData.map((line) => {
    dataForRendering = [
      ...dataForRendering,
      {
        borderColor: color[j],
        backgroundColor: color[j],
        tension: 0.3,
        borderWidth: 1,
        label: Object.keys(line[0])[1],
        data: line, //metric id
        parsing: {
          yAxisKey: Object.keys(line[0])[1],
        },
      },
    ];
    j++;
  });
  //устанавливаем опции осей и подписи
  chart.options = {
    scales: {
      x: {
        ticks: {
          minRotation: type === "week" ? 0 : 90,
          maxRotation: type === "week" ? 0 : 90,
        },
        title: {
          display: true,
          text: type === "week" ? "Номер недели" : "Дата (дни)",
        },
        display: true,
        type: type === "week" ? "linear" : `time`,
        time: {
          unit: "day",
          displayFormats: {
            day: "DD.MM.YY",
          },
        },
      },
    },
  };
  //утанавливаем новые данные
  chart.data.datasets = dataForRendering;
  //обновляем график
  chart.update();
}

let dataToRender = dataPreparation(dataFromJSON, "day", chart);
