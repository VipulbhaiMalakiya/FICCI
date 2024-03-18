import { Component } from '@angular/core';
import { AppService, CustomersService, InvoicesService, NgbModal, Router, ToastrService, publicVariable } from '../../Export/invoce';
import { InvoiceSummaryModel } from '../../interface/invoice';
import { timeout, finalize } from 'rxjs';
import { PostedEmailComponent } from '../../send-email/posted-email/posted-email.component';

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

    constructor(private appService: AppService,
        private modalService: NgbModal,
        private router: Router,
        private toastr: ToastrService,
        private API: CustomersService,
        private IAPI: InvoicesService
    ) { }

    ngOnInit(): void {
        this.publicVariable.storedEmail = localStorage.getItem('userEmail') ?? '';
        this.storedRole = localStorage.getItem('userRole') ?? '';
        this.loadInvoiceSummary();
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
            this.router.navigate(['invoice/tax-invoice/view', data.invoice_no], { state: { data: data } });
        } else {
            console.error('ID is undefined or null');
        }
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
                formData.append('MailCC', 'vipul.malakiya@teamcomputers.com' );
                formData.append('ResourceType', 'Invoice' );
                formData.append('ResourceId','1' );

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
