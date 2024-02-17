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
      Divison: x?.impiHeaderDivison ? this.toTitleCase(x.impiHeaderDivison) : '',
      Category: x?.impiHeaderInvoiceType ? this.toTitleCase(x.impiHeaderInvoiceType) : '',
      "PAN No": x?.impiHeaderPanNo || '',
      "GST No": x?.impiHeaderGstNo || '',
      "State": x?.impiHeaderCustomerState ? this.toTitleCase(x.impiHeaderCustomerState) : '',
      "City": x?.impiHeaderCustomerCity ? this.toTitleCase(x.impiHeaderCustomerCity) : '',
      "Pincode": x?.impiHeaderCustomerPinCode || '',
      "Vendor Name": x && x.impiHeaderCustomerName ? this.toTitleCase(x.impiHeaderCustomerName) : '',
      "Address": x?.impiHeaderCustomerAddress,
      'Customer  GST Number': x?.impiHeaderCustomerGstNo || '',
      'Contact Person': x?.impiHeaderCustomerContactPerson || '',
      'Phone No': x?.impiHeaderCustomerPhoneNo || '',
      "Email ID": x?.impiHeaderCustomerEmailId || '',
      Amount: x?.impiHeaderTotalInvoiceAmount != null ? (x.impiHeaderTotalInvoiceAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '',
      Status: '',
      Approver: '',
      "Update Date": x?.impiHeaderModifiedDate ? formatDate(x.impiHeaderModifiedDate, 'medium', 'en-IN', 'IST') : '',
    }));

    const headers = [
      'PO No.', 'PO Date', 'Department', 'Divison', 'Category', 'PAN No', 'GST No',
      'Vendor Name', 'Address', 'State', 'City', 'Pincode', 'Customer  GST Number',
      'Contact Person', 'Phone No', 'Amount', 'Status', 'Approver',
      'Update Date'
    ];
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
