import { Component, OnInit } from '@angular/core';
import {  Subscription, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { LoadingService } from '../../services/loading.service';
import { AuthState } from '../../models/main.model';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {
  subscription: Subscription;
  isLoading$: boolean;
  storeLoding$: Observable<boolean>;
  constructor(
    private loaderService: LoadingService,
    private store: Store<AuthState>) {
  }

  ngOnInit() {
    this.subscription = this.loaderService.getLoader().subscribe((res: any) => {
      this.isLoading$ = res;
    });
  }

  destroySubscription(): void {
    this.subscription.unsubscribe();
  }

}
