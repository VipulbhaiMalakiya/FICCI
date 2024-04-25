import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { data } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { timeout, finalize } from 'rxjs';
import { publicVariable, AppService, CustomersService } from '../../Export/invoce';
import { PostedEmailComponent } from '../../send-email/posted-email/posted-email.component';
import { InvoicesService } from '../../service/invoices.service';
import { InvoiceSummaryModel } from '../../interface/invoice';
import { PIEmailComponent } from '../../send-email/pi-email/pi-email.component';
import { FileService } from '../../service/FileService';

@Component({
    selector: 'app-pi-invoice',
    templateUrl: './pi-invoice.component.html',
    styleUrls: ['./pi-invoice.component.css']
})
export class PiInvoiceComponent {

    publicVariable = new publicVariable();
    InvoiceSummaryList: InvoiceSummaryModel[] = [];
    storedRole: string = '';
    PostedTaxInvoiceCount: number = 0;
    InvoiceAttachment: any;

    constructor(private appService: AppService,
        private modalService: NgbModal,
        private router: Router,
        private toastr: ToastrService,
        private API: CustomersService,
        private IAPI: InvoicesService,
        private fileService: FileService
    ) { }

    ngOnInit(): void {
        this.publicVariable.storedEmail = sessionStorage.getItem('userEmail') ?? '';
        this.storedRole = sessionStorage.getItem('userRole') ?? '';
        this.loadInvoiceSummary();
    }

    downalodFile(fileUrl: any) {
        this.publicVariable.isProcess  = true;

        try {
            const subscription = this.IAPI.GetPITaxInvoiceAttachment(fileUrl).subscribe({
                next: (response: any) => {

                    this.InvoiceAttachment = response.data[0];
                    const fileName = this.InvoiceAttachment.invoiceNo+'.pdf';
                    const fileType = `application/pdf`;
                    this.fileService.downloadFile(this.InvoiceAttachment.attachment, fileName, fileType);
                    this.publicVariable.isProcess  = false;
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


    onTableDataChange(event: any) {
        this.publicVariable.page = event;
        this.publicVariable.customerStatusList
    }
    onTableSizeChange(event: any): void {
        this.publicVariable.tableSize = event.target.value;
        this.publicVariable.page = 1;
        this.publicVariable.customerStatusList

    }

    loadInvoiceSummary() {
        this.publicVariable.isProcess = true;
        const subscription = this.IAPI.GetPIInvoiceSummary().pipe(
            timeout(120000), // Timeout set to 2 minutes (120000 milliseconds)
            finalize(() => {
                this.publicVariable.isProcess = false;
            })
        ).subscribe({
            next: (response: any) => {
                if (response.data && Array.isArray(response.data)) {

                    // Filter the data by createdBy
                    // this.InvoiceSummaryList = response.data;
                    // this.InvoiceSummaryList = response.data.filter((item: any) => item.createdByUser === this.publicVariable.storedEmail);
                    // this.PostedTaxInvoiceCount = this.InvoiceSummaryList.length;


                    this.InvoiceSummaryList = response.data;
                    this.PostedTaxInvoiceCount = response.data.length;
                } else {
                    // Handle case where response data is null or not an array
                    this.InvoiceSummaryList = [];
                    this.PostedTaxInvoiceCount = 0;
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

    InvoicedView(data: any): void {
        if (data.no) {
            const encryptedHeaderId = btoa(data.no.toString());

            this.router.navigate(['invoice/pi-invoice/view', encryptedHeaderId], { state: { data: data } });
        } else {
            console.error('ID is undefined or null');
        }
    }

    calculateIndex(page: number, index: number): number {
        return (page - 1) * this.publicVariable.tableSize + index + 1;
    }

    onDownloadInvoiceSummary() {
        const exportData = this.InvoiceSummaryList.map((x) => ({
            "No ": x?.no || '',
            "postingDate": x?.postingDate || '',
            "invoice_no": x?.postingDate || '',
            "CustomerNo": x?.sellToCustomerNo || '',
            "CustomerName": x?.sellToCustomerName || '',
            "CustomerName2": x?.sellToCustomerName2 || '',
            "projectCode": x?.projectCode || '',
            "dimensionSetID": x?.dimensionSetID || '',
            "departmentName": x?.departmentName || '',
            "departmentCode": x?.departmentCode || '',
            "divisionCode": x?.divisionCode || '',
            "divisionName": x?.divisionName || '',
            "approverTL": x?.approverTL || '',
            "approverCH": x?.approverCH || '',
            "approverSupport": x?.approverSupport || '',
            "financeApprover": x?.financeApprover || '',
            "invoicePortalOrder": x?.invoicePortalOrder || '',
            "invoicePortalSubmitted": x?.invoicePortalSubmitted || '',
            "createdByUser": x?.createdByUser || '',
            "ToCity": x?.sellToCity || '',
            "Address": x?.sellToAddress || '',
            "Address2": x?.sellToAddress2 || '',
            "PostCode": x?.sellToPostCode || '',
            "gsT_No": x?.gsT_No || '',
            "paN_NO": x?.paN_NO || '',
            "cancelled": x?.cancelled || '',
            "cancelRemark": x?.cancelRemark || '',
            "status": x?.status || '',
            "getTaxInvoiceInfoLines": x?.getTaxInvoiceInfoLines || '',
        }));

        const headers = ['No', 'postingDate', 'invoice_no', 'CustomerNo', 'CustomerName', 'projectCode',
            'dimensionSetID', 'departmentName', 'departmentCode', 'divisionCode', 'divisionName', 'approverTL',
            'approverCH', 'approverSupport', 'financeApprover', 'invoicePortalOrder', 'invoicePortalSubmitted',
            'createdByUser', 'City', 'Address', 'Address2', 'PostCode', 'gsT_No', 'paN_NO', 'cancelled', 'cancelRemark',
            'status', 'getTaxInvoiceInfoLines'
        ];
        this.appService.exportAsExcelFile(exportData, 'Invoiced', headers);
    }

    sendEmail(dataItem: any) {
        this.publicVariable.isProcess = true;

        const modalRef = this.modalService.open(PIEmailComponent, { size: "xl" });
        var componentInstance = modalRef.componentInstance as PIEmailComponent;
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
                    this.IAPI.sendEmail(formData).subscribe({
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


    onSendEmail(dataItem: any) {
        this.sendEmail(dataItem);
    }
}


