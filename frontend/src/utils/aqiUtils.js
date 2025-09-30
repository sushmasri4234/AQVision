export const AQI_LEVELS = {
  GOOD: { min: 0, max: 50, color: '#00E400', label: 'Good' },
  MODERATE: { min: 51, max: 100, color: '#FFFF00', label: 'Moderate' },
  UNHEALTHY_SENSITIVE: { min: 101, max: 150, color: '#FF7E00', label: 'Unhealthy for Sensitive' },
  UNHEALTHY: { min: 151, max: 200, color: '#FF0000', label: 'Unhealthy' },
  VERY_UNHEALTHY: { min: 201, max: 300, color: '#8F3F97', label: 'Very Unhealthy' },
  HAZARDOUS: { min: 301, max: 500, color: '#7E0023', label: 'Hazardous' }
}

export const getAQILevel = (aqi) => {
  if (aqi <= 50) return AQI_LEVELS.GOOD
  if (aqi <= 100) return AQI_LEVELS.MODERATE
  if (aqi <= 150) return AQI_LEVELS.UNHEALTHY_SENSITIVE
  if (aqi <= 200) return AQI_LEVELS.UNHEALTHY
  if (aqi <= 300) return AQI_LEVELS.VERY_UNHEALTHY
  return AQI_LEVELS.HAZARDOUS
}

export const getAQIColor = (aqi) => getAQILevel(aqi).color

export const getAQILabel = (aqi) => getAQILevel(aqi).label

export const calculateRadius = (aqi, radiusFactor = 0.5, minRadius = 100, maxRadius = 2000) => {
  const radius = aqi * radiusFactor
  return Math.max(minRadius, Math.min(maxRadius, radius))
}

export const getHealthAdvice = (aqi) => {
  const level = getAQILevel(aqi)
  
  const advice = {
    [AQI_LEVELS.GOOD.label]: {
      message: "Air quality is good. Perfect for outdoor activities.",
      tips: ["Enjoy outdoor activities", "Open windows for fresh air"]
    },
    [AQI_LEVELS.MODERATE.label]: {
      message: "Air quality is acceptable for most people.",
      tips: ["Sensitive individuals should limit prolonged outdoor exertion"]
    },
    [AQI_LEVELS.UNHEALTHY_SENSITIVE.label]: {
      message: "Sensitive groups may experience health effects.",
      tips: ["Limit outdoor activities if sensitive", "Consider wearing a mask outdoors"]
    },
    [AQI_LEVELS.UNHEALTHY.label]: {
      message: "Everyone may experience health effects.",
      tips: ["Avoid outdoor activities", "Keep windows closed", "Use air purifiers indoors"]
    },
    [AQI_LEVELS.VERY_UNHEALTHY.label]: {
      message: "Health alert: everyone may experience serious health effects.",
      tips: ["Stay indoors", "Avoid all outdoor activities", "Use N95 masks if going outside"]
    },
    [AQI_LEVELS.HAZARDOUS.label]: {
      message: "Emergency conditions: entire population affected.",
      tips: ["Stay indoors at all times", "Seal windows and doors", "Seek medical attention if experiencing symptoms"]
    }
  }
  
  return advice[level.label] || advice[AQI_LEVELS.GOOD.label]
}