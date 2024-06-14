import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchFilterPipe } from '../pipe/searchFilter';
import { ApprovalSearchFilterPipe } from '../pipe/approvalSearch';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../shared/shared.module';
import { SearchFilterPipe1 } from '../pipe/searchpi';
import { invoiceFilterPipe } from '../pipe/InvoiceSummary';
import { postedFilter } from '../pipe/posted';
import { SalesSearchFilterPipe } from '../pipe/sales-credite-pipe';
import { searchFilterNew } from '../pipe/searchpinew';
import { postedFilternew } from '../pipe/postedNew';
import { salesnew } from '../pipe/sals-new';
import { DateFilterPipe } from '../pipe/date-filter.pipe';




@NgModule({
    declarations: [
        DashboardComponent,
        SearchFilterPipe,
        ApprovalSearchFilterPipe,
        SearchFilterPipe1,
        invoiceFilterPipe,
        SalesSearchFilterPipe,
        postedFilter,
        searchFilterNew,
        postedFilternew,
        salesnew,
        DateFilterPipe

    ],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        NgSelectModule,
        SharedModule,
        NgxPaginationModule
    ]
})
export class DashboardModule { }
