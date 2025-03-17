import {ENVIRONMENT} from './types';
import {isIOS} from './utils';

export const APIENV: ENVIRONMENT = {
  local: isIOS ? 'http://127.0.0.1:8000/' : 'http://192.168.0.184:8000/',
  development: 'https://mobile.sweet-meitner.185-208-207-107.plesk.page/', //'https://test.sweet-meitner.185-208-207-107.plesk.page/', //'https://mobile.sweet-meitner.185-208-207-107.plesk.page/',
  production: 'https://nodejs.sprogteam.dk/',
  productionv2: 'https://nodejs.sprogteam.dk/',
};

export const AUTHAPIENV: ENVIRONMENT = {
  local: 'https://api.sweet-meitner.185-208-207-107.plesk.page/authenticate/',
  development:
    'https://api.sweet-meitner.185-208-207-107.plesk.page/authenticate/',
  production: 'https://mobile.sprogteam.dk/authenticate/',
  productionv2: 'https://mobile.sprogteam.dk/authenticate/',
};

export const suffix: string = 'api/';
export const authSuffix: string = 'auth/';
export const mailSuffix: string = 'mails/';
