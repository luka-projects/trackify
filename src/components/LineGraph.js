import React, { useEffect } from 'react'
import { Line } from 'react-chartjs-2'

function LineGraph() {

    useEffect(() => {
        fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
        .then((res) => res.json())
        .then(data => {
            console.log(data)
        })
    }, [])
    return (
        <div>
            <h1>GRAPH GOES HERE!</h1>
            {/* <Line

            /> */}
        </div>
    )
}

export default LineGraph
