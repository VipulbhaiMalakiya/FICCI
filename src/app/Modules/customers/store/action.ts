import { createAction, props } from '@ngrx/store';
import { CountryList } from '../interface/customers';

export const invokeCoutrysAPI = createAction('[Coutrys API] Invoke Coutrys Fetch API');

export const booksFetchAPISuccess = createAction('[Coutrys API] Fetch API Success',
    props<{ allCoutrys: CountryList[] }>()
);
