import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from 'src/app/shared/models/main.model';


export const getAuthState = createFeatureSelector<AuthState>(
  'auth'
);


export const menuItemsMap = createSelector(getAuthState, (state: AuthState) => state.menuItems);
