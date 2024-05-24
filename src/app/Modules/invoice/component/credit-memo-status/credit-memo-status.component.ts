import { DatePipe, formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { publicVariable, AppService, CustomersService, ConfirmationDialogModalComponent } from '../../Export/invoce';
import { invoiceStatusModule } from '../../interface/invoice';
import { InvoicesService } from '../../service/invoices.service';
import { FileService } from '../../service/FileService';

@Component({
  selector: 'app-credit-memo-status',
  templateUrl: './credit-memo-status.component.html',
  styleUrls: ['./credit-memo-status.component.css']
})
export class CreditMemoStatusComponent implements OnInit {
    publicVariable = new publicVariable();
    startDate?: any;
    endDate?: any;
    dateRangeError: boolean = false;
    selectedValue?: any = 'ALL';
    InvoiceAttachment: any;



    constructor(private appService: AppService,
        private modalService: NgbModal,
        private router: Router,
        private toastr: ToastrService,
        private API: InvoicesService,
        private cdr: ChangeDetectorRef,
        private CAPI: CustomersService,
        private datePipe: DatePipe,
        private fileService: FileService


    ) {

    }

    ngOnInit(): void {
        let model:any = {
            'startDate' : '',
            'endDate' : ''
        }
        this.loadPurchaseInvoiceList(model);
        this.loadStateList();
    }

    onValueChange(event: Event) {
        const target = event.target as HTMLSelectElement;
        this.selectedValue = target.value;
        const oneWeekFromNow = new Date();
        if (this.selectedValue === 'ALL') {
            this.startDate = '';
            this.endDate = ''
        }
        else if (this.selectedValue === 'Today') {
            this.startDate = this.datePipe.transform(
                oneWeekFromNow.toISOString().split('T')[0],
                'yyyy-MM-dd'

            );
            this.endDate = this.datePipe.transform(
                oneWeekFromNow.toISOString().split('T')[0],
                'yyyy-MM-dd'
            );
        } else if (this.selectedValue === 'Yesterday') {
            oneWeekFromNow.setDate(oneWeekFromNow.getDate() - 1);
            this.startDate = this.datePipe.transform(
                oneWeekFromNow.toISOString().split('T')[0],
                'yyyy-MM-dd'
            );
            this.endDate = this.datePipe.transform(
                oneWeekFromNow.toISOString().split('T')[0],
                'yyyy-MM-dd'
            );
        } else if (this.selectedValue === '7') {
            const oneWeekFromNow = new Date();
            this.endDate = this.datePipe.transform(
              oneWeekFromNow.toISOString().split('T')[0],
              'yyyy-MM-dd'
            );
            oneWeekFromNow.setDate(oneWeekFromNow.getDate() - 7);
            this.startDate = this.datePipe.transform(
              oneWeekFromNow.toISOString().split('T')[0],
              'yyyy-MM-dd'
            );
        } else if (this.selectedValue === '30') {
            const oneWeekFromNow = new Date();
            this.endDate = this.datePipe.transform(
              oneWeekFromNow.toISOString().split('T')[0],
              'yyyy-MM-dd'
            );
            oneWeekFromNow.setDate(oneWeekFromNow.getDate() - 30);
            this.startDate = this.datePipe.transform(
              oneWeekFromNow.toISOString().split('T')[0],
              'yyyy-MM-dd'
            );
        }

        this.publicVariable.isProcess = true;
        var model: any = {
            startDate: this.datePipe.transform(this.startDate, 'yyyy-MM-dd'),
            endDate: this.datePipe.transform(this.endDate, 'yyyy-MM-dd'),
        };
        this.loadPurchaseInvoiceList(model);

    }

    downalodFile(fileUrl: any) {
        this.publicVariable.isProcess = true;
        this.PostedSalesCreditNoteAttachment(fileUrl);
    }

    PostedSalesCreditNoteAttachment(invoice: string) {
        try {
            this.publicVariable.isProcess = true;
            const subscription = this.API.GetSLLTaxInvoiceAttachment(invoice).subscribe({
                next: (response: any) => {

                    if (response.data.length > 0)

                    {
                        this.InvoiceAttachment = response.data[0];

                        if(this.InvoiceAttachment.attachment != undefined && this.InvoiceAttachment.attachment !='' && this.InvoiceAttachment.attachment != null )
                        {
                         const fileName = this.InvoiceAttachment.salesCrMemoNo+'.pdf';
                         const fileType = `application/pdf`;
                         this.fileService.downloadFile(this.InvoiceAttachment.attachment, fileName, fileType);

                        }
                        else
                        {

                       this.toastr.warning('There is an issue with the download of the file from ERP.','File Not Found')
                        }




                        // const fileName = this.InvoiceAttachment.invoiceNo+'.pdf';
                        // const fileType = `application/pdf`;
                        // this.fileService.downloadFile(this.InvoiceAttachment.attachment, fileName, fileType);
                        this.publicVariable.isProcess  = false;
                    }
                    this.handleLoadingError();
                },
                error: (error) => {
                    console.error('Error loading project list:', error);
                    this.handleLoadingError();
                },
            });

            this.publicVariable.Subscription.add(subscription);
        } catch (error) {
            console.error('Error loading project list:', error);
            this.handleLoadingError();
        }
    }

    reset() {
        this.startDate = '';
        this.endDate = '';
        this.selectedValue = 'ALL';
    }
    submitDateRange() {
        const start = new Date(this.startDate);
        const end = new Date(this.endDate);
        if (start > end) {
            this.dateRangeError = true;
        } else {
            this.dateRangeError = false;
            var model: any = {
                startDate: this.datePipe.transform(this.startDate, 'yyyy-MM-dd'),
                endDate: this.datePipe.transform(this.endDate, 'yyyy-MM-dd'),
            };
            this.publicVariable.isProcess = true;

            this.loadPurchaseInvoiceList(model);

        }
    }
    loadPurchaseInvoiceList(model:any): void {
        try {
            const subscription = this.API.getSalesCreditMemo(model).subscribe({
                next: (response: any) => {
                    if (response.data && Array.isArray(response.data)) {
                        console.log(response.data);

                        this.publicVariable.invoiceStatuslistData = response.data;
                        console.table(response.data)
                        this.publicVariable.count = response.data.length;
                        this.publicVariable.isProcess = false;
                    } else {
                        // Handle case where response data is null or not an array
                        this.publicVariable.invoiceStatuslistData = [];
                        this.publicVariable.count = 0;
                        this.publicVariable.isProcess = false;

                        console.warn('Response data is null or not an array:', response.data);
                    }
                },
                error: (error) => {
                    console.error('Error loading project list:', error);
                    this.publicVariable.isProcess = false;

                }
            });

            this.publicVariable.Subscription.add(subscription);
        } catch (error) {
            console.error('Error loading project list:', error);
            this.publicVariable.isProcess = false;

        }
    }

    toTitleCase(str: string): string {
        return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    onView(data: invoiceStatusModule): void {
        if (data.headerId) {
            const encryptedHeaderId = btoa(data.headerId.toString());

            this.router.navigate(['invoice/credit-memo-status/view', encryptedHeaderId], { state: { data: data } });
        } else {
            console.error('ID is undefined or null');
        }
    }

    onDelete(id: any) {
        const modalRef = this.modalService.open(ConfirmationDialogModalComponent, { size: "sm", centered: true, backdrop: "static" });
        var componentInstance = modalRef.componentInstance as ConfirmationDialogModalComponent;
        componentInstance.message = "Do you really want to delete these records? This process cannot be undone ?";
        modalRef.result.then((canDelete: boolean) => {
            if (canDelete) {
                this.publicVariable.isProcess = true;
                this.API.delete(id).subscribe({
                    next: (res: any) => {
                        this.toastr.success(res.message, 'Success');
                        this.publicVariable.isProcess = false;
                        this.cdr.detectChanges();
                        let model:any = {
                            'startDate' : this.startDate,
                            'endDate' : this.endDate
                        }
                        this.loadPurchaseInvoiceList(model);

                    },
                    error: (error) => {
                        this.publicVariable.isProcess = false;
                        this.toastr.error(error.error.message, 'Error');
                    }
                });

            }
        }).catch(() => { });

    }

    onEdit(data: invoiceStatusModule): void {

        if (data.headerId) {
            const encryptedHeaderId = btoa(data.headerId.toString());

            this.router.navigate(['invoice/credit-memo-status/edit', encryptedHeaderId], { state: { data: data } });
        } else {
            console.error('ID is undefined or null');
        }
    }

    loadStateList() {
        try {
            const subscription = this.CAPI.getStateList().subscribe({
                next: (response: any) => {
                    this.publicVariable.stateList = response.data;
                    this.handleLoadingError();
                },
                error: (error) => {
                    console.error('Error loading project list:', error);
                    this.handleLoadingError()
                },
            });

            this.publicVariable.Subscription.add(subscription);
        } catch (error) {
            console.error('Error loading project list:', error);
            this.handleLoadingError()
        }
    }

    getStateNameById(stateId:string) {
        const state = this.publicVariable.stateList.find(state => state.stateCode === stateId);
        return state ? state.stateName : null;
    }

    handleLoadingError() {
        this.publicVariable.isProcess = false; // Set status to false on error
    }

    onDownload() {
        const exportData = this.publicVariable.invoiceStatuslistData.map((x) => ({
            "PO No.": x?.impiHeaderProjectCode || '',
            'Project' :x?.impiHeaderProjectName ? this.toTitleCase(x.impiHeaderProjectName) : '',
            Department: x?.impiHeaderProjectDepartmentName ? this.toTitleCase(x.impiHeaderProjectDepartmentName) : '',
            Divison: x?.impiHeaderProjectDivisionName ? this.toTitleCase(x.impiHeaderProjectDivisionName) : '',
            Category: x?.impiHeaderInvoiceType ? this.toTitleCase(x.impiHeaderInvoiceType) : '',
            "PAN No": x?.impiHeaderPanNo || '',
            "State": this.getStateNameById(x?.impiHeaderCustomerState),
            "City": x?.impiHeaderCustomerCity,
            "Pincode": x?.impiHeaderCustomerPinCode || '',
            "Vendor Name": x && x.impiHeaderCustomerName ? this.toTitleCase(x.impiHeaderCustomerName) : '',
            "Address": x?.impiHeaderCustomerAddress,
            'Customer  GST Number': x?.impiHeaderCustomerGstNo || '',
            'Contact Person': x?.impiHeaderCustomerContactPerson || '',
            'Phone No': x?.impiHeaderCustomerPhoneNo || '',
            "Email ID": x?.impiHeaderCustomerEmailId || '',
            Amount: x?.impiHeaderTotalInvoiceAmount != null ? (x.impiHeaderTotalInvoiceAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '',
            'Payment Terms': x?.impiHeaderPaymentTerms || '',
            'impiHeaderRemarks': x?.impiHeaderRemarks || '',
            'Tl Approver': x?.impiHeaderTlApprover ? this.toTitleCase(x.impiHeaderTlApprover) : '',
            'Cl Approver': x?.impiHeaderClusterApprover ? this.toTitleCase(x.impiHeaderClusterApprover) : '',
            'Finance Approver': x?.impiHeaderFinanceApprover ? this.toTitleCase(x.impiHeaderFinanceApprover) : '',
            'Accounts Approver': x?.accountApprover ? this.toTitleCase(x.accountApprover) : '',
            'Created On':x?.impiHeaderSubmittedDate ? formatDate(x.impiHeaderSubmittedDate, 'medium', 'en-IN', 'IST') : '',
            'Created By': x?.impiHeaderCreatedBy ? this.toTitleCase(x.impiHeaderCreatedBy) : '',
            "Update Date": x?.impiHeaderModifiedDate ? formatDate(x.impiHeaderModifiedDate, 'medium', 'en-IN', 'IST') : '',
            'Status':x?.headerStatus ? this.toTitleCase(x?.headerStatus) : ''
        }));

        const headers = [
            'PO No.','Project', 'Department', 'Divison', 'Category',
            'Vendor Name', 'Address', 'State', 'City', 'Pincode',
            'Phone No', "Email ID", 'Contact Person', 'Customer  GST Number', 'PAN No', 'Amount', 'Payment Terms',
            'impiHeaderRemarks', 'Tl Approver', 'Cl Approver', 'Finance Approver', 'Accounts Approver','Created On', 'Created By','Update Date',
            'Status'
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
