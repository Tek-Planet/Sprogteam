import EN from './translations/en';


declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'en';
    resources: {
      en: typeof EN;
    };
  }
}