export const optionsChart = {
  hover: {
    mode: "nearest",
    intersect: true,
  },
  scales: {
    x: {
      ticks: {
        autoSkip: true,
        major: {
          enabled: true,
        },
      },
    },
    y: {
      min: 0.9,
      max: 3.1,
      ticks: {
        stepSize: 0.1,
      },
      title: {
        display: true,
        text: "Оценка",
      },
    },
  },
};
