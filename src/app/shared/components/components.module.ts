import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { TableComponent } from './table/table.component';
import { PaginationComponent } from './pagination/pagination.component';
import { FilterComponent } from './filter/filter.component';
import { SearchBoxComponent } from './search-box/search-box.component';
import { ExportFileComponent } from './export-file/export-file.component';
import { SummaryViewComponent } from './summary-view/summary-view.component';
import { CustomPipeModule } from '../pipes/customPipes.module';
import { RouterModule } from '@angular/router';
import { NgxPermissionsModule } from 'ngx-permissions';



@NgModule({
  declarations: [
    ListComponent,
    TableComponent,
    PaginationComponent,
    FilterComponent,
    SearchBoxComponent,
    ExportFileComponent,
    SummaryViewComponent
  ],
  imports: [
    CommonModule,
    CustomPipeModule,
    RouterModule,
    NgxPermissionsModule.forChild(),
  ],
  exports: [
    ListComponent,
    TableComponent,
    PaginationComponent,
    FilterComponent,
    SearchBoxComponent,
    ExportFileComponent,
    SummaryViewComponent
  ],
  entryComponents: [
    ListComponent,
    TableComponent,
    PaginationComponent,
    FilterComponent,
    SearchBoxComponent,
    ExportFileComponent,
    SummaryViewComponent
  ]
})
export class ComponentsModule { }
