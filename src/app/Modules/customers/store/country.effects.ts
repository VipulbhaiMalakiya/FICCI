import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as CountryActions from './country.actions';
import { CustomersService } from '../Export/new-customer';

@Injectable()
export class CountryEffects {

  loadCountryList$ = createEffect(() => this.actions$.pipe(
    ofType(CountryActions.loadCountryList),
    switchMap(() => this.countryService.getCountryList()
      .pipe(
        map(countries => CountryActions.loadCountryListSuccess({ countries })),
        catchError(error => of(CountryActions.loadCountryListFailure({ error })))
      ))
    )
  );

  constructor(
    private actions$: Actions,
    private countryService: CustomersService
  ) {}
}
