import { Component } from '@angular/core';
import { publicVariable } from '../../Export/new-customer';

@Component({
  selector: 'app-accounts-customer',
  templateUrl: './accounts-customer.component.html',
  styleUrls: ['./accounts-customer.component.css']
})
export class AccountsCustomerComponent {
  publicVariable = new publicVariable();
  
  onTableDataChange(event: any) {
    this.publicVariable.page = event;
    // this.publicVariable.userlist
  }
  onTableSizeChange(event: any): void {
    this.publicVariable.tableSize = event.target.value;
    this.publicVariable.page = 1;
    // this.publicVariable.userlist

  }
}
