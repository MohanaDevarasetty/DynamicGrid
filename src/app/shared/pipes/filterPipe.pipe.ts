import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

@Pipe({
    name: 'filter',
    pure: false
})
export class FilterPipe implements PipeTransform {

    constructor(public datePipe: DatePipe) {
    }

    transform(items: any[], searchWith: any[], searchText: string, dateFormat?: any, id?: boolean): any[] {
        if (!items) { return []; }
        if (!searchText) { return items; }
        return _.filter(items, function (item: any): any {
            if (dateFormat) {
                dateFormat.forEach(val => {
                    item[val.Fields] = item[val.Fields] ? moment(item[val.Fields]).format(val.dateFormat) : item[val.Fields];
                });
            }
            let pick: any;
            if (!id) {
                pick = _.pick(item, _.without(searchWith, 'id'));
            } else {
                pick = _.pick(item, searchWith);
            }
            return JSON.stringify(Object['values'](pick)).toLowerCase().includes(searchText.toLowerCase());
        });
    }

    filterFields(input: any, keys: any[], items: any[], isWildCardSearch: boolean = false): any[] {
        if (!items) { return []; }
        const formFields = Object.keys(input);
        let list = items;
        if (isWildCardSearch) {
            formFields.filter((field, index) => {
                list = list.filter(item =>
                    input[field] && item[keys[index]] ? item[keys[index]].toString().includes(input[field].toString()) : 1 === 1);
            });
        } else {
            formFields.filter((field, index) => {
                if (input[field]) {
                    list = list.filter(item => item[keys[index]] === input[field]);
                }
            });
        }
        return list ? list : [];
    }

    filterInnerObjects(items: any[], searchWith: any[], searchText: any, isInnerObjectSearch: boolean, innerObjectName: string): any[] {
        if (!items) { return []; }
        if (!searchText) { return items; }
        if (isInnerObjectSearch) {
            return _.filter(items, function(item: any): any {
                let pick: any;
                if (item[innerObjectName] && item[innerObjectName].length) {
                    item[innerObjectName].forEach(device => {
                        pick = _.pick(device, searchWith);
                    });
                }
                if (item[innerObjectName] && item[innerObjectName].length) {
                    return JSON.stringify(Object['values'](pick)).toLowerCase().includes(searchText.toLowerCase());
                }
            });
        }
    }
}

