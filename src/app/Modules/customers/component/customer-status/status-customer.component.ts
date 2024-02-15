import { Component } from '@angular/core';
import{publicVariable} from '../../Export/new-customer'
@Component({
  selector: 'app-status-customer',
  templateUrl: './status-customer.component.html',
  styleUrls: ['./status-customer.component.css']
})
export class StatusCustomerComponent {
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
