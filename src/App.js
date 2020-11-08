import { useState, useEffect } from 'react'
import './App.css';
import { FormControl, Select, MenuItem, Card, CardContent } from '@material-ui/core'
import InfoBox from './components/InfoBox'
import Map from './components/Map'
import Table from './components/Table'
import LineGraph from './components/LineGraph'

function App() {
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState('worldwide')
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([])

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then((res) => res.json())
      .then(data => {
        setCountryInfo(data)
      })
  }, [])

  const sortData = (data) => {
    const sortedData = [...data]

    sortedData.sort((a, b) => {
      if (a.cases > b.cases) {
        return -1
      } else {
        return 1
      }
    })
    return sortedData
  }

  useEffect(() => {
    const getData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
        .then((res) => res.json())
        .then((data) => {
          const countries = data.map((country) => (
            {
              name: country.country, //Serbia
              value: country.countryInfo.iso3, //SRB
              key: country.countryInfo._id
            }
          ))
          const sortedData = sortData(data)
          setTableData(sortedData)
          setCountries(countries)
        })
    }

    getData()
  }, [])

  const onCountryChange = async (event) => {
    const countryCode = event.target.value
    setCountry(countryCode)

    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
      .then((res) => res.json())
      .then(data => {
        setCountry(countryCode)
        setCountryInfo(data)
      })
  }

  return (
    <div className="app">
      <div className='app__leftSide'>
        <div className='app__header'>
          <h1>Trackify - COVID-19 tracker</h1>
          <FormControl className='app__dropmenu'>
            <Select
              variant='outlined'
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value='worldwide'>Worldwide</MenuItem>
              {
                countries.map(country => (
                  <MenuItem value={country.value} key={country.key}>{country.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </div>

        <div className='app__stats'>
          <InfoBox title='COVID-19 Cases' cases={countryInfo.todayCases} total={countryInfo.cases} />

          <InfoBox title='COVID-19 Recoveries' cases={countryInfo.todayRecovered} total={countryInfo.recovered} />

          <InfoBox title='COVID-19 Deaths' cases={countryInfo.todayDeaths} total={countryInfo.deaths} />
        </div>

        <Map />
      </div>

      <Card className='app_rightSide'>
        <CardContent>
          <h3>Most Positive Cases by Country</h3>
          <Table countries={tableData} />
          {/* Graph */}
          <h3>Worldwide New Cases</h3>
          <LineGraph />
        </CardContent>
      </Card>


    </div>
  );
}

export default App;
