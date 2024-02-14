import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatusCustomerComponent } from './component/status-customer/status-customer.component';
import { NewCustomerComponent } from './component/new-customer/new-customer.component';
import { ApprovalCustomerComponent } from './component/approval-customer/approval-customer.component';
import { AccountsCustomerComponent } from './component/accounts-customer/accounts-customer.component';
import { CustomerStatusComponent } from './View/customer-status/customer-status.component';

const routes: Routes = [
  { path: '', redirectTo: 'status', pathMatch: 'full' },
  { path: 'status', component: StatusCustomerComponent },
  { path: 'new', component: NewCustomerComponent },
  { path: 'approval', component: ApprovalCustomerComponent },
  { path: 'accounts', component: AccountsCustomerComponent },
  { path: 'status/view/:id', component: CustomerStatusComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
