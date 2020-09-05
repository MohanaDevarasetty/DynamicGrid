import { Injectable } from '@angular/core';
import { HelperService } from './helper.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ListService {
  viewSelectedObject: any;
  wholeSelectedObject: any;
  list: any[] = [];
  constructor(
    private http: HttpClient,
    private helperService: HelperService
  ) { }

  setviewSelectedObjectData(data: any) {
    this.viewSelectedObject = data;
  }

  getviewSelectedObjectData(): any {
    return this.viewSelectedObject;
  }

  setWholeSelectedObject(data: any) {
    this.wholeSelectedObject = data;
  }

  getWholeSelectedObject(): any {
    return this.wholeSelectedObject;
  }

  setList(data: any[]) {
    this.list = data;
  }

  getList(): any {
    return this.list;
  }

  getTableDetails(inputDetails: any, privilegeName, pageNumber: number = 1, recrodsPerPge: number): Observable<any> {
    const uri = '' + `api/view/getList/privilegeName/${privilegeName}?pageNumber=${pageNumber - 1}&pageSize=${recrodsPerPge}`;
    return this.http.get(uri, inputDetails);
  }
}
