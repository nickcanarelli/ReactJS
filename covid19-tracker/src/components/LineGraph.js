import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import numeral from 'numeral';

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: true,
  tooltips: {
    mode: 'index',
    interset: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format('+0,0');
      },
    },
  },
  scales: {
    xAxes: [
      {
        gridLines: {
          display: false,
        },
        type: 'time',
        time: {
          format: 'MM/DD/YYYY',
          tooltipFormat: 'll',
        },
        ticks: {
          fontColor: "white",
          maxRotation: 60,
          minRotation: 60,
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          fontColor: "white",
          callback: function (value, index, values) {
            return numeral(value).format('0a');
          },
        },
      },
    ],
  },
};

const buildChartData = (data, casesType) => {
  let chartData = [];
  let lastDataPoint;

  for (let date in data.cases) {
    if (lastDataPoint) {
      let newDataPoint = {
        x: date,
        y: data[casesType][date] - lastDataPoint
      }
      chartData.push(newDataPoint);
    }
    lastDataPoint = data[casesType][date];
  }
  return chartData;
}

function LineGraph({ casesType='cases', ...props }) {
  const [data, setData] = useState({});

  // https://disease.sh/v3/covid-19/historical/all
  useEffect(() => {
    const fetchData = async () => {
      await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=all')
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        let chartData = buildChartData(data, casesType);
        setData(chartData);
      });
    }
    
    fetchData();
  }, [casesType]);

  return (
    <div className={props.className}>
      {/* optional chaining to determine if data exists */}
      {data?.length > 0 && (
        <Line
          data={{
            datasets: [{
              backgroundColor: 'rgba(233, 25, 22, .5)',
              borderColor: '#e91916',
              data: data,
            }]
          }}
          options={options} 
        />
      )}
    </div>
  )
}

export default LineGraph;
