import { useTranslation } from 'react-i18next'
import { AQI_LEVELS } from '../../utils/aqiUtils'

const MapLegend = () => {
  const { t } = useTranslation()

  return (
    <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 z-10 max-w-xs">
      <h3 className="font-bold text-sm mb-3">{t('map.legend')}</h3>
      <div className="space-y-2">
        {Object.values(AQI_LEVELS).map((level) => (
          <div key={level.label} className="flex items-center space-x-2 text-xs">
            <div 
              className="w-4 h-4 rounded-full border border-gray-300"
              style={{ backgroundColor: level.color }}
            ></div>
            <span className="flex-1">
              {level.label} ({level.min}-{level.max === 500 ? '500+' : level.max})
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
        Circle size represents AQI level
      </div>
    </div>
  )
}

export default MapLegend