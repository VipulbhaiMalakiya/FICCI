import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { NewCustomerComponent } from './component/new-customer/new-customer.component';
import { StatusCustomerComponent } from './component/status-customer/status-customer.component';


@NgModule({
  declarations: [
    NewCustomerComponent,
    StatusCustomerComponent
  ],
  imports: [
    CommonModule,
    CustomersRoutingModule
  ]
})
export class CustomersModule { }
