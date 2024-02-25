import { createAction, props } from '@ngrx/store';
import { CountryList } from '../interface/customers';

export const loadCountryList = createAction('[Country] Load Country List');
export const loadCountryListSuccess = createAction(
  '[Country] Load Country List Success',
  props<{ countries: CountryList[] }>()
);
export const loadCountryListFailure = createAction(
  '[Country] Load Country List Failure',
  props<{ error: any }>()
);
