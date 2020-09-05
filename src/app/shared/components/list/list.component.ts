import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { TableComponent } from '../table/table.component';
import { SearchBoxComponent } from '../search-box/search-box.component';
import { EventEmitter } from 'events';
import { PAGINATION_RECORDS_PER_PAGE } from '../../static/constant';
import { Subscription } from 'rxjs';
import { UtilityService } from '../../services/utility.service';
import { Router } from '@angular/router';
import { HelperService } from '../../services/helper.service';
import { ListService } from '../../services/list.service';
import { View } from '../../models/list.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit, OnDestroy {
  @ViewChild(TableComponent, {static: false}) tableComponent: TableComponent;
  @ViewChild(SearchBoxComponent, {static: false}) searchBoxComponent: SearchBoxComponent;
  parentPage: string;
  tableDetails: View = {};
  headers: any[] = [];
  keyMap = new Map();
  list: any[] = [];
  actualList: any[] = [];
  enableTable = false;
  pageNumber = 1;
  recordsPerPage = PAGINATION_RECORDS_PER_PAGE[0];
  actionDetails;
  isSearch = false;
  searchValue = '';
  subscriptions: Subscription[] = [];

  @Input('parentPage')
  set setParentPage(value) {
    this.parentPage = value;
  }

  constructor(
    private listService: ListService,
    private utilityService: UtilityService,
    private router: Router,
    private helperService: HelperService
  ) {
  }

  ngOnInit(): void {
    this.getTableListDetails();
  }

  getTableListDetails(inputPayload?: any): void {
    const code = this.parentPage;
    let inputDetails;
    if (inputPayload) {
      inputDetails = inputPayload;
    } else {
      if (this.searchBoxComponent && this.searchBoxComponent.searchText) {
        inputDetails = this.searchBoxComponent.payload;
      } else {
      inputDetails = this.getInputDetailsObject();
      }
    }
    this.enableTable = false;
    this.helperService.getActionDetails(this.parentPage).subscribe(details => {
        this.actionDetails = details;
        this.getListDetails(inputDetails, code);
    },
    () => {
      this.getListDetails(inputDetails, code);
    });
  }

  getListDetails(inputDetails: any, code: any): void {
    this.listService.getTableDetails(inputDetails, code, this.pageNumber, this.recordsPerPage).subscribe(res => {
      if (!res['parameters'] && res['columnNames']) {
        const viewDetails: View = res;
        viewDetails.currentPageNumber = this.pageNumber;
        viewDetails.pageSize = this.recordsPerPage;
        this.tableDetails = viewDetails;
        this.getColumnHeadersMap(viewDetails.columnNames);
        this.getHeaders(viewDetails.columnNames);
        this.list = viewDetails.results;
        this.actualList = Object.assign(viewDetails.results);
        this.enableTable = true;
      }
    });
  }

  setPageDetailsOnChange(pageDetails: any): void {
    this.pageNumber = pageDetails.page ? pageDetails.page : 1;
    this.recordsPerPage = pageDetails.entriesPerPage ? pageDetails.entriesPerPage : PAGINATION_RECORDS_PER_PAGE[0];
    this.getTableListDetails();
  }

  getInputDetailsObject(): any {
    const inputDetails = {};
    // TODO
    return inputDetails;
  }

  getColumnHeadersMap(list: any[]): void {
    this.keyMap = this.utilityService.extractColumnNamesFromObject(list);
  }

  getHeaders(list: any[]): void {
    this.headers = this.utilityService.extractColumnKeysList(list);
  }

  changeList(value: any): void {
    this.list = value;
  }

  ngOnDestroy(): void {
    if (this.subscriptions.length) {
      this.subscriptions.forEach(sub => sub.unsubscribe());
    }
  }

}
