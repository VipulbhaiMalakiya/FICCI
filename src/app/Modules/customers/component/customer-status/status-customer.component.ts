import { Component } from '@angular/core';
import{AppService, NgbModal, Router, ToastrService, publicVariable} from '../../Export/new-customer'
@Component({
  selector: 'app-status-customer',
  templateUrl: './status-customer.component.html',
  styleUrls: ['./status-customer.component.css']
})
export class StatusCustomerComponent {
  publicVariable = new publicVariable();


  constructor(private appService: AppService,
    private modalService: NgbModal,
    private router: Router,
    private toastr: ToastrService,

  ) {

  }


  onDownload() {
    // const exportData = this.publicVariable.userlist.map((x) => ({
    //   "Cust. No.": x?.imeM_EmpId || '',
    //   Name: x?.imeM_Name || '',
    //   Address: x?.imeM_Username || '',
    //   City: x?.imeM_Email || '',
    //   Contact: x && x.isActive ? 'Yes' : 'No',
    //   Email: x?.roleName || ''
    // }));

    // const headers = ['Cust. No.','Name', 'Address', 'City','Contact', 'Email'];
    // this.appService.exportAsExcelFile(exportData,'Customer Status',headers);
  }
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
