import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule, MetaReducer } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers, localStorageSyncReducer } from './core/redux';
import { effects } from './core/redux/effect.index';
import { ComponentsModule } from './shared/components/components.module';
import { LoadingComponent } from './shared/components/loading/loading.component';

const metaReducers: MetaReducer<any>[] = [localStorageSyncReducer];
@NgModule({
  declarations: [
    AppComponent,
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxPermissionsModule.forRoot(),
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot(effects),
    StoreRouterConnectingModule.forRoot({ stateKey: 'router' }),
    ComponentsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
