import { Component, OnInit } from '@angular/core';
import { AppService, InvoicesService, NgbModal, Router, ToastrService, formatDate, publicVariable } from '../../Export/invoce';

@Component({
  selector: 'app-invoice-status',
  templateUrl: './invoice-status.component.html',
  styleUrls: ['./invoice-status.component.css']
})
export class InvoiceStatusComponent implements OnInit {
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
          this.publicVariable.invoiceStatuslistData = response.data;
          this.publicVariable.count = response.data.length;

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

  toTitleCase(str: string): string {
    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
  onDownload() {
    const exportData = this.publicVariable.invoiceStatuslistData.map((x) => ({
      "PO No.": x?.impiHeaderProjectCode || '',
      "PO Date": x?.impiHeaderSubmittedDate ? formatDate(x.impiHeaderSubmittedDate, 'medium', 'en-IN', 'IST') : '',
      Department: x?.impiHeaderDepartment ? this.toTitleCase(x.impiHeaderDepartment) : '',
      Category: x?.impiHeaderInvoiceType ? this.toTitleCase(x.impiHeaderInvoiceType) : '',
      "Vendor Name": x && x.impiHeaderCustomerName ? this.toTitleCase(x.impiHeaderCustomerName) : '',
      Amount: x?.impiHeaderTotalInvoiceAmount != null ? (x.impiHeaderTotalInvoiceAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '',
      Status: '',
      Approver: '',
      "Update Date": x?.impiHeaderModifiedDate ? formatDate(x.impiHeaderModifiedDate, 'medium', 'en-IN', 'IST') : '',
    }));

    const headers = ['PO No.', 'PO Date', 'Department', 'Category', 'Vendor Name', 'Amount', 'Status', 'Approver', 'Update Date'];
    this.appService.exportAsExcelFile(exportData, 'PI Invoice Status', headers);
  }

  onTableDataChange(event: any) {
    this.publicVariable.page = event;
    this.publicVariable.invoiceStatuslistData
  }
  onTableSizeChange(event: any): void {
    this.publicVariable.tableSize = event.target.value;
    this.publicVariable.page = 1;
    this.publicVariable.invoiceStatuslistData

  }
}
