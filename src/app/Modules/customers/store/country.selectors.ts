import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CountryState } from './country.reducer';
import { CountryList } from '../interface/customers';

export const selectCountryState = createFeatureSelector<CountryState>('country');

export const selectCountries = createSelector(
  selectCountryState,
  state => state.countries
);

export const selectCountryById = (countryId: string) =>
  createSelector(
    selectCountries,
    (countries: CountryList[]) => countries.find(country => country.countryId === countryId)
  );

