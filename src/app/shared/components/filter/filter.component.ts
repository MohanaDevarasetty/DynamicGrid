import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { UtilityService } from '../../services/utility.service';
import { DELIMTERS } from '../../static/constant';


@Component({
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    '(document:click)': 'onClick($event)'
  },
  selector: 'app-filter',
  templateUrl: './filter.component.html'
})
export class FilterComponent implements OnInit {
  @ViewChild('filterFunButton', {static: false}) filterFunButton: ElementRef;
  @ViewChild('filterFunDiv', {static: false}) filterFunDiv: ElementRef;
  headers: any[] = [];
  keyMap = new Map();
  selection = new SelectionModel(true, []);
  parentPage = '';
  storageName = '';
  openFilter: boolean;
  availableHeaders: any[] = [];
  @Input('headers')
  set setHeaders(value) {
    if (value) {
      this.headers = value;
    } else {
      this.headers = [];
    }
  }

  @Input('keyMap')
  set setKeyMap(value) {
    this.keyMap = value;
  }

  @Input('parentPage')
  set setParentPage(value) {
    this.parentPage = value;
    if (value) {
      this.storageName = this.utilityService.getUnderscoredNameFromParentPage(value);
    }
  }

  constructor(
    private utilityService: UtilityService
  ) { }

  onClick(event: any): void {
    if (
      this.filterFunButton &&
      this.filterFunDiv &&
      !this.filterFunButton.nativeElement.contains(event.target) &&
      !this.filterFunDiv.nativeElement.contains(event.target)
    ) {
      this.openFilter = false;
    }
  }

  ngOnInit() {
    if (this.headers.length) {
      this.availableHeaders = this.headers.filter(header => this.keyMap.get(header).available);
    }
    this.activateAllAvailableColumns();
  }

  filterFunction() {
    // var element = document.getElementById("filter-dropdown");
    // element.classList.toggle("show");
    this.openFilter = !this.openFilter;
}

  masterToggle(event: any): void {
    if (event.target.checked) {
      this.availableHeaders.filter(element => {
        if (this.keyMap.get(element).available) {
          this.keyMap.get(element).isActive = true;
          this.selection.select(element);
          // localStorage.setItem(this.storageName + DELIMTERS.FILTER_DELIMETER, btoa(JSON.stringify(this.selection.selected)));
        }
      });
    } else {
      this.availableHeaders.filter((ele, index) => {
        if (index > 0) {
          this.keyMap.get(ele).isActive = false;
          this.selection.deselect(ele);
        } else {
          this.keyMap.get(ele).isActive = true;
        }
      });
      // localStorage.removeItem(this.storageName + DELIMTERS.FILTER_DELIMETER);
    }
    localStorage.setItem(this.storageName + DELIMTERS.FILTER_DELIMETER, btoa(JSON.stringify(this.selection.selected)));
  }

  activateAllAvailableColumns(): void {
    const savedHeaders: string  = localStorage.getItem(this.storageName + DELIMTERS.FILTER_DELIMETER);
    if (savedHeaders) {
      const customizedHeaders: any[] = JSON.parse(atob(savedHeaders));
      this.headers.filter(ele => {
        if (this.keyMap.get(ele).available && customizedHeaders.includes(ele)) {
          this.keyMap.get(ele).isActive = true;
          this.selection.select(ele);
        } else {
          this.keyMap.get(ele).isActive = false;
        }
      });
    } else {
      this.headers.filter(headEle => {
        if (this.keyMap.get(headEle).available) {
          this.keyMap.get(headEle).isActive = true;
          this.selection.select(headEle);
          localStorage.setItem(this.storageName + DELIMTERS.FILTER_DELIMETER, btoa(JSON.stringify(this.selection.selected)));
        } else {
          this.keyMap.get(headEle).isActive = false;
        }
      });
    }
  }

  isAllSelected(): boolean {
    localStorage.setItem(this.storageName + DELIMTERS.FILTER_DELIMETER, btoa(JSON.stringify(this.selection.selected)));
    const selectionLength = this.selection.selected.length;
    const allavailableColumns: any[] = this.headers.filter(element => this.keyMap.get(element).available);
    return selectionLength === allavailableColumns.length;
  }

  selectColumn(event: any, header: string): void {
    if (event.target.checked) {
      this.keyMap.get(header).isActive = true;
      this.selection.select(header);
    } else {
      this.keyMap.get(header).isActive = false;
      this.selection.deselect(header);
    }
  }

}
