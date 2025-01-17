import {
  ActionReducer,
  ActionReducerMap,
  MetaReducer
} from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';


import { reducer as authReducer } from './Auth/reducers/auth.reducer';
import { AuthState } from '../models/login.models';
import { environment } from 'src/environments/environment';
import { AuthActionTypes } from './Auth/actions/auth.actions';


export interface State {
  auth: AuthState;
}

export const reducers: ActionReducerMap<State> = {
  auth: authReducer
};




// export function clearState(reducer) {
//   return function (state, action) {

//     if (action.type === AuthActionTypes.AuthLogout) {
//       state = undefined;
//     }

//     return reducer(state, action);
//   };
// }

export function localStorageSyncReducer(
  reducer: ActionReducer<any>
): ActionReducer<any> {
  return localStorageSync({
    keys: [{
      auth: ['tokenResponse']
    }],
    rehydrate: true,
    storage: sessionStorage
  })(reducer);
}

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
