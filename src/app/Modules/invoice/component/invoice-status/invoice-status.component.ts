import { Component } from '@angular/core';
import { AppService, NgbModal, Router, ToastrService, publicVariable } from '../../Export/invoce';

@Component({
  selector: 'app-invoice-status',
  templateUrl: './invoice-status.component.html',
  styleUrls: ['./invoice-status.component.css']
})
export class InvoiceStatusComponent {
  publicVariable = new publicVariable();


  constructor(private appService: AppService,
    private modalService: NgbModal,
    private router: Router,
    private toastr: ToastrService,

  ) {

  }


  onDownload() {
    // const exportData = this.publicVariable.userlist.map((x) => ({
    //   "PO No.": x?.imeM_EmpId || '',
    //   "PO Date": x?.imeM_Name || '',
    //   Department: x?.imeM_Username || '',
    //   Category: x?.imeM_Email || '',
    //   "Vendor Name": x && x.isActive ? 'Yes' : 'No',
    //   Amount: x?.roleName || '',
    //   Status: x?.roleName || '',
    //   Approver: x?.roleName || '',
     //   "Update Date": x?.roleName || '',
    // }));

    // const headers = ['PO No.','PO Date', 'Department', 'Category','Vendor Name', 'Amount','Status','Approver','Update Date'];
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
