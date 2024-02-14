import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { NewCustomerComponent } from './component/new-customer/new-customer.component';
import { StatusCustomerComponent } from './component/status-customer/status-customer.component';
import { ApprovalCustomerComponent } from './component/approval-customer/approval-customer.component';
import { AccountsCustomerComponent } from './component/accounts-customer/accounts-customer.component';
import { CustomerStatusComponent } from './View/customer-status/customer-status.component';
import { ApprovalRemarksComponent } from './Remarks/approval-remarks/approval-remarks.component';
import { AccountsRemarksComponent } from './Remarks/accounts-remarks/accounts-remarks.component';


@NgModule({
  declarations: [
    NewCustomerComponent,
    StatusCustomerComponent,
    ApprovalCustomerComponent,
    AccountsCustomerComponent,
    CustomerStatusComponent,
    ApprovalRemarksComponent,
    AccountsRemarksComponent
  ],
  imports: [
    CommonModule,
    CustomersRoutingModule
  ]
})
export class CustomersModule { }
