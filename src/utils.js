import { Circle, Popup } from 'react-leaflet'
import numeral from 'numeral'

const casesTypeColors = {
    cases: {
        hex: "#CC1034",
        size: 400,
    },
    recovered: {
        hex: "#7dd71d",
        size: 800,
    },
    deaths: {
        hex: "#fb4443",
        size: 1600,
    },
};

export const showData = (data, casesType = 'cases') => (
    data.map(country => (
        <Circle
            center={[country.countryInfo.lat, country.countryInfo.long]}
            fillOpacity={0.4}
            color={casesTypeColors[casesType].hex}
            fillColor={casesTypeColors[casesType].hex}
            radius={
                Math.sqrt(country[casesType]) * casesTypeColors[casesType].size
            }
        >

            <Popup>
                <div className='info__container'>
                    <div className='info__flag' style={{ backgroundImage: `url(${country.countryInfo.flag})` }}></div>
                    <div className='info__name'>{country.country}</div>
                    <div className='info__cases'>
                        Cases: {numeral(country.cases).format('0,0')}
                    </div>
                    <div className='info__recoveries'>
                        Recoveries: {numeral(country.recovered).format('0,0')}
                    </div>
                    <div className='info__deaths'>
                        Deaths: {numeral(country.deaths).format('0,0')}
                    </div>
                </div>
            </Popup>
        </Circle>
    ))
)