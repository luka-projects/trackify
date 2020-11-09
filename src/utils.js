import { Circle, Popup } from 'react-leaflet'
import numeral from 'numeral'

const casesTypeColors = {
    cases: {
        size: 400,
        option: { color: "#ff6c47", fillColor: "#cc1034" },
    },
    recovered: {
        size: 800,
        option: { color: "#7dd71d", fillColor: "#7dd71d" },
    },
    deaths: {
        size: 1600,
        option: { color: "#cc1034", fillColor: "#ff6c47" }
    },
};

export const showData = (data, casesType = 'cases') => (
    data.map(country => (
        <Circle
            center={[country.countryInfo.lat, country.countryInfo.long]}
            fillOpacity={0.4}
            pathOptions={casesTypeColors[casesType].option}
            radius={
                Math.sqrt(country[casesType]) * casesTypeColors[casesType].size
            }
        >
            <Popup>
                <div className="popup__container">
                    <div
                        className="popup__flag"
                        style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
                    ></div>
                    <div className="popup__name">{country.country}</div>
                    <div className="popup__cases">
                        Cases: {numeral(country.cases).format("0,0")}
                    </div>
                    <div className="popup__recoveries">
                        Recovered: {numeral(country.recovered).format("0,0")}
                    </div>
                    <div className="popup__deaths">
                        Deaths: {numeral(country.deaths).format("0,0")}
                    </div>
                </div>
            </Popup>
        </Circle>
    ))
)

export const prettify = (stat) => (
    stat ? `+${numeral(stat).format('0.0a')}` : '+0'
)

