import { countriesMap } from './data/countries';

export const getCountryByCode = (code: string = '##') => {
  const country = countriesMap[code];
  if (!country) {
    throw new Error(`Country with code ${code} not found`);
  }
  return country;
};
