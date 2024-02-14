import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceStatusComponent } from './component/invoice-status/invoice-status.component';
import { NewPurchaseInvoiceComponent } from './component/new-purchase-invoice/new-purchase-invoice.component';
import { ApprovalInboxComponent } from './component/approval-inbox/approval-inbox.component';
import { AccountsInboxComponent } from './component/accounts-inbox/accounts-inbox.component';
import { ViewInvoiceStatusComponent } from './View/view-invoice-status/view-invoice-status.component';

const routes: Routes = [
  { path: '', redirectTo: 'status', pathMatch: 'full' },
  { path: 'status', component: InvoiceStatusComponent },
  { path: 'new', component: NewPurchaseInvoiceComponent },
  { path: 'approval', component: ApprovalInboxComponent },
  { path: 'accounts', component: AccountsInboxComponent },
  { path: 'status/view/:id', component: ViewInvoiceStatusComponent },
  // { path: 'approval/remarks/:id', component: ApprovalRemarksComponent },
  // { path: 'accounts/remarks/:id', component: AccountsRemarksComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceRoutingModule { }
