import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhonePipe } from './phone.pipe';
import { SplitCamelCasePipe } from './splitCamelCase.pipe';
import { FilterPipe } from './filterPipe.pipe';
import { FilterUniqueOrderPipe } from './filterUniqueOrder.pipe';

@NgModule({
    declarations: [PhonePipe, SplitCamelCasePipe, FilterPipe, FilterUniqueOrderPipe],
    imports: [CommonModule],
    exports: [PhonePipe, SplitCamelCasePipe, FilterPipe, FilterUniqueOrderPipe]
})

export class CustomPipeModule { }
