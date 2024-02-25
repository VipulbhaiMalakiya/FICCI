import { createReducer, on } from '@ngrx/store';
import * as CountryActions from './country.actions';
import { CountryList } from '../interface/customers';

export interface CountryState {
  countries: CountryList[];
  loading: boolean;
  error: any;
}

export const initialState: CountryState = {
  countries: [],
  loading: false,
  error: null
};

export const countryReducer = createReducer(
  initialState,
  on(CountryActions.loadCountryList, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CountryActions.loadCountryListSuccess, (state, { countries }) => ({
    ...state,
    countries,
    loading: false
  })),
  on(CountryActions.loadCountryListFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);
