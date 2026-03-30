export const VALIDATION_MESSAGES = {
  REQUIRED: 'Būtinai užpildomas laukelis!',
  USER_NOT_FOUND: 'Naudotojas nerastas',
  CART_EMPTY: 'Pirkinių krepšys tuščias!',
  PRODUCT_ADDED: 'Prekė įdėta į krepšį',
} as const;

export const ERROR_MESSAGES = {
  notFound: {
    code: '404 klaida',
    message: 'Puslapis nerastas!',
  },
} as const;

export const GRAPHQL_URL = 'https://online.depo-diy.lt/graphql';

export const STOCK_LOCATION_ID = 56;
export const STOCK_LOCATION_NAME = 'Kaunas, Vakarinis aplink. 8';


export const SEARCH_MESSAGES = {
  NO_RESULTS: 'nerastas nei vieno rezultato',
  HEADER_MESSAGE: 'Paieškos rezultatai pagal',
} as const;
