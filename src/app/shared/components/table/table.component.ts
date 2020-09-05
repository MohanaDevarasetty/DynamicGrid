import { SortingEfficiencyService } from './../../../modules/receiving/sorting-efficiency/sorting-efficiency.service';
import {
  Component,
  OnInit,
  ViewChild,
  Input,
  EventEmitter,
  Output,
  AfterViewInit,
} from '@angular/core';
import { UtilityService } from '../../services';
import { PaginationComponent } from '../pagination/pagination.component';
import { element } from 'protractor';
import { ListService } from '../../services/list.service';
import {
  ROUTER_LINKS_NEXT,
  RECEIVING_SEQUENCE_URLS,
} from '../../constants/constants';
import { Router } from '@angular/router';
import { TruckInfoService } from 'src/app/modules/receiving/receiving-material/services';
import { BinLoadingSummary, Pagination, View } from '../../models/views.model';
import { DryingProcess } from '../../models/drying.model';
import { DryingProcessIntegrationMapperService } from '../../mapper/dryingProcess/drying-process-integration-mapper.service';
import { DryingService } from '../../services/drying.service';
import { ShellingService } from '../../services/shelling.service';
import { ConditioningService } from '../../services/conditioning.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
})
export class TableComponent implements OnInit, AfterViewInit {
  @ViewChild(PaginationComponent, { static: false })
  pagination: PaginationComponent;
  @Output() readonly binLoadingEmitter = new EventEmitter<any>();
  @Output() readonly dryingProcessEmitter = new EventEmitter<any>();
  @Output() readonly dryingMonitoringProcessEmitter = new EventEmitter<any>();
  @Output() readonly shellingProcessEmitter = new EventEmitter<any>();
  @Output() readonly conditioningProcessEmitter = new EventEmitter<any>();
  @Output() readonly warehouseProcessEmitter = new EventEmitter<any>();
  @Output() readonly workorderProcessEmitter = new EventEmitter<any>();
  @Output() readonly pageNumberEmitter = new EventEmitter<any>();
  headers: any[] = [];
  list: any[] = [];
  keyMap = new Map();
  pagedItems: any[] = [];
  sortType: string;
  colSpanLength = 1;
  permissionCode = '';
  selectedType = '';
  paginationDetails: Pagination;
  selectedSummaryDetails;
  tableDetails: View = {};
  selectedHeaderTh: string;
  actions;

  @Input('headers')
  set setHeaders(value) {
    if (value) {
      this.headers = value;
    } else {
      this.headers = [];
    }
  }

  @Input('list')
  set setList(value) {
    if (value) {
      this.list = value;
    } else {
      this.list = [];
    }
  }

  @Input('keyMap')
  set setKeyMap(value) {
    this.keyMap = value;
  }

  @Input('permissionCode')
  set setParentPage(value) {
    this.permissionCode = value;
  }

  @Input('tableDetails')
  set setTableDetails(value) {
    this.tableDetails = value;
  }

  @Input('actionDetails')
  set setActionDetails(value) {
    this.actions = value;
  }

  constructor(
    private utilityService: UtilityService,
    private listService: ListService,
    private truckInfoService: TruckInfoService,
    public router: Router,
    private dryingProcessServiceIntegration: DryingProcessIntegrationMapperService,
    private dryingService: DryingService,
    private sortingEfficiencyService: SortingEfficiencyService,
    private shellingService: ShellingService,
    private conditioningService: ConditioningService
  ) {}
  ngAfterViewInit(): void {
    if (!this.actions) {
      if (!this.actions) {
        this.actions = {
          Fields: 'action',
          displayname: 'Action',
          is_hyperlink: 'Y',
          buttons: {
            view: 'View',
            proceed: 'Proceed',
          },
          condition: {
            view: '1===1',
            proceed: '1===1',
          },
          titles: {
            view: 'View Details',
            proceed: 'Proceed to watch',
          },
        };
      }
    }
  }

  ngOnInit() {
    this.pagedItems = Object.assign(this.list);
    this.colSpanLength = this.headers.filter(
      (ele) => this.keyMap.get(ele).available && this.keyMap.get(ele).isActive
    ).length;
  }

  changePagedItems(data: any[]): void {
    this.pagedItems = [];
    this.pagedItems = data;
    this.colSpanLength = this.headers.filter(
      (ele) => this.keyMap.get(ele).available && this.keyMap.get(ele).isActive
    ).length;
  }

  setPage(pageDetails): void {
    this.pageNumberEmitter.emit(pageDetails);
  }

  getClass(field): any {
    return this.utilityService.getClass(
      field,
      this.sortType,
      this.selectedHeaderTh
    );
  }

  sort(sortKey: any): void {
    let sortResult: any;
    this.selectedHeaderTh = sortKey;
    sortResult = this.utilityService.sort(sortKey, this.list, this.sortType);
    this.list = sortResult['result'];
    this.changePagedItems(this.list);
    this.sortType = sortResult['sortType'];
    // if (this.pagination) {
    //   this.pagination.setPage(1);
    // }
  }

  conditionCheck(condition: string, details: any): boolean {
    const record = details;
    return eval(condition);
  }

  viewOrEditDetails(record: any): void {
    let underscoreName = this.utilityService.getUnderscoredNameFromParentPage(
      this.permissionCode
    );
    let link = ROUTER_LINKS_NEXT[underscoreName];

    if (underscoreName === 'RECEIVING_QC_SORTING_EFFICIENCY_SUMMARY') {
      this.sortingEfficiencyService.setWholeSelectedObject(record);
      link =
        ROUTER_LINKS_NEXT['RECEIVING_QC_SORTING_EFFICIENCY_REJECTED_SUMMARY'] + '/list';
    } else if (underscoreName === 'RECEIVING_QC_SORTING_EFFICIENCY_REJECTED_SUMMARY') {
      this.sortingEfficiencyService.setWholeSelectedObject(record);
      if (record.sample_type === 'REJECTED'){
          link =
          ROUTER_LINKS_NEXT['RECEIVING_QC_SORTING_EFFICIENCY_REJECTED_SUMMARY'];
      } else {
          link =
          ROUTER_LINKS_NEXT['RECEIVING_QC_SORTING_EFFICIENCY_ACCEPTED_SUMMARY'];
      }
    } else if(underscoreName === 'WAREHOUSE_INVENTORY_SUMMARY') {
      link =
          ROUTER_LINKS_NEXT['WAREHOUSE_INVENTORY_DETAILS_SUMMARY'];
    } else if(underscoreName === 'WAREHOUSE_INVENTORY_DETAILS_SUMMARY') {
      link =
          ROUTER_LINKS_NEXT['WAREHOUSE_INVENTORY_DETAILS_SUMMARY_BY_BATCH'];
    } else {
      link = ROUTER_LINKS_NEXT[underscoreName];
    }
    if (this.router.url.includes('/receiving/viewsummary')) {
      this.truckInfoService.setTruckInfo(record);
    }
    if (this.router.url.includes('/shelling/viewsummary')) {
      this.shellingService.setWholeSelectedObject(record);
    } else if (this.router.url.includes('/conditioning/viewsummary')){
      this.conditioningService.setWholeSelectedObject(record);
    } else {
      this.listService.setWholeSelectedObject(record);
    }
    this.router.navigate([link]);
  }

  processLoading(action: string, summaryDetails: BinLoadingSummary): void {
    const obj = {
      type: action,
      record: summaryDetails,
    };
    this.binLoadingEmitter.emit(obj);
  }

  navigator(type: string, summaryDetails: any): void {
    this.dryingService.setWholeSelectedObject(summaryDetails);
    if (type === 'monitor') {
      this.router.navigate(['/plant/drying/monitoring/list']);
    } else {
      this.router.navigate(['/plant/drying/breakdown/list']);
    }
  }

  dryingProcess(action: any, details: any): void {
    const obj = {
      type: action,
      record: details,
    };
    this.dryingProcessEmitter.emit(obj);
  }

  processExcutions(action: string, selectedRecrod: any): void {
    const obj = {
      type: action,
      record: selectedRecrod,
      url: this.router.url
    };
    if (this.router.url.includes('/plant/receiving/binloading/list')) {
      this.binLoadingEmitter.emit(obj);
    } else if (this.router.url.includes('/plant/drying/viewsummary')) {
      this.dryingProcessEmitter.emit(obj);
    } else if (this.router.url.includes('/plant/drying/monitoring/list')) {
      this.dryingMonitoringProcessEmitter.emit(obj);
    } else if (this.router.url.includes('/plant/shelling/viewsummary')) {
      this.shellingProcessEmitter.emit(obj);
    } else if (this.router.url.includes('/plant/conditioning/viewsummary') ||
      this.router.url.includes('/plant/conditioning/loading/list')) {
      this.conditioningProcessEmitter.emit(obj);
    } else if (this.router.url.includes('/plant/warehouse/viewsummary')) {
      this.warehouseProcessEmitter.emit(obj);
    } else if (this.router.url.includes('/plant/workorder/viewsummary')) {
      this.workorderProcessEmitter.emit(obj);
    }
  }

  processNavigation(
    action: string,
    selectedRecord: any,
    navigationLink?: string
  ): void {
    if (navigationLink) {
      if (this.router.url.includes('/drying')) {
        this.dryingService.setWholeSelectedObject(selectedRecord);
      } else if (this.router.url.includes('/receiving')) {
        this.listService.setWholeSelectedObject(selectedRecord);
      } else if (this.router.url.includes('/shelling')) {
        this.shellingService.setWholeSelectedObject(selectedRecord);
      } else if (this.router.url.includes('/conditioning')) {
        this.listService.setWholeSelectedObject(selectedRecord);
      }
      this.router.navigate([navigationLink]);
    }
  }
}
