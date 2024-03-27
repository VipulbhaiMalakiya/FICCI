import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, CustomersService, FormBuilder, InvoicesService, Router, ToastrService, Validators, publicVariable } from '../../Export/invoce';
import { FileService } from '../../service/FileService';

@Component({
  selector: 'app-pi-invoice-view-new',
  templateUrl: './pi-invoice-view-new.component.html',
  styleUrls: ['./pi-invoice-view-new.component.css']
})
export class PiInvoiceViewNewComponent {

    invoice_no?: number;
    data: any;
    TaxInvoicedata?: any;
    TaxInvoiceinfo: any = {};
    InvoiceAttachment: any;
    publicVariable = new publicVariable();
    FilePath: any;


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
        })
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.invoice_no = +params['id'];
        });
        this.data = history.state.data;

        this.loadTaxInvoiceInformation();
    }


    loadTaxInvoiceInformation() {
        try {

            // const subscription = this.API.GetTaxInvoiceInformation("SI121683").subscribe({

                const subscription = this.API.GetPITaxInvoiceInformation(this.data.no).subscribe({
                next: (response: any) => {
                    this.TaxInvoicedata = response.data;
                    // this.filterTaxInvoiceByInvoiceNo("SI121683");

                    this.filterTaxInvoiceByInvoiceNo(this.data.no);
                    this.loadTaxInvoiceAttachment(this.data.no)
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
            const subscription = this.API.GetPITaxInvoiceAttachment(invoice).subscribe({
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

