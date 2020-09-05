import { Injectable, Injector } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { FilterPipe } from '../pipes/filterPipe.pipe';
import { NgxPermissionsService } from 'ngx-permissions';
import { TITLE_MESSAGES } from '../static/message.constant';
import { HTTP_METHODS, HTTP_REQUEST_MESSAGES, REPLACEBLE_ITEMS } from '../static/constant';
import { LoadingService } from './loading.service';


@Injectable({
    providedIn: 'root'
})
export class UtilityService {
    private requests: HttpRequest<any>[] = [];

    constructor(
                private permissionsService: NgxPermissionsService,
                private loadingService: LoadingService
    ) {
    }

    setRequests(url: HttpRequest<any>): void {
        this.requests.push(url);
    }

    getRequests(): any {
        return this.requests;
    }

    removeHttpRequest(req: HttpRequest<any>): any {
        const i = this.requests.indexOf(req);
        if (i >= 0) {
            this.requests.splice(i, 1);
        }
        this.loadingService.setLoader(this.requests.length > 0);
    }

    extractColumnNamesFromObject(data: any[] = []): Map<string, object> {
        const map = new Map();
        if (data.length) {
            data.filter((element: string, index: any) => {
                const array = element.split('__');
                const elementObject = {
                    keyColumn: array[0].substr(0, 1) === '1' ? 1 : 0,
                    available: array[0].substr(1, 1) === '1' ? 1 : 0,
                    key: array[1] ? array[1] : 'key',
                    displayName: array.length > 2 && array[2] ? array[2] : 'Column ' + (index + 1),
                    type: array.length > 3 && array[3] ? array[3] : 'String',
                    isActive: true
                };
                map.set(array[1], elementObject);
            });
        }
        return map;
    }

    extractColumnKeysList(data: any[] = []): any[] {
        const columnKeysList: any[] = [];
        if (data.length) {
            data.filter(element => {
                const array = element.split('__');
                // if (array[0]) {
                columnKeysList.push(array[1]);
                // }
            });
        }
        return columnKeysList;
    }

    getClass(field: string, sortType: string, selectedHeader: string): any {
        if (sortType === 'asc' && field === selectedHeader) {
            return 'sorting_desc';
        }
        if (field === selectedHeader) {
            return 'sorting_asc';
        }
        return 'sorting';
    }

    sort(sortKey: any, inputData: any, sortType: string): any {
        if (!inputData || !inputData.length) {
            const tempObj = { result: [], sortType };
            return tempObj;
        }
        if (sortType === 'asc') {
            inputData = inputData.sort(
                this.compareValues(sortKey, 'asc')
            );
            sortType = 'desc';
        } else {
            inputData = inputData.sort(
                this.compareValues(sortKey, 'desc')
            );
            sortType = 'asc';
        }
        const returnObject = { result: inputData, sortType };
        return returnObject;
    }

    compareValues(key: any, order: any = 'asc'): any {
        let current;
        let next;
        // tslint:disable-next-line: only-arrow-functions
        return function(currentValue: any, nextValue: any): any {
            if (!currentValue.hasOwnProperty(key) || !nextValue.hasOwnProperty(key)) {
                return 0;
            }
            if (key) {
                current = (currentValue[key]) ? ((typeof currentValue[key] === 'string' || typeof currentValue[key] === 'boolean') ?
                    currentValue[key].toString().toLowerCase() : currentValue[key])
                    : currentValue[key];
                next = (nextValue[key]) ? ((typeof nextValue[key] === 'string' || typeof nextValue[key] === 'boolean') ?
                    nextValue[key].toString().toLowerCase() : nextValue[key])
                    : nextValue[key];
                // next = (nextValue[key]) ? nextValue[key].toString().toLowerCase() : nextValue[key];
            } else {
                current = currentValue;
                next = nextValue;
            }
            let comparison = 0;
            if (current > next) {
                comparison = 1;
            } else if (current < next) {
                comparison = -1;
            } else if (current) {
                comparison = 1;
            } else if (next) {
                comparison = -1;
            }
            return (order === 'desc' && current !== next) ? comparison * -1 : comparison;
        };
    }

    searchWildTextInRecords(inputValue: string = '', inputKeys: any[] = [], inputList: any[] = []): any[] {
        let filteredRecords: any[] = [];
        const jsonKeys = Object.assign(inputKeys);
        if (!inputValue) {
            return inputList;
        }
        return filteredRecords = FilterPipe.prototype.transform(Object.assign(inputList), jsonKeys, inputValue);
    }

    flushAndLoadPermissions(features: any[]): void {
        this.permissionsService.flushPermissions();
        this.permissionsService.loadPermissions(features);
    }

    getGenericHttpRequestToasterMessages(req: HttpRequest<any>): string {
        let error = '';
        let errorMessage = TITLE_MESSAGES.GENERIC_HTTP_REQUEST;
        if (req.method.includes(HTTP_METHODS.HTTPGET)) {
            error = HTTP_REQUEST_MESSAGES.GET;
        } else if (req.method.includes(HTTP_METHODS.HTTPPOST) || req.method.includes(HTTP_METHODS.HTTPPUT)) {
            error = HTTP_REQUEST_MESSAGES.POST;
        } else if (req.method.includes(HTTP_METHODS.HTTPDELETE)) {
            error = HTTP_REQUEST_MESSAGES.DELETE;
        }
        if (req.url.includes('api/view/getList/privilegeName/')) {
            error = HTTP_REQUEST_MESSAGES.GET;
        }
        error ? errorMessage = errorMessage.replace(REPLACEBLE_ITEMS.ERROR_STRING, error) : this.doNothing();
        return errorMessage;
    }

    getUnderscoredNameFromParentPage(parentPage: string): string {
        if (parentPage) {
            return parentPage.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase();
        }
        return '';
    }

    getObjectFromList(list: any[], inputParams: any[], searchWith: string, innerListObjectName: string): any {
        let object = {};
        if (list.length) {
            let filteredList = [];
            filteredList = FilterPipe.prototype.transform(list, inputParams, searchWith);
            if (!filteredList.length && innerListObjectName) {
                filteredList = FilterPipe.prototype.filterInnerObjects(list, inputParams, searchWith, true, innerListObjectName);
            } else {
                object = filteredList[0];
            }
        }
        return object;
    }

    getRelativePath(url: string): string {
        const paths = url.split('/');
        const relativePath = '/' + paths[1] + '/' + paths[2];
        return relativePath;
    }

    getAfterContextPath(url: string): string {
        const paths = url.split('/');
        return paths[2];
    }

    doNothing(): void {
    }

}


