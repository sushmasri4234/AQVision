import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      
      setAuth: (user, token, refreshToken) => set({
        user,
        token,
        refreshToken,
        isAuthenticated: true
      }),
      
      logout: () => set({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false
      }),
      
      updateUser: (userData) => set(state => ({
        user: { ...state.user, ...userData }
      }))
    }),
    {
      name: 'auth-storage'
    }
  )
)

export const useMapStore = create((set, get) => ({
  selectedCity: 'delhi',
  selectedZone: null,
  currentTimestamp: new Date().toISOString(),
  isPlaying: false,
  playbackSpeed: 1000,
  
  setSelectedCity: (city) => set({ selectedCity: city }),
  setSelectedZone: (zone) => set({ selectedZone: zone }),
  setCurrentTimestamp: (timestamp) => set({ currentTimestamp: timestamp }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed })
}))

export const useSettingsStore = create(
  persist(
    (set, get) => ({
      language: 'en',
      notifications: {
        push: true,
        email: true,
        sms: false,
        whatsapp: false
      },
      thresholds: {
        pm25: 35,
        no2: 40,
        o3: 70,
        aqi: 100
      },
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '08:00'
      },
      savedLocations: [],
      
      setLanguage: (language) => set({ language }),
      updateNotifications: (notifications) => set(state => ({
        notifications: { ...state.notifications, ...notifications }
      })),
      updateThresholds: (thresholds) => set(state => ({
        thresholds: { ...state.thresholds, ...thresholds }
      })),
      updateQuietHours: (quietHours) => set(state => ({
        quietHours: { ...state.quietHours, ...quietHours }
      })),
      addSavedLocation: (location) => set(state => ({
        savedLocations: [...state.savedLocations, location]
      })),
      removeSavedLocation: (locationId) => set(state => ({
        savedLocations: state.savedLocations.filter(loc => loc.id !== locationId)
      }))
    }),
    {
      name: 'settings-storage'
    }
  )
)