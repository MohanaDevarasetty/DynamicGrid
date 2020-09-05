import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import * as moment from 'moment';
import * as _ from 'lodash';
import { FILE_TYPE, FILE_EXD, CONTENT_TYPE } from '../static/constant';

@Injectable({
  providedIn: 'root'
})
export class ExportFileService {
  findMaxLengthOfKeys: any = [];

  constructor() { }

  public exportAsFile(json: any[], exportWith: any, fileName: string, fileType: string): void {
    if (fileType === FILE_TYPE.CSV) {
      this.exportAsCSVFile(json, exportWith, fileName);
    } else if (fileType === FILE_TYPE.EXCEL) {
      this.exportAsExcelFile(json, exportWith, fileName);
    }
  }

  private exportAsCSVFile(json: any[], exportWith: any, fileName: string): void {
    const worksheet = this.constructWorkSheet(json, exportWith);
    const csvOutput: string = XLSX.utils.sheet_to_csv(worksheet);
    this.saveAsFile(csvOutput, fileName, CONTENT_TYPE.APPLICATION_CSV, FILE_EXD.CSV);
  }

  private exportAsExcelFile(json: any[], exportWith: any, fileName: string): void {
    const worksheet = this.constructWorkSheet(json, exportWith);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsFile(excelBuffer, fileName, CONTENT_TYPE.APPLICATION_EXCEL, FILE_EXD.EXCEL);
  }

  private constructWorkSheet(json: any[], exportWith: any): any {
    this.findMaxLengthOfKeys = [];
    // tslint:disable-next-line:forin
    for (const pop in json) {
      this.findMaxLengthOfKeys.push(Object.keys(json[pop]).length);
    }
    const maxLengthOfKeysIndex = this.findMaxLengthOfKeys.indexOf(Math.max(...this.findMaxLengthOfKeys));
    const tempArray = _.keys(json[maxLengthOfKeysIndex]);
    const exportKeys = [];
    exportWith.forEach(element => {
      if (tempArray.includes(element.key)) {
        exportKeys.push(element.value);
      }
    });
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let C = range.s.r; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_col(C) + '1';
      if (!worksheet[address]) { continue; }
      worksheet[address].v = exportKeys[C];
    }
    return worksheet;
  }

  private saveAsFile(value: any, fileName: string = '', blobType: string, extension: string): void {
    const data: Blob = new Blob([value], {
      type: blobType
    });
    FileSaver.saveAs(data, fileName + '_' + moment().valueOf() + extension);
  }
}
