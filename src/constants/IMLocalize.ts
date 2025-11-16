import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as RNLocalize from 'react-native-localize';

import en from './translations/en';
// import fr from './translations/fr';
import dk from './translations/dk';
// import es from './translations/es';
// import de from './translations/de';

const LANGUAGES = {
  en,
  dk,
};

const LANG_CODES = Object.keys(LANGUAGES);

const LANGUAGE_DETECTOR = {
  type: 'languageDetector',
  async: true,
  detect: (callback: any) => {
    AsyncStorage.getItem('user-language', (err, language) => {
      if (err || !language) {
        if (err) {
          console.log('Error fetching Languages from async storage ', err);
        } else {
          console.log('No language is set, choosing English as fallback');
        }

        // Use React Native Localize to find the best available language

        // Set the default language to English ('en') if none is set
        const defaultLanguage = 'en';

        callback(defaultLanguage);
        return;
      }

      callback(language);
    });
  },
  init: () => {},
  cacheUserLanguage: (language: any) => {
    AsyncStorage.setItem('user-language', language);
  },
};

i18n
  .use(LANGUAGE_DETECTOR)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources: LANGUAGES,
    react: {
      useSuspense: false,
    },
    interpolation: {
      escapeValue: false,
    },
    defaultNS: 'common',
    fallbackLng: 'en', // Set English as the default/fallback language
  });
