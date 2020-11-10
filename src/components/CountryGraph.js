import { useState, useEffect } from "react"
import { Line } from "react-chartjs-2"
import numeral from "numeral"

const options = {
  legend: {
    display: false
  },
  elements: {
    point: {
      radius: 3
    }
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0")
      }
    }
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          parser: "MM/DD/YY",
          tooltipFormat: "ll"
        }
      }
    ],
    yAxes: [
      {
        gridLines: {
          display: false
        },
        ticks: {
          callback: function (value, index, values) {
            return numeral(value).format("0a")
          }
        }
      }
    ]
  }
}

 export const buildChartData = (data, casesType = 'cases') => {
  let chartData = []
  let lastDataPoint
  for (let date in data.cases) {
    if (lastDataPoint) {
      let newDataPoint = {
        x: date,
        y: data[casesType][date] - lastDataPoint
      }
      chartData.push(newDataPoint)
    }
    lastDataPoint = data[casesType][date]
  }
  return chartData
}

function CountryGraph( {casesType = 'cases'} ) {
  const [data, setData] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=8")
        .then((response) => {
          return response.json()
        })
        .then((data) => { 
          let chartData = buildChartData(data, casesType)
          setData(chartData)
          //console.log(chartData)
        })
    }

    fetchData()
  }, [casesType])

  return (
    <div>
      {data?.length > 0 && (
        <Line
          data={{
            datasets: [
              {
                backgroundColor: "rgba(204, 16, 52, 0.5)",
                borderColor: "rgba(255, 70, 30, 0.8)",
                data: data
              }
            ]
          }}
          options={options}
        />
      )}
    </div>
  )
}

export default CountryGraph