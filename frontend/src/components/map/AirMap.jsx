import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import { useTranslation } from 'react-i18next'
import L from 'leaflet'
import 'leaflet.markercluster'
import { getAQIColor, getAQILabel, calculateRadius, getHealthAdvice } from '../../utils/aqiUtils'
import { useMapStore } from '../../store/useStore'
import { mapService } from '../../services/mapService'
import TimeSlider from './TimeSlider'
import MapLegend from './MapLegend'

const CITY_CENTERS = {
  delhi: { center: [28.6139, 77.2090], zoom: 11 },
  mumbai: { center: [19.0760, 72.8777], zoom: 11 },
  kolkata: { center: [22.5726, 88.3639], zoom: 11 },
  chennai: { center: [13.0827, 80.2707], zoom: 11 },
  bengaluru: { center: [12.9716, 77.5946], zoom: 11 },
  ahmedabad: { center: [23.0225, 72.5714], zoom: 11 }
}

const MapUpdater = ({ center, zoom }) => {
  const map = useMap()
  
  useEffect(() => {
    map.setView(center, zoom)
  }, [map, center, zoom])
  
  return null
}

const AirMap = ({ height = '500px', showTimeSlider = true, showLegend = true }) => {
  const { t } = useTranslation()
  const { selectedCity, currentTimestamp } = useMapStore()
  const [zones, setZones] = useState([])
  const [loading, setLoading] = useState(true)
  const mapRef = useRef()

  useEffect(() => {
    loadZoneData()
  }, [selectedCity, currentTimestamp])

  const loadZoneData = async () => {
    try {
      setLoading(true)
      const data = await mapService.getCityZones(selectedCity)
      setZones(data.zones || [])
    } catch (error) {
      console.error('Error loading zone data:', error)
    } finally {
      setLoading(false)
    }
  }

  const cityConfig = CITY_CENTERS[selectedCity] || CITY_CENTERS.delhi
  const center = cityConfig.center
  const zoom = cityConfig.zoom
  const radiusFactor = parseFloat(import.meta.env.VITE_MAP_RADIUS_FACTOR) || 0.5
  const minRadius = parseFloat(import.meta.env.VITE_MAP_MIN_RADIUS) || 100
  const maxRadius = parseFloat(import.meta.env.VITE_MAP_MAX_RADIUS) || 2000

  return (
    <div className="relative" style={{ height }}>
      {showLegend && <MapLegend />}
      
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <MapUpdater center={center} zoom={zoom} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {zones.filter(zone => {
          // Only show zones for the selected city
          const cityBounds = {
            delhi: { minLat: 28.4, maxLat: 28.9, minLng: 76.8, maxLng: 77.5 },
            mumbai: { minLat: 18.9, maxLat: 19.3, minLng: 72.7, maxLng: 73.1 },
            kolkata: { minLat: 22.4, maxLat: 22.7, minLng: 88.2, maxLng: 88.5 },
            chennai: { minLat: 12.9, maxLat: 13.2, minLng: 80.1, maxLng: 80.4 },
            bengaluru: { minLat: 12.8, maxLat: 13.1, minLng: 77.4, maxLng: 77.8 },
            ahmedabad: { minLat: 22.9, maxLat: 23.2, minLng: 72.4, maxLng: 72.7 }
          }
          const bounds = cityBounds[selectedCity] || cityBounds.delhi
          return zone.latitude >= bounds.minLat && zone.latitude <= bounds.maxLat &&
                 zone.longitude >= bounds.minLng && zone.longitude <= bounds.maxLng
        }).map((zone) => {
          const reading = zone.latestReading || {}
          const aqi = reading.aqi || 0
          const color = getAQIColor(aqi)
          const radius = calculateRadius(aqi, radiusFactor, minRadius, maxRadius)
          const healthAdvice = getHealthAdvice(aqi)

          return (
            <CircleMarker
              key={zone.id}
              center={[zone.latitude, zone.longitude]}
              radius={Math.max(8, Math.min(50, radius / 50))}
              pathOptions={{
                fillColor: color,
                color: '#fff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.7
              }}
            >
              <Popup>
                <div className="p-2 min-w-64">
                  <h3 className="font-bold text-lg mb-2">{zone.name}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">AQI:</span>
                      <span 
                        className="px-2 py-1 rounded text-white text-sm font-bold"
                        style={{ backgroundColor: color }}
                      >
                        {aqi} - {getAQILabel(aqi)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>PM2.5: <span className="font-medium">{reading.pm25 || 0} μg/m³</span></div>
                      <div>NO₂: <span className="font-medium">{reading.no2 || 0} ppb</span></div>
                      <div>O₃: <span className="font-medium">{reading.o3 || 0} ppb</span></div>
                      <div>Population: <span className="font-medium">{zone.population?.toLocaleString() || 'N/A'}</span></div>
                    </div>
                    
                    <div className="border-t pt-2">
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        {t('map.healthAdvice')}:
                      </p>
                      <p className="text-sm text-gray-600 mb-2">{healthAdvice.message}</p>
                      <ul className="text-xs text-gray-500 space-y-1">
                        {healthAdvice.tips.map((tip, index) => (
                          <li key={index}>• {tip}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="text-xs text-gray-400 border-t pt-2">
                      {t('map.lastUpdated')}: {new Date(reading.ts || Date.now()).toLocaleString()}
                    </div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          )
        })}
      </MapContainer>

      {showTimeSlider && (
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <TimeSlider />
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">{t('common.loading')}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default AirMap