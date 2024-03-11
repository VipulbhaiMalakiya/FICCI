import { Component, OnInit } from '@angular/core';
import { AppService, CustomersService, InvoicesService, NgbModal, Router, ToastrService, formatDate, publicVariable } from '../../Export/invoce';
import { finalize, timeout } from 'rxjs';
import { invoiceStatusModule } from '../../interface/invoice';
import { UpdateEmailComponent } from '../../update-email/update-email.component';
import { EmailComponent } from '../../send-email/email/email.component';

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
        private CAPI: CustomersService

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



    onView(data: invoiceStatusModule): void {
        if (data.headerId) {
            this.router.navigate(['invoice/approval/view', data.headerId], { state: { data: data } });
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
            'Status':x?.headerStatus ? this.toTitleCase(x?.headerStatus) : '',
        }));

        const headers = [
            'PO No.','Project', 'Department', 'Divison', 'Category',
            'Vendor Name', 'Address', 'State', 'City', 'Pincode',
            'Phone No', "Email ID", 'Contact Person', 'Customer  GST Number', 'PAN No', 'Amount', 'Payment Terms',
            'impiHeaderRemarks', 'Tl Approver', 'Cl Approver', 'Finance Approver','Accounts Approver', 'Created On', 'Created By','Update Date',
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

    sendEmail(dataItem: any) {
        this.publicVariable.isProcess = true;

        const modalRef = this.modalService.open(EmailComponent, { size: "xl" });
        var componentInstance = modalRef.componentInstance as EmailComponent;
        componentInstance.isEmail = dataItem;
        modalRef.result.then((data: any) => {
            if (data) {
                const newData = data;
                const formData = new FormData();
                formData.append('MailTo', newData.emailTo);
                formData.append('MailSubject', newData.subject);
                formData.append('MailBody', newData.body);
                formData.append('LoginId', this.publicVariable.storedEmail);
                formData.append('MailCC', dataItem.impiHeaderCreatedBy );
                formData.append('ResourceType', dataItem.impiHeaderInvoiceType );
                formData.append('ResourceId', dataItem.headerId );

                newData.attachment.forEach((file: any) => {
                    formData.append('Attachments', file);
                });
                this.publicVariable.isProcess = true;

                this.publicVariable.Subscription.add(
                    this.API.sendEmail(formData).subscribe({
                        next: (res: any) => {
                            if (res.status === true) {
                                this.toastr.success(res.message, 'Success');
                                this.loadApproveInvoiceList();
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
                            formData.append('Attachments', file);
                        });

                        this.publicVariable.isProcess = true;
                        this.publicVariable.Subscription.add(
                            this.API.sendEmail(formData).subscribe({
                                next: (res: any) => {
                                    if (res.status === true) {
                                        this.toastr.success(res.message, 'Success');
                                        this.loadApproveInvoiceList();
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
