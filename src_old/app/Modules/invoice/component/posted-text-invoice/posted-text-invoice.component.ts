import { Component } from '@angular/core';
import { AppService, CustomersService, InvoicesService, NgbModal, Router, ToastrService, publicVariable } from '../../Export/invoce';
import { InvoiceSummaryModel } from '../../interface/invoice';
import { timeout, finalize } from 'rxjs';
import { PostedEmailComponent } from '../../send-email/posted-email/posted-email.component';
import { Attachment } from './../../interface/invoice';
import { FileService } from '../../service/FileService';

@Component({
    selector: 'app-posted-text-invoice',
    templateUrl: './posted-text-invoice.component.html',
    styleUrls: ['./posted-text-invoice.component.css']
})
export class PostedTextInvoiceComponent {
    publicVariable = new publicVariable();
    InvoiceSummaryList: InvoiceSummaryModel[] = [];
    storedRole: string = '';
    PostedTaxInvoiceCount: number = 0;
    TaxInvoicePaymentSummaryList: any[] = [];
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
        this.publicVariable.storedEmail = localStorage.getItem('userEmail') ?? '';
        this.storedRole = localStorage.getItem('userRole') ?? '';
        this.loadInvoiceSummary();

    }




    downalodFile(fileUrl: any) {
        this.publicVariable.isProcess  = true;

        try {
            const subscription = this.IAPI.GetTaxInvoiceAttachment(fileUrl).subscribe({
                next: (response: any) => {

                    this.InvoiceAttachment = response.data[0];
                   
                    if(this.InvoiceAttachment.attachment != undefined && this.InvoiceAttachment.attachment !='' && this.InvoiceAttachment.attachment != null )
                   {
                    const fileName = this.InvoiceAttachment.invoiceNo+'.pdf';
                    const fileType = `application/pdf`;
                    this.fileService.downloadFile(this.InvoiceAttachment.attachment, fileName, fileType);
                   
                   }
                   else
                   {

                  this.toastr.warning('There is an issue with the download of the file from ERP.','File Not Found')
                   }
                    
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


    loadTaxPaymentInvoiceSummary(data: any) {

        console.log(data);
        this.publicVariable.isProcess = true;
        const subscription = this.IAPI.getTaxPaymentDetails(data.no).pipe(
            timeout(120000), // Timeout set to 2 minutes (120000 milliseconds)
            finalize(() => {
                this.publicVariable.isProcess = false;
            })
        ).subscribe({
            next: (response: any) => {
                if (response.data && Array.isArray(response.data)) {

                    this.TaxInvoicePaymentSummaryList = response.data;
                    console.log(response);
                    this.publicVariable.isProcess = false;
                    //this.PostedTaxInvoiceCount = response.data.length;
                } else {
                    // Handle case where response data is null or not an array
                    this.TaxInvoicePaymentSummaryList = [];
                    this.publicVariable.isProcess = false;
                 //   this.PostedTaxInvoiceCount = 0;
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


    loadInvoiceSummary() {
        this.publicVariable.isProcess = true;
        const subscription = this.IAPI.GetInvoiceSummary().pipe(
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
        if (data.invoice_no) {
            const encryptedHeaderId = btoa(data.invoice_no.toString());

            this.router.navigate(['invoice/tax-invoice/view', encryptedHeaderId], { state: { data: data } });
        } else {
            console.error('ID is undefined or null');
        }
    }


    onDownloadInvoiceSummary() {
        const exportData = this.InvoiceSummaryList.map((x) => ({
            "No": x?.no || '',
            "Posting Date": x?.postingDate || '',
            "Invoice No": x?.invoice_no || '',
            "Customer No": x?.sellToCustomerNo || '',
            "Customer": x?.sellToCustomerName || '',
            "Project Code": x?.projectCode || '',
            "Department": x?.departmentName || '',
            "Division": x?.divisionName || '',
            "Amount": x?.amount || '',
       
     
        }));

        const headers = ['No','Posting Date','Invoice No','Customer No','Customer','Project Code','Department','Division','Amount'
        ];
        this.appService.exportAsExcelFile(exportData, 'Posted Tax Invoice', headers);
    }

    sendEmail(dataItem: any) {
        this.publicVariable.isProcess = true;

        const modalRef = this.modalService.open(PostedEmailComponent, { size: "xl" });
        var componentInstance = modalRef.componentInstance as PostedEmailComponent;
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

    calculateIndex(page: number, index: number): number {
        return (page - 1) * this.publicVariable.tableSize + index + 1;
    }


    onSendEmail(dataItem: any) {
        this.sendEmail(dataItem);
    }
}
