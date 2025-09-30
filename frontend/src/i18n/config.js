import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en.json'
import hi from './hi.json'
import ta from './ta.json'
import te from './te.json'
import bn from './bn.json'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      ta: { translation: ta },
      te: { translation: te },
      bn: { translation: bn }
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  })

export default i18n