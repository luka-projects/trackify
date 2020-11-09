import { useState, useEffect } from 'react'
import './App.css'
import { FormControl, Select, MenuItem, Card, CardContent, Button } from '@material-ui/core'
import InfoBox from './components/InfoBox'
import Map from './components/Map'
import Table from './components/Table'
import LineGraph from './components/LineGraph'
import 'leaflet/dist/leaflet.css'

function App() {
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState('worldwide')
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 })
  const [mapZoom, setMapZoom] = useState(3)
  const [mapCountries, setMapCountries] = useState([])

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
          setMapCountries(data)
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

        countryCode === "worldwide"
          ? setMapCenter([34.80746, -40.4796])
          : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(countryCode === "worldwide" ? 2.5 : 4);

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

        <Map
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>

      <Card className='app_rightSide'>
        <CardContent className='app_cc'>
          <h3>Most Cases by Country</h3>
          <Table countries={tableData} />
          <h3>Worldwide New Cases</h3>
          <LineGraph />
          <div className='learnMoreDiv'>
            <h5>Get the latest info from the WHO about COVID-19</h5>
            <Button
              href='https://www.who.int/emergencies/diseases/novel-coronavirus-2019'
              color="primary"
              variant="outlined"
              size="small"
              target="_blank"
            >
              Learn More
            </Button>
          </div>
        </CardContent>
      </Card>


    </div>
  )
}

export default App
