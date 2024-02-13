import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination'; // Import ngx-pagination module
import { NgSelectModule } from '@ng-select/ng-select';
import {  ConfigurationListRoutingModule,ConfigurationListComponent,SharedModule,SearchFilterPipe} from './import/model';
@NgModule({
  declarations: [
    ConfigurationListComponent,
    SearchFilterPipe,

  ],
  imports: [
    CommonModule,
    ConfigurationListRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    NgxPaginationModule,
    NgSelectModule,


  ]
})
export class ConfigurationListModule { }
