import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigurationListRoutingModule } from './configuration-list-routing.module';
import { ConfigurationListComponent } from './pages/configuration-list/configuration-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination'; // Import ngx-pagination module
import { SearchFilterPipe } from './pipe/searchFilter';
import { NgSelectModule } from '@ng-select/ng-select';


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
    NgSelectModule

  ]
})
export class ConfigurationListModule { }
