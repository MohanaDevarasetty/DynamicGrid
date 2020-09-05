import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
    name: 'filterUniqueOrder',
    pure: false
})

export class FilterUniqueOrderPipe implements PipeTransform {
    transform(value: any[], args1: any, args2: any): any {
        if (value) {
            const res = value.filter(item => (item[args1]) );
            const result = _.uniqBy(res, args1);
            const result2 = _.orderBy(result,
                [item => item[args2] && (typeof (item[args2]) === 'string' ? item[args2].toLowerCase() : item[args2])]
                );
            return result2;
        }
        return value;
    }
}