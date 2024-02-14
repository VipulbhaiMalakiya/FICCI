import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceRoutingModule } from './invoice-routing.module';
import { InvoiceStatusComponent } from './component/invoice-status/invoice-status.component';
import { NewPurchaseInvoiceComponent } from './component/new-purchase-invoice/new-purchase-invoice.component';
import { ApprovalInboxComponent } from './component/approval-inbox/approval-inbox.component';
import { AccountsInboxComponent } from './component/accounts-inbox/accounts-inbox.component';


@NgModule({
  declarations: [
    InvoiceStatusComponent,
    NewPurchaseInvoiceComponent,
    ApprovalInboxComponent,
    AccountsInboxComponent
  ],
  imports: [
    CommonModule,
    InvoiceRoutingModule
  ]
})
export class InvoiceModule { }