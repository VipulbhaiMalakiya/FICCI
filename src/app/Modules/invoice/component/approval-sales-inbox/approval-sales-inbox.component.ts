import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { timeout, finalize } from 'rxjs';
import { publicVariable, AppService, CustomersService } from '../../Export/invoce';
import { invoiceStatusModule } from '../../interface/invoice';
import { EmailComponent } from '../../send-email/email/email.component';
import { InvoicesService } from '../../service/invoices.service';
import { UpdateEmailComponent } from '../../update-email/update-email.component';
import { CreditSalesEmailComponent } from '../../send-email/credit-sales-email/credit-sales-email.component';
import { FileService } from '../../service/FileService';

@Component({
    selector: 'app-approval-sales-inbox',
    templateUrl: './approval-sales-inbox.component.html',
    styleUrls: ['./approval-sales-inbox.component.css']
})
export class ApprovalSalesInboxComponent implements OnInit {
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
        private CAPI: CustomersService,
        private datePipe: DatePipe,
        private fileService: FileService,

    ) {

    }

    ngOnInit(): void {
        let model: any = {
            'startDate': '',
            'endDate': ''
        }
        this.loadApproveInvoiceList(model);
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
        this.loadApproveInvoiceList(model);

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

            this.loadApproveInvoiceList(model);

        }
    }


    loadApproveInvoiceList(model: any): void {
        const subscription = this.API.getApproveSalesInvoice(model).pipe(
            timeout(120000), // Timeout set to 2 minutes (120000 milliseconds)
            finalize(() => {
                this.publicVariable.isProcess = false;
            })
        ).subscribe({
            next: (response: any) => {
                if (response.data && Array.isArray(response.data)) {
                    this.publicVariable.invoiceStatuslistData = response.data;
                    this.publicVariable.count = response.data.length;
                    this.loadStateList();
                } else {
                    // Handle case where response data is null or not an array
                    this.publicVariable.invoiceStatuslistData = [];
                    this.publicVariable.count = 0;
                    console.warn('Response data is null or not an array:', response.data);
                }
                this.publicVariable.isProcess = false;
            },
            error: (error: any) => {
                if (error.name === 'TimeoutError') {
                    this.toastr.error('Operation timed out after 2 minutes', error.name);
                } else {
                    this.toastr.error('Error loading user list', error.name);
                }
                this.publicVariable.isProcess = false;
            }
        });

        this.publicVariable.Subscription.add(subscription);
    }

    calculateIndex(page: number, index: number): number {
        return (page - 1) * this.publicVariable.tableSize + index + 1;
    }

    onView(data: invoiceStatusModule): void {
        if (data.headerId) {
            const encryptedHeaderId = btoa(data.headerId.toString());

            this.router.navigate(['invoice/sales-approval/view', encryptedHeaderId], { state: { data: data } });
        } else {
            console.error('ID is undefined or null');
        }
    }

    toTitleCase(str: string): string {
        return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    loadStateList() {
        try {
            const subscription = this.CAPI.getStateList().subscribe({
                next: (response: any) => {
                    this.publicVariable.stateList = response.data;
                    this.handleLoadingError()
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



    getStateNameById(stateId: string) {
        const state = this.publicVariable.stateList.find(state => state.stateCode === stateId);
        return state ? state.stateName : null;
    }



    handleLoadingError() {
        this.publicVariable.isProcess = false; // Set status to false on error
    }

    onDownload() {
        const exportData = this.publicVariable.invoiceStatuslistData.map((x) => ({
            "PO No.": x?.impiHeaderProjectCode || '',
            'Project': x?.impiHeaderProjectName ? this.toTitleCase(x.impiHeaderProjectName) : '',
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
            'Created On': x?.impiHeaderSubmittedDate ? formatDate(x.impiHeaderSubmittedDate, 'medium', 'en-IN', 'IST') : '',
            'Created By': x?.impiHeaderCreatedBy ? this.toTitleCase(x.impiHeaderCreatedBy) : '',
            "Update Date": x?.impiHeaderModifiedDate ? formatDate(x.impiHeaderModifiedDate, 'medium', 'en-IN', 'IST') : '',
            'Status': x?.headerStatus ? this.toTitleCase(x?.headerStatus) : '',
            'Refund Status': x?.refundStatus ? this.toTitleCase(x.refundStatus) : '',
        }));

        const headers = [
            'PO No.', 'Project', 'Department', 'Divison', 'Category',
            'Vendor Name', 'Address', 'State', 'City', 'Pincode',
            'Phone No', "Email ID", 'Contact Person', 'Customer  GST Number', 'PAN No', 'Amount', 'Payment Terms',
            'impiHeaderRemarks', 'Tl Approver', 'Cl Approver', 'Finance Approver', 'Accounts Approver', 'Created On', 'Created By', 'Update Date',
            'Status', 'Refund Status'
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
                formData.append('MailCC', dataItem.impiHeaderCreatedBy);
                formData.append('ResourceType', '1');
                formData.append('ResourceId', dataItem.headerId);

                newData.attachment.forEach((file: any) => {
                    if (file instanceof File) {
                        formData.append('Attachments', file);
                    } else {
                        // If it's not a File object, you might need to access the file data differently based on your data structure
                        // For example, if file is an object with a property named 'data' containing the file data
                        // formData.append('Attachments', file.data);
                        // Adjust this according to your data structure
                    }
                });
                this.publicVariable.isProcess = true;

                this.publicVariable.Subscription.add(
                    this.API.sendEmail(formData).subscribe({
                        next: (res: any) => {
                            if (res.status === true) {
                                this.toastr.success(res.message, 'Success');

                                let model: any = {
                                    'startDate': this.startDate,
                                    'endDate': this.endDate
                                }
                                this.loadApproveInvoiceList(model);
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

    downalodFile(fileUrl: any) {
        this.publicVariable.isProcess = true;

        try {
            const subscription = this.API.GetTaxInvoiceAttachment(fileUrl).subscribe({
                next: (response: any) => {

                    this.InvoiceAttachment = response.data[0];

                    if (this.InvoiceAttachment.attachment != undefined && this.InvoiceAttachment.attachment != '' && this.InvoiceAttachment.attachment != null) {
                        const fileName = this.InvoiceAttachment.invoiceNo + '.pdf';
                        const fileType = `application/pdf`;
                        this.fileService.downloadFile(this.InvoiceAttachment.attachment, fileName, fileType);

                    }
                    else {

                        this.toastr.warning('There is an issue with the download of the file from ERP.', 'File Not Found')
                    }

                    this.publicVariable.isProcess = false;
                },
                error: (error) => {
                    console.error('Error loading project list:', error);
                    // this.handleLoadingError();
                },
            });

            this.publicVariable.Subscription.add(subscription);
        } catch (error) {
            console.error('Error loading project list:', error);
            // this.handleLoadingError();
        }


    }

    downalodFilePI(fileUrl: any) {
        this.publicVariable.isProcess = true;

        try {
            const subscription = this.API.GetPITaxInvoiceAttachment(fileUrl).subscribe({
                next: (response: any) => {

                    this.InvoiceAttachment = response.data[0];
                    // const fileName = this.InvoiceAttachment.invoiceNo+'.pdf';
                    // const fileType = `application/pdf`;
                    // this.fileService.downloadFile(this.InvoiceAttachment.attachment, fileName, fileType);
                    // this.publicVariable.isProcess  = false;

                    if (this.InvoiceAttachment.attachment != undefined && this.InvoiceAttachment.attachment != '' && this.InvoiceAttachment.attachment != null) {
                        const fileName = this.InvoiceAttachment.invoiceNo + '.pdf';
                        const fileType = `application/pdf`;
                        this.fileService.downloadFile(this.InvoiceAttachment.attachment, fileName, fileType);

                    }
                    else {

                        this.toastr.warning('There is an issue with the download of the file from ERP.', 'File Not Found')
                    }
                    this.publicVariable.isProcess = false;

                },
                error: (error) => {
                    console.error('Error loading project list:', error);
                    // this.handleLoadingError();
                },
            });

            this.publicVariable.Subscription.add(subscription);
        } catch (error) {
            console.error('Error loading project list:', error);
            // this.handleLoadingError();
        }


    }


    onSendEmail(dataItem: any) {
        this.sendEmail(dataItem);
    }


    onediteEmail(dataItem: any) {
        const subscription = this.API.IsLatestEmail(dataItem.headerId).pipe(
            timeout(120000),
            finalize(() => {
                this.publicVariable.isProcess = false;
            })
        ).subscribe({
            next: (response: any) => {
                this.publicVariable.isProcess = true;
                const modalRef = this.modalService.open(UpdateEmailComponent, { size: "xl" });
                var componentInstance = modalRef.componentInstance as UpdateEmailComponent;
                componentInstance.isEmail = response;
                let updateEmail = response.data;
                modalRef.result.then((data: any) => {
                    if (data) {
                        const newData = data;
                        const formData = new FormData();
                        formData.append('MailTo', newData.emailTo);
                        formData.append('MailSubject', newData.subject);
                        formData.append('MailBody', newData.body);
                        formData.append('LoginId', this.publicVariable.storedEmail);
                        formData.append('MailCC', updateEmail.immdMailCc);
                        formData.append('ResourceType', updateEmail.resourceType);
                        formData.append('ResourceId', updateEmail.resourceId);
                        newData.attachment.forEach((file: any) => {
                            if (file instanceof File) {
                                formData.append('Attachments', file);
                            } else {
                                // If it's not a File object, you might need to access the file data differently based on your data structure
                                // For example, if file is an object with a property named 'data' containing the file data
                                // formData.append('Attachments', file.data);
                                // Adjust this according to your data structure
                            }
                        });

                        this.publicVariable.isProcess = true;
                        this.publicVariable.Subscription.add(
                            this.API.sendEmail(formData).subscribe({
                                next: (res: any) => {
                                    if (res.status === true) {
                                        this.toastr.success(res.message, 'Success');

                                        let model: any = {
                                            'startDate': this.startDate,
                                            'endDate': this.endDate
                                        }
                                        this.loadApproveInvoiceList(model);
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
                this.publicVariable.isProcess = false;
            },
            error: (error: any) => {
                this.publicVariable.isProcess = false;
            }
        });

        this.publicVariable.Subscription.add(subscription);



    }
}
