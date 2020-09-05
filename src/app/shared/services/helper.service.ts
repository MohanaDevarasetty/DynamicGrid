import { Injectable, OnDestroy } from '@angular/core';
import { Subscription, Subject, Observable, BehaviorSubject, fromEvent } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthState } from '../models/main.model';
import { UtilityService } from './utility.service';
import { menuItemsMap } from 'src/app/core/redux/Auth/selectors/auth.selector';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class HelperService implements OnDestroy {
  menuItemsMap: any;
  subcriptions: Subscription[] = [];
  searchValue = '';
  private pendingHTTPRequests$ = new Subject<void>();
  private searchValue$ = new BehaviorSubject<boolean>(null);
  constructor(
    private store: Store<AuthState>,
    private http: HttpClient,
    private utilityService: UtilityService
  ) {

    this.subcriptions.push(this.store.select(menuItemsMap).subscribe(res => {
      this.menuItemsMap = res;
    }));

  }

  setSearchValue(value: boolean): any {
    this.searchValue$.next(value);
  }

  getSearchValue(): Observable<any> {
    return this.searchValue$.asObservable();
  }

  public cancelPendingRequests() {
    this.pendingHTTPRequests$.next();
  }

  public onCancelPendingRequests() {
    return this.pendingHTTPRequests$.asObservable();
  }

  getActionDetails(parentPage: string): Observable<any> {
    const filePath = 'assets/actions/' + parentPage.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-') + '.json';
    return this.http.get(filePath);
  }

  ngOnDestroy(): void {
    this.subcriptions.filter(subscription => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });
  }

}
