import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ListComponent } from '../list/list.component';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { NON_LIST_SEQUENCE_URLS, NO_ADD_NEW_URLS, ROUTER_LINKS_NEXT, ENABLE_PERMISSIONS } from '../../static/constant';
import { menuItemsMap } from 'src/app/core/redux/Auth/selectors/auth.selector';
import { UtilityService } from '../../services/utility.service';
import { AuthState } from '../../models/main.model';
import { Store } from '@ngrx/store';


@Component({
  selector: 'app-summary-view',
  templateUrl: './summary-view.component.html',
  styleUrls: ['./summary-view.component.css'],
})
export class SummaryViewComponent implements OnInit, OnDestroy {
  @ViewChild(ListComponent, { static: false}) listComponent: ListComponent;
  allPermission = '';
  viewPermission = '';
  parentPage = '';
  menuItemsMap: any;
  enableData: boolean;
  routerNavigationlink = '';
  title = 'Summary';
  fielName = '';
  addButtonTitle = '+ Add New';
  isPermissionEnabled = ENABLE_PERMISSIONS;
  subcriptions: Subscription[] = [];
  nonListSequenceUrls = NON_LIST_SEQUENCE_URLS;
  nonNewAddButtonUrls = NO_ADD_NEW_URLS;
  stepperDetails = [];
  constructor(
    public route: Router,
    protected utilityService: UtilityService,
    protected store: Store<AuthState>
  ) {
    this.subcriptions.push(
      this.store.select(menuItemsMap).subscribe((res) => {
        if (res) {
          this.menuItemsMap = res;
          this.setPageDetails();
        }
      })
    );
  }

  ngOnInit(): void {
    // TODO if required
  }

  setPageDetails(): void {
    this.enableData = false;
    if (Object.keys(this.menuItemsMap).length) {
      this.parentPage = this.menuItemsMap[this.route.url].code;
      this.title = this.menuItemsMap[this.route.url].name
        ? this.menuItemsMap[this.route.url].name
        : this.title;
      this.allPermission = this.parentPage + '.ALL';
      this.viewPermission = this.parentPage + '.VIEW';
      const underscoreName = this.utilityService.getUnderscoredNameFromParentPage(
        this.parentPage
      );
      if (underscoreName) {
        this.routerNavigationlink = ROUTER_LINKS_NEXT[underscoreName];
      }
      this.generateFormName();
      this.enableData = true;
    }
  }

  checkAddButtonStatusFromService(): boolean {
    // TODO based on business
    return true;
  }

  generateFormName(): void {
    const path = this.utilityService.getAfterContextPath(this.route.url);
    this.fielName = path + '_' + 'list';
  }

  processTrigger($event): void {
    // implementation at inherited child
    // console.log
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem('searchText');
    this.subcriptions.forEach((subscription) => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });
  }
}
