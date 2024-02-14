import { Component } from '@angular/core';
import { publicVariable } from '../../Export/new-customer';

@Component({
  selector: 'app-approval-customer',
  templateUrl: './approval-customer.component.html',
  styleUrls: ['./approval-customer.component.css']
})
export class ApprovalCustomerComponent {
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
