import { Component } from '@angular/core';
import { AuthState } from './shared/models/main.model';
import { SetMenuItems } from './core/redux/Auth/actions/auth.actions';
import { MENU_ITEMS } from './shared/static/constant';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'DynamicGrid';

  constructor(
    private store$: Store<AuthState>
  ){
  this.store$.dispatch(new SetMenuItems(MENU_ITEMS));
  }

}
