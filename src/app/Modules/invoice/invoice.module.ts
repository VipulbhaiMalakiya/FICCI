import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceRoutingModule } from './invoice-routing.module';
import { InvoiceStatusComponent } from './component/invoice-status/invoice-status.component';
import { NewPurchaseInvoiceComponent } from './component/new-purchase-invoice/new-purchase-invoice.component';
import { ApprovalInboxComponent } from './component/approval-inbox/approval-inbox.component';
import { AccountsInboxComponent } from './component/accounts-inbox/accounts-inbox.component';
import { ViewInvoiceStatusComponent } from './View/view-invoice-status/view-invoice-status.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NumberToWordsPipe } from './Pipe/numberToWords';
import { ViewPiApprovalComponent } from './View/view-pi-approval/view-pi-approval.component';
import { ViewPiAccountsInboxComponent } from './View/view-pi-accounts-inbox/view-pi-accounts-inbox.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { SearchFilterPipe } from './Pipe/searchFilter';


@NgModule({
    declarations: [
        InvoiceStatusComponent,
        NewPurchaseInvoiceComponent,
        ApprovalInboxComponent,
        AccountsInboxComponent,
        ViewInvoiceStatusComponent,
        NumberToWordsPipe,
        ViewPiApprovalComponent,
        ViewPiAccountsInboxComponent,
        SearchFilterPipe
    ],
    imports: [
        CommonModule,
        InvoiceRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        NgSelectModule,
        SharedModule,
        NgxPaginationModule
    ]
})
export class InvoiceModule { }
