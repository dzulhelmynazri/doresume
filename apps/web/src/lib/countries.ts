import { getNames, registerLocale } from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";

registerLocale(en);

export interface CountryOption {
  code: string;
  name: string;
}

export const COUNTRIES: CountryOption[] = Object.entries(getNames("en"))
  .map(([code, name]) => ({
    code,
    name,
  }))
  .toSorted((left, right) => left.name.localeCompare(right.name));

const countryByCode = new Map(
  COUNTRIES.map((country) => [country.code, country])
);

export const getCountryName = (code: string) =>
  countryByCode.get(code)?.name ?? code;

export const getCountriesByCode = (codes: string[]) =>
  codes.flatMap((code) => {
    const country = countryByCode.get(code);

    return country ? [country] : [];
  });
