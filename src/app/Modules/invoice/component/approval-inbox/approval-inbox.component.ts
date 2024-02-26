import { Component, OnInit } from '@angular/core';
import { AppService, InvoicesService, NgbModal, Router, ToastrService, publicVariable } from '../../Export/invoce';
import { finalize, timeout } from 'rxjs';

@Component({
  selector: 'app-approval-inbox',
  templateUrl: './approval-inbox.component.html',
  styleUrls: ['./approval-inbox.component.css']
})
export class ApprovalInboxComponent implements OnInit {
  publicVariable = new publicVariable();


  constructor(private appService: AppService,
    private modalService: NgbModal,
    private router: Router,
    private toastr: ToastrService,
    private API: InvoicesService,


  ) {

  }

  ngOnInit(): void {
    this.loadApproveInvoiceList();
  }


  loadApproveInvoiceList(): void {
    const subscription = this.API.getApproveInvoice().pipe(
        timeout(120000), // Timeout set to 2 minutes (120000 milliseconds)
        finalize(() => {
            this.publicVariable.isProcess = false;
        })
    ).subscribe({
        next: (response: any) => {

            if (this.publicVariable.storedRole === 'Admin') {
                this.publicVariable.invoiceApprovelistData = response.data;
                this.publicVariable.count = response.data.length;
                this.publicVariable.isProcess = false;
            } else {
                // Filter the response data by email
                const filteredData = response.data.filter((item: any) => item.approverEmail === this.publicVariable.storedEmail);
                this.publicVariable.invoiceApprovelistData = filteredData;
                this.publicVariable.count = filteredData.length;
                this.publicVariable.isProcess = false;

            }
        },
        error: (error: any) => {
            if (error.name === 'TimeoutError') {
                this.publicVariable.isProcess = false;
                this.toastr.error('Operation timed out after2 minutes', error.name);
            } else {
                this.publicVariable.isProcess = false;
                this.toastr.error('Error loading user list', error.name);
            }
        }
    });

    this.publicVariable.Subscription.add(subscription);
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
