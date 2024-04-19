import { formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { publicVariable, AppService, CustomersService, ConfirmationDialogModalComponent } from '../../Export/invoce';
import { invoiceStatusModule } from '../../interface/invoice';
import { InvoicesService } from '../../service/invoices.service';
import { CreditSalesEmailComponent } from '../../send-email/credit-sales-email/credit-sales-email.component';

@Component({
  selector: 'app-sales-credit-note-navision',
  templateUrl: './sales-credit-note-navision.component.html',
  styleUrls: ['./sales-credit-note-navision.component.css']
})
export class SalesCreditNoteNavisionComponent implements OnInit {
    publicVariable = new publicVariable();
    SalesCreditNoteSummaryData:any[] = []

    constructor(private appService: AppService,
        private modalService: NgbModal,
        private router: Router,
        private toastr: ToastrService,
        private API: InvoicesService,
        private cdr: ChangeDetectorRef,
        private CAPI: CustomersService

    ) {

    }

    ngOnInit(): void {
        this.loadPurchaseInvoiceList();
        // this.loadStateList();
    }
    loadPurchaseInvoiceList(): void {
        try {
            this.publicVariable.isProcess = true;
            const subscription = this.API.GetSalesCreditNoteSummary().subscribe({
                next: (response: any) => {
                    if (response.data && Array.isArray(response.data)) {
                        console.log(response.data[1]);

                        this.SalesCreditNoteSummaryData= response.data;
                        this.publicVariable.count = response.data.length;
                        this.publicVariable.isProcess = false;
                    } else {
                        // Handle case where response data is null or not an array
                        this.SalesCreditNoteSummaryData= [];
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

    onView(data: any): void {
        if (data.no) {
            const encryptedHeaderId = btoa(data.no.toString());

            this.router.navigate(['invoice/sales-navision/view', encryptedHeaderId], { state: { data: data } });
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
                        this.loadPurchaseInvoiceList();

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

    // onDownload() {
    //     const exportData = this.SalesCreditNoteSummaryData.map((x) => ({
    //         "No ": x?.no || '',
    //         "postingDate": x?.postingDate || '',
    //         "invoice_no": x?.postingDate || '',
    //         "CustomerNo": x?.sellToCustomerNo || '',
    //         "CustomerName": x?.sellToCustomerName || '',
    //         "CustomerName2": x?.sellToCustomerName2 || '',
    //         "projectCode": x?.projectCode || '',
    //         "dimensionSetID": x?.dimensionSetID || '',
    //         "departmentName": x?.departmentName || '',
    //         "departmentCode": x?.departmentCode || '',
    //         "divisionCode": x?.divisionCode || '',
    //         "divisionName": x?.divisionName || '',
    //         "approverTL": x?.approverTL || '',
    //         "approverCH": x?.approverCH || '',
    //         "approverSupport": x?.approverSupport || '',
    //         "financeApprover": x?.financeApprover || '',
    //         "invoicePortalOrder": x?.invoicePortalOrder || '',
    //         "invoicePortalSubmitted": x?.invoicePortalSubmitted || '',
    //         "createdByUser": x?.createdByUser || '',
    //         "ToCity": x?.sellToCity || '',
    //         "Address": x?.sellToAddress || '',
    //         "Address2": x?.sellToAddress2 || '',
    //         "PostCode": x?.sellToPostCode || '',
    //         "gsT_No": x?.gsT_No || '',
    //         "paN_NO": x?.paN_NO || '',
    //         "cancelled": x?.cancelled || '',
    //         "cancelRemark": x?.cancelRemark || '',
    //         "status": x?.status || '',
    //         "getTaxInvoiceInfoLines": x?.getTaxInvoiceInfoLines || '',
    //     }));

    //     const headers = ['No', 'postingDate', 'invoice_no', 'CustomerNo', 'CustomerName', 'projectCode',
    //         'dimensionSetID', 'departmentName', 'departmentCode', 'divisionCode', 'divisionName', 'approverTL',
    //         'approverCH', 'approverSupport', 'financeApprover', 'invoicePortalOrder', 'invoicePortalSubmitted',
    //         'createdByUser', 'City', 'Address', 'Address2', 'PostCode', 'gsT_No', 'paN_NO', 'cancelled', 'cancelRemark',
    //         'status', 'getTaxInvoiceInfoLines'
    //     ];
    //     this.appService.exportAsExcelFile(exportData, 'Invoiced', headers);
    // }

    onTableDataChange(event: any) {
        this.publicVariable.page = event;
        this.publicVariable.invoiceStatuslistData
    }
    onTableSizeChange(event: any): void {
        this.publicVariable.tableSize = event.target.value;
        this.publicVariable.page = 1;
        this.publicVariable.invoiceStatuslistData

    }


    sendEmail(dataItem: any) {
        this.publicVariable.isProcess = true;

        const modalRef = this.modalService.open(CreditSalesEmailComponent, { size: "xl" });
        var componentInstance = modalRef.componentInstance as CreditSalesEmailComponent;
        componentInstance.isEmail = dataItem;
        modalRef.result.then((data: any) => {
            if (data) {

                const newData = data;
                const formData = new FormData();
                formData.append('MailTo', newData.emailTo);
                formData.append('MailSubject', newData.subject);
                formData.append('MailBody', newData.body);
                formData.append('LoginId', this.publicVariable.storedEmail);
                formData.append('MailCC', newData.MailCC);
                formData.append('ResourceType', 'Invoice');
                formData.append('ResourceId', '1');

                newData.attachment.forEach((file: any) => {
                    if (file instanceof File) {
                        formData.append('Attachments', file);
                    } else {

                        const base64Data = file.attachment; // Your base64 encoded attachment data
                        const decodedData = atob(base64Data); // Decode base64 data

                        // Convert the decoded data to Uint8Array
                        const bytes = new Uint8Array(decodedData.length);
                        for (let i = 0; i < decodedData.length; i++) {
                            bytes[i] = decodedData.charCodeAt(i);
                        }

                        // Create a Blob from the Uint8Array
                        const blob = new Blob([bytes.buffer], { type: 'application/pdf' });

                        // Create a File object with a unique name
                         file = new File([blob], `${file.name}.${file.type}`, { type: 'application/pdf' });

                        formData.append('Attachments', file);
                    }
                });



                this.publicVariable.isProcess = true;

                this.publicVariable.Subscription.add(
                    this.API.sendEmail(formData).subscribe({
                        next: (res: any) => {
                            if (res.status === true) {
                                this.toastr.success(res.message, 'Success');
                            } else {
                                this.toastr.error(res.message, 'Error');
                            }
                        },
                        error: (error: any) => {
                            this.toastr.error(error.error.message || 'An error occurred. Please try again later.', 'Error');
                        },
                        complete: () => {
                            this.publicVariable.isProcess = false;
                        }
                    })
                );
            }
        }).catch(() => {
            this.publicVariable.isProcess = false;
        });
    }

    calculateIndex(page: number, index: number): number {
        return (page - 1) * this.publicVariable.tableSize + index + 1;
    }


    onSendEmail(dataItem: any) {
        this.sendEmail(dataItem);
    }
}
