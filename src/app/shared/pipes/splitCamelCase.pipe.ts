import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'splitCamelCase' })
export class SplitCamelCasePipe implements PipeTransform {
    transform(input: string): string {
        if (typeof input !== 'string') {
            return input;
        }
        return input.split(/(?=[A-Z])/).join(' ');
    }
}
