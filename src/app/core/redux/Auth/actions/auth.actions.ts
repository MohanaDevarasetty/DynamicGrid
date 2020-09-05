import { Action } from '@ngrx/store';


export enum AuthActionTypes {
  SetMenuItems = '[App] Set Menu Items'
}


export class SetMenuItems implements Action {
  readonly type = AuthActionTypes.SetMenuItems;
  constructor(public payload: any) { }
}

export type AuthActions =
| SetMenuItems;
