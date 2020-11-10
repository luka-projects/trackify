import { useState, useEffect } from 'react'
import './App.css'
import { FormControl, Select, MenuItem, Card, CardContent, Button } from '@material-ui/core'
import InfoBox from './components/InfoBox'
import Map from './components/Map'
import Table from './components/Table'
import LineGraph from './components/LineGraph'
import { prettify } from './utils'
import 'leaflet/dist/leaflet.css'
import numeral from 'numeral'
import CountryGraph from './components/CountryGraph'

function App() {
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState('worldwide')
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 })
  const [mapZoom, setMapZoom] = useState(3)
  const [mapCountries, setMapCountries] = useState([])
  const [casesType, setCasesType] = useState('cases')

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
      //za individualne drzave(nov graph ubacaiti)
      const histoUrl = `https://disease.sh/v3/covid-19/historical/${countryCode}?lastdays=60`

      await fetch(histoUrl)
      .then((res) => res.json())
      .then(data => {
        console.log(data)
      })


  }


  return (
    <div className="app">
      <div className='app__leftSide'>
        <div className='app__header'>
          <h1>Trackify<span><h6>COVID-19 tracker</h6></span></h1>
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
          <InfoBox
            isRed
            active={casesType === 'cases'}
            onClick={e => setCasesType('cases')}
            title='COVID-19 Cases'
            cases={prettify(countryInfo.todayCases)}
            total={numeral(countryInfo.cases).format('0.0a')}
          />

          <InfoBox
            active={casesType === 'recovered'}
            onClick={e => setCasesType('recovered')}
            title='COVID-19 Recoveries'
            cases={prettify(countryInfo.todayRecovered)}
            total={numeral(countryInfo.recovered).format('0.0a')}
          />

          <InfoBox
            isRed
            active={casesType === 'deaths'}
            onClick={e => setCasesType('deaths')}
            title='COVID-19 Deaths'
            cases={prettify(countryInfo.todayDeaths)}
            total={numeral(countryInfo.deaths).format('0.0a')}
          />
          
        </div>

        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />

        {/* <div className='app__graphs'>
          <CountryGraph />
        </div> */}
      </div>

      <div className='app_rightSide'>
        <Card >
          <CardContent className='app_cc'>
            <h3>Most Cases by Country</h3>
            <Table countries={tableData} />
            <h3>Worldwide New {casesType}</h3>
            <LineGraph casesType={casesType} />
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


    </div>
  )
}

export default App
