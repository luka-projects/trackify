import { MapContainer, TileLayer } from 'react-leaflet'
import './Map.css'
import { showData } from '../utils'

function Map({ countries, center, zoom, casesType = 'cases' }) {
    return (
        <div className='map'>
            <MapContainer center={center} zoom={zoom}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {showData(countries, casesType)}
            </MapContainer>
        </div>
    )
}

export default Map
