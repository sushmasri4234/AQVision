import { useState, useEffect } from 'react'
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useMapStore } from '../../store/useStore'
import { format, subHours, addHours } from 'date-fns'

const TimeSlider = () => {
  const { t } = useTranslation()
  const { 
    currentTimestamp, 
    isPlaying, 
    playbackSpeed,
    setCurrentTimestamp, 
    setIsPlaying,
    setPlaybackSpeed 
  } = useMapStore()
  
  const [sliderValue, setSliderValue] = useState(0)
  const [timeRange, setTimeRange] = useState([])

  useEffect(() => {
    const now = new Date()
    const range = []
    for (let i = 23; i >= 0; i--) {
      range.push(subHours(now, i))
    }
    setTimeRange(range)
    setSliderValue(23)
  }, [])

  useEffect(() => {
    let interval
    if (isPlaying && timeRange.length > 0) {
      interval = setInterval(() => {
        setSliderValue(prev => {
          const next = prev + 1
          if (next >= timeRange.length) {
            setIsPlaying(false)
            return prev
          }
          setCurrentTimestamp(timeRange[next].toISOString())
          return next
        })
      }, playbackSpeed)
    }
    return () => clearInterval(interval)
  }, [isPlaying, playbackSpeed, timeRange, setCurrentTimestamp, setIsPlaying])

  const handleSliderChange = (e) => {
    const value = parseInt(e.target.value)
    setSliderValue(value)
    if (timeRange[value]) {
      setCurrentTimestamp(timeRange[value].toISOString())
    }
  }

  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
  }

  const stepBackward = () => {
    if (sliderValue > 0) {
      const newValue = sliderValue - 1
      setSliderValue(newValue)
      setCurrentTimestamp(timeRange[newValue].toISOString())
    }
  }

  const stepForward = () => {
    if (sliderValue < timeRange.length - 1) {
      const newValue = sliderValue + 1
      setSliderValue(newValue)
      setCurrentTimestamp(timeRange[newValue].toISOString())
    }
  }

  if (timeRange.length === 0) return null

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex items-center space-x-4">
        <button
          onClick={stepBackward}
          disabled={sliderValue === 0}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous hour"
        >
          <SkipBack size={16} />
        </button>

        <button
          onClick={togglePlayback}
          className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
          aria-label={isPlaying ? t('map.pause') : t('map.play')}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>

        <button
          onClick={stepForward}
          disabled={sliderValue === timeRange.length - 1}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next hour"
        >
          <SkipForward size={16} />
        </button>

        <div className="flex-1">
          <input
            type="range"
            min="0"
            max={timeRange.length - 1}
            value={sliderValue}
            onChange={handleSliderChange}
            className="time-slider w-full"
            aria-label={t('map.timeSlider')}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{format(timeRange[0], 'HH:mm')}</span>
            <span className="font-medium">
              {format(timeRange[sliderValue], 'MMM dd, HH:mm')}
            </span>
            <span>{format(timeRange[timeRange.length - 1], 'HH:mm')}</span>
          </div>
        </div>

        <select
          value={playbackSpeed}
          onChange={(e) => setPlaybackSpeed(parseInt(e.target.value))}
          className="text-sm border border-gray-300 rounded px-2 py-1"
          aria-label="Playback speed"
        >
          <option value={2000}>0.5x</option>
          <option value={1000}>1x</option>
          <option value={500}>2x</option>
          <option value={250}>4x</option>
        </select>
      </div>
    </div>
  )
}

export default TimeSlider