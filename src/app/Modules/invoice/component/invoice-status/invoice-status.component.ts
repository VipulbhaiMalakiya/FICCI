import { Component, OnInit } from '@angular/core';
import { AppService, InvoicesService, NgbModal, Router, ToastrService, publicVariable } from '../../Export/invoce';

@Component({
  selector: 'app-invoice-status',
  templateUrl: './invoice-status.component.html',
  styleUrls: ['./invoice-status.component.css']
})
export class InvoiceStatusComponent implements OnInit{
  publicVariable = new publicVariable();


  constructor(private appService: AppService,
    private modalService: NgbModal,
    private router: Router,
    private toastr: ToastrService,
    private API: InvoicesService

  ) {

  }

  ngOnInit(): void {
      this.loadPurchaseInvoiceList();
  }
  loadPurchaseInvoiceList(): void {
    try {
      const subscription = this.API.getPurchaseInvoice_New().subscribe({
        next: (response: any) => {
          this.publicVariable.listData = response.data;
        },
        error: (error) => {
          console.error('Error loading project list:', error);
        }
      });

      this.publicVariable.Subscription.add(subscription);
    } catch (error) {
      console.error('Error loading project list:', error);
    }
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
