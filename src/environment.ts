import {ENVIRONMENT} from './types';

export const APIENV: ENVIRONMENT = {
  local: 'http://127.0.0.1:8000/',
  development: 'https://mobile.sweet-meitner.185-208-207-107.plesk.page/',
  production: 'https://mobileapi.sprogteam.dk/',
};

export const AUTHAPIENV: ENVIRONMENT = {
  local: 'https://api.sweet-meitner.185-208-207-107.plesk.page/authenticate/',
  development:
    'https://api.sweet-meitner.185-208-207-107.plesk.page/authenticate/',
  production: 'https://mobile.sprogteam.dk/authenticate/',
};

export const suffix: string = 'api/';
export const authSuffix: string = 'auth/';

// 4dubi3yyowxwzx5tvlnsjlzynoch4nfhqsf6lgtr36jybk76scpa
// techplanet49
// https://it0241@dev.azure.com/it0241/Barenemt2022/_git/BareNemtAuthApi
