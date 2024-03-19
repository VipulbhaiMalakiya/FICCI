import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, CustomersService, FormBuilder, InvoicesService, Router, ToastrService, Validators, publicVariable } from '../../Export/invoce';
import { FileService } from '../../service/FileService';
import { finalize, timeout } from 'rxjs';
import { InvoiceSummaryModel, invoiceStatusModule } from '../../interface/invoice';

@Component({
    selector: 'app-creditmemo',
    templateUrl: './creditmemo.component.html',
    styleUrls: ['./creditmemo.component.css']
})
export class CreditmemoComponent {

    invoice_no?: number;
    data: any;
    TaxInvoicedata?: any;
    TaxInvoiceinfo: any = {};
    InvoiceAttachment: any;
    publicVariable = new publicVariable();
    FilePath: any;
    invoiceStatuslistData: invoiceStatusModule[] = [];
    InvoiceSummaryList: InvoiceSummaryModel[] = [];

    constructor(private route: ActivatedRoute, private CAPI: CustomersService,
        private API: InvoicesService,
        private toastr: ToastrService,
        private router: Router,
        private fb: FormBuilder,
        private cd: ChangeDetectorRef,
        private fileService: FileService
    ) {
        this.initializeForm();
    }

    private initializeForm(): void {
        this.publicVariable.dataForm = this.fb.group({
            remarks: ['', Validators.required],
            invoice_no: [null, Validators.required],
        })
    }

    ngOnInit() {
        // this.route.params.subscribe(params => {
        //     this.invoice_no = +params['id'];
        // });
        // this.data = history.state.data;
        this.loadInvoiceSummary();

    }

    loadInvoiceSummary() {
        this.publicVariable.isProcess = true;
        const subscription = this.API.GetInvoiceSummary().pipe(
            timeout(120000), // Timeout set to 2 minutes (120000 milliseconds)
            finalize(() => {
                this.publicVariable.isProcess = false;
            })
        ).subscribe({
            next: (response: any) => {
                if (response.data && Array.isArray(response.data)) {
                    this.InvoiceSummaryList = response.data;
                } else {
                    // Handle case where response data is null or not an array
                    this.InvoiceSummaryList = [];
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


    onSelectInvoie(): void {
        const selectedId: any = this.publicVariable.dataForm.get('invoice_no')?.value;
        this.loadTaxInvoiceInformation(selectedId);

    }

    loadTaxInvoiceInformation(data: any) {
        try {


            const subscription = this.API.GetTaxInvoiceInformation(data).subscribe({
                next: (response: any) => {
                    this.TaxInvoicedata = response.data;

                    // this.filterTaxInvoiceByInvoiceNo(data);
                    // this.loadTaxInvoiceAttachment(this.data.no)

                    this.filterTaxInvoiceByInvoiceNo("SI121683");

                    this.cd.detectChanges();
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

    filterTaxInvoiceByInvoiceNo(invoiceNo: string) {
        if (!this.TaxInvoicedata || !Array.isArray(this.TaxInvoicedata)) {
            console.error("TaxInvoicedata is not properly initialized or is not an array.");
            return;
        }

        const TaxInvoicedataArray = this.TaxInvoicedata.filter((invoice: any) => invoice.invoice_no === invoiceNo);
        if (TaxInvoicedataArray.length === 0) {
            console.log("No invoices found for the provided invoice number.");
            return;
        }

        this.TaxInvoiceinfo = TaxInvoicedataArray[0];

        this.cd.detectChanges();
    }

    loadTaxInvoiceAttachment(invoice: string) {
        try {
            const subscription = this.API.GetTaxInvoiceAttachment(invoice).subscribe({
                next: (response: any) => {
                    this.InvoiceAttachment = response.data;
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


    downalodFile(fileUrl: any) {
        const base64String = fileUrl.attachment;
        const fileName = fileUrl.fileName;
        const fileType = `application/${fileUrl.fileType}`;
        this.fileService.downloadFile(base64String, fileName, fileType);
    }
    handleLoadingError() {
        this.publicVariable.isProcess = false; // Set status to false on error
    }

    onSubmit() {
        if (this.publicVariable.dataForm.valid) {
            const newData = this.publicVariable.dataForm.value;
            const newConfig: any = {
                headerId: this.data.headerId,
                loginId: this.publicVariable.storedEmail,
                remarks: newData.remarks,
            }

            // this.publicVariable.isProcess = true;
            // this.publicVariable.Subscription.add(
            //     this.API.isCancelPI(newConfig).subscribe({
            //         next: (res: any) => {
            //             if (res.status === true) {
            //                 this.toastr.success(res.message, 'Success');
            //                 this.router.navigate(['invoice/status']);
            //                 this.publicVariable.dataForm.reset();
            //             } else {
            //                 this.toastr.error(res.message, 'Error');
            //             }
            //         },
            //         error: (error: any) => {
            //             this.publicVariable.isProcess = false;
            //             this.toastr.error(error.error.message || 'An error occurred. Please try again later.', 'Error');
            //         },
            //         complete: () => {
            //             this.publicVariable.isProcess = false;
            //         }
            //     })
            // );

        } else {
            this.markFormControlsAsTouched();

        }

    }

    markFormControlsAsTouched(): void {
        ['remarks'].forEach(controlName => {
            this.publicVariable.dataForm.controls[controlName].markAsTouched();
        });
    }

    shouldShowError(controlName: string, errorName: string): boolean {
        return this.publicVariable.dataForm.controls[controlName].touched && this.publicVariable.dataForm.controls[controlName].hasError(errorName);
    }

}
