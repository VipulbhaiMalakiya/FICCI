import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchFilterPipe } from '../pipe/searchFilter';
import { ApprovalSearchFilterPipe } from '../pipe/approvalSearch';


@NgModule({
  declarations: [
    DashboardComponent,
    SearchFilterPipe,
    ApprovalSearchFilterPipe
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class DashboardModule { }
