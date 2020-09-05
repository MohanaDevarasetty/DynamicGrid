import { Pipe } from "@angular/core";


@Pipe({
    name: 'phone'
})
export class PhonePipe {
    transform(val, args) {
        // val = val.charAt(0) != 0 ? '0' + val : '' + val;
        let newStr = '';

        for (let i = 0; i < (Math.floor(val.length / 2) - 1); i++) {
            if (i !== 2) {
                newStr = newStr + val.substr(i * 3, 3) + ' ';
            } else {
                newStr = newStr + val.substr(i * 3, 3);
            }
        }
        return newStr;
    }
}