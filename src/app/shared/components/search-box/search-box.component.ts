import { Component, OnInit, ViewChild, ElementRef,
  Input, Output, EventEmitter, HostListener, AfterViewInit } from '@angular/core';
import { fromEvent } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html'
})
export class SearchBoxComponent implements OnInit, AfterViewInit {

  @ViewChild('searchTextBox', {static: false}) searchTextBox: ElementRef;
  @ViewChild('searchTextButton', {static: false}) searchTextButton: ElementRef;
  @Output() readonly emiter = new EventEmitter<any>();
  list: any[] = [];
  headers: any[] = [];
  keyMap = new Map();
  searchText: string;
  actualList: any[] = [];
  searchClass = false;
  payload: any = {};

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

  constructor(
    private utilityService: UtilityService
  ) { }

  ngOnInit(): void {
    this.searchText = sessionStorage.getItem('searchText') ? sessionStorage.getItem('searchText') : '';
  }

  // to collapse the search box in mobile on clicking on DOM
  @HostListener('click', ['$event']) onClick(event: any): void {
    if (!this.searchTextBox.nativeElement.contains(event.target) && !this.searchTextButton.nativeElement.contains(event.target)) {
      this.searchClass = false;
    }
  }

  searchRecords(): void {
    if (this.searchText) {
      const inputKeys = this.headers.filter(header => (this.keyMap.get(header).available && this.keyMap.get(header).isActive ));
      this.list = this.utilityService.searchWildTextInRecords(this.searchText, inputKeys, Object.assign(this.actualList));
    } else {
      this.list = Object.assign(this.actualList);
    }
    setTimeout(() => {
      this.emiter.emit(this.list);
    });
  }

  searchRecordsFromService(): void {
    this.payload = {};
    sessionStorage.setItem('searchText', this.searchText);
    if (this.searchText) {
      this.headers.filter(header => {
        if (this.keyMap.get(header).available && this.keyMap.get(header).isActive) {
          this.payload[header] = this.searchText;
        }
      });
      this.payload['search_criteria'] = 'OR';
    }
    this.emiter.emit(this.payload);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.debounceOfSearchBox();
    }, 0);
  }

  debounceOfSearchBox(): void {
    fromEvent(this.searchTextBox.nativeElement, 'keyup')
    .pipe(map((evt: any) => evt.target.value),
      debounceTime(1000))
    .subscribe((inputValue: string) => {
      this.searchRecordsFromService();
    });
  }

}
