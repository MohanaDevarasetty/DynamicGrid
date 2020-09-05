import { Component, OnInit, Input } from '@angular/core';
import { SplitCamelCasePipe } from '../../pipes/splitCamelCase.pipe';
import * as _ from 'lodash';
import { ExportFileService } from '../../services/export-file.service';
import { UtilityService } from '../../services/utility.service';


@Component({
  selector: 'app-export-file',
  templateUrl: './export-file.component.html'
})
export class ExportFileComponent implements OnInit {
  headers: any[] = [];
  list: any[] = [];
  keyMap = new Map();
  parentPage = '';

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

  @Input('parentPage')
  set setParentPage(value) {
    this.parentPage = value;
  }

  constructor(
    private exportFileService: ExportFileService,
    private utilityService: UtilityService
  ) { }

  ngOnInit(): void {
  }

  exportFile(fileType: string): void {
    let customizedList: any = [];
    const fileName = this.parentPage ? this.utilityService.getUnderscoredNameFromParentPage(this.parentPage) : 'LIST';
    const jsonKeys = this.headers.filter(ele => (this.keyMap.get(ele).available && this.keyMap.get(ele).isActive));
    if (jsonKeys.length) {
      const dispNames = jsonKeys.map(element => {
        if (this.keyMap.get(element).available && this.keyMap.get(element).isActive) {
          const displayName = SplitCamelCasePipe.prototype.transform(this.keyMap.get(element).displayName);
          return displayName;
        }
      });
      const exportWith = _.zipWith(jsonKeys, dispNames, (key, value) => ({ key, value }));
      let newModel = {};
      newModel = _.map(this.list, _.partialRight(_.pick, jsonKeys));
      customizedList = newModel;
      this.exportFileService.exportAsFile(customizedList, exportWith, fileName, fileType);
    }
  }

}
