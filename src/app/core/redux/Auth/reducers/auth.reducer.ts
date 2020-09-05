import { AuthActions, AuthActionTypes } from '../actions/auth.actions';
import { AuthState, initialState } from 'src/app/shared/models/main.model';

export function reducer(state: AuthState = initialState, action: AuthActions): AuthState {
  switch (action.type) {

    case AuthActionTypes.SetMenuItems:
      return {
        ...state,
        menuItems: action.payload
      };

    default:
      return state;
  }
}
