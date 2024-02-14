import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatusCustomerComponent } from './component/status-customer/status-customer.component';
import { NewCustomerComponent } from './component/new-customer/new-customer.component';
import { ApprovalCustomerComponent } from './component/approval-customer/approval-customer.component';

const routes: Routes = [
  { path: '', redirectTo: 'status', pathMatch: 'full' },
  { path: 'status', component: StatusCustomerComponent },
  { path: 'new', component: NewCustomerComponent },
  { path: 'approval', component: ApprovalCustomerComponent }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
