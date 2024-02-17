import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatusCustomerComponent } from './component/customer-status/status-customer.component';
import { NewCustomerComponent } from './component/customer-new/new-customer.component';
import { ApprovalCustomerComponent } from './component/approval-inbox/approval-customer.component';
import { AccountsCustomerComponent } from './component/accounts-inbox/accounts-customer.component';
import { CustomerStatusComponent } from './View/customer-status/customer-status.component';
import { ApprovalRemarksComponent } from './Remarks/approval-remarks/approval-remarks.component';
import { AccountsRemarksComponent } from './Remarks/accounts-remarks/accounts-remarks.component';

const routes: Routes = [
  { path: '', redirectTo: 'status', pathMatch: 'full' },
  { path: 'status', component: StatusCustomerComponent },
  { path: 'new', component: NewCustomerComponent },
  { path: 'approval', component: ApprovalCustomerComponent },
  { path: 'accounts', component: AccountsCustomerComponent },
  { path: 'status/view/:id', component: CustomerStatusComponent },
  { path: 'status/edit/:id', component: NewCustomerComponent },
  { path: 'approval/remarks/:id', component: ApprovalRemarksComponent },
  { path: 'accounts/remarks/:id', component: AccountsRemarksComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
