import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { NewCustomerComponent } from './component/customer-new/new-customer.component';
import { StatusCustomerComponent } from './component/customer-status/status-customer.component';
import { ApprovalCustomerComponent } from './component/approval-inbox/approval-customer.component';
import { AccountsCustomerComponent } from './component/accounts-inbox/accounts-customer.component';
import { CustomerStatusComponent } from './View/customer-status/customer-status.component';
import { ApprovalRemarksComponent } from './Remarks/approval-remarks/approval-remarks.component';
import { AccountsRemarksComponent } from './Remarks/accounts-remarks/accounts-remarks.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { SearchFilterPipe } from './pipe/searchFilter';


@NgModule({
  declarations: [
    NewCustomerComponent,
    StatusCustomerComponent,
    ApprovalCustomerComponent,
    AccountsCustomerComponent,
    CustomerStatusComponent,
    ApprovalRemarksComponent,
    AccountsRemarksComponent,
    SearchFilterPipe
  ],
  imports: [
    CommonModule,
    CustomersRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    SharedModule,
    NgxPaginationModule
  ]
})
export class CustomersModule { }
