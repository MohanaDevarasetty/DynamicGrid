import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { View, Pagination, SelectedPageDetails } from '../../models/list.model';
import { PAGINATION_RECORDS_PER_PAGE } from '../../static/constant';
import { PaginationService } from '../../services/pagination.service';


@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html'
})
export class PaginationComponent implements OnInit {

  pager: any;
  _list: any = [];
  listView: View;
  @Input() parentPage: string;
  @Input() parentComponent: any;
  @Output() readonly emiter = new EventEmitter<any>();
  @Output() readonly setPageEmitter = new EventEmitter<any>();
  recordsPerPage = PAGINATION_RECORDS_PER_PAGE[0];
  entriesPerPageDropDown = PAGINATION_RECORDS_PER_PAGE;
  pagedItems: any[] = [];
  paginationDetails: Pagination;

  constructor(
    private paginationService: PaginationService
  ) {
  }

  ngOnInit() {
  }

  get list(): any {
    return this._list;
  }

  @Input('list')
  set list(value: any) {
    this._list = value;
    // this.setPage(1);
  }

  @Input('tableDetails')
  set setTableDetails(value: any) {
    this.listView = value;
    this.setPaginationDetails(this.listView.currentPageNumber);
  }

  changeInRecordsPerPage(event: any): void {
    this.recordsPerPage = event ? Number(event) : PAGINATION_RECORDS_PER_PAGE[0];
    this.setPage(1);
  }

  setPaginationDetails(page: number = 1): void {
    this.recordsPerPage = this.listView.pageSize;
    this.pagedItems = this.listView.results;
    this.pager = this.paginationService.getPager(
        this.listView.noOfRecords, this.listView.noOfPages,
        this.listView.pageSize,  page);
  }



  // setPage(page: number): void {
  //   if (this.list && this.list.length) {
  //     this.pager = this.paginationService.getPager(
  //       this.list.length,
  //       page,
  //       this.recordsPerPage
  //     );
  //     this.pagedItems = this.list.slice(
  //       this.pager.startIndex,
  //       this.pager.endIndex + 1
  //     );
  //   } else {
  //     this.pagedItems = this.list;
  //   }
  //   setTimeout(() => {
  //     this.emiter.emit(this.pagedItems);
  //   });

  // }

  setPage(page: number): void {
    const pageDetails: SelectedPageDetails = {
      page: page ? page : 1,
      entriesPerPage: this.recordsPerPage
    };
    this.setPageEmitter.emit(pageDetails);
  }

}
