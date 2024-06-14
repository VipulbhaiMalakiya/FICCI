import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { publicVariable, CustomersService } from '../../Export/invoce';
import { FileService } from '../../service/FileService';
import { InvoicesService } from '../../service/invoices.service';

@Component({
    selector: 'app-posted-sales-note-new',
    templateUrl: './posted-sales-note-new.component.html',
    styleUrls: ['./posted-sales-note-new.component.css']
})
export class PostedSalesNoteNewComponent {

    invoice_no?: any;
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
            //this.invoice_no = +params['id'];

            let decrypted = params['id']
            this.invoice_no = atob(decrypted);
        });
        this.data = history.state.data;

        console.log(this.data);


        this.loadTaxInvoiceInformation();
    }


    loadTaxInvoiceInformation() {
        try {

            const subscription = this.API.GetSalesCreditNoteInformation(this.data.no).subscribe({

                //    const subscription = this.API.GetSalesCreditNoteInformation(this.data.no).subscribe({
                next: (response: any) => {
                    this.TaxInvoicedata = response.data;
                    this.publicVariable.isProcess = false;
                    // console.log('response:', response.data);
                    this.filterTaxInvoiceByInvoiceNo(this.data.no);

                    // this.filterTaxInvoiceByInvoiceNo(this.data.no);
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

        const TaxInvoicedataArray = this.TaxInvoicedata.filter((invoice: any) => invoice.no === invoiceNo);
        console.log('tax invoice', TaxInvoicedataArray);
        if (TaxInvoicedataArray.length === 0) {
            console.log("No invoices found for the provided invoice number.");
            return;
        }

        this.TaxInvoiceinfo = TaxInvoicedataArray[0];
        this.cd.detectChanges();
    }
    InvNo: any;
    InvAttachment: any;
    loadTaxInvoiceAttachment(invoice: string) {
        try {
            const subscription = this.API.GetPITaxInvoiceAttachment(invoice).subscribe({
                next: (response: any) => {

                    if (response.data.length > 0) {
                        this.InvoiceAttachment = response.data[0];
                        this.InvNo = this.InvoiceAttachment.invoiceNo;
                        this.InvAttachment = this.InvoiceAttachment.attachment;


                        console.log(this.InvoiceAttachment);

                        //alert(this.InvoiceAttachment.invoiceNo);
                        this.handleLoadingError();
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


    downalodFile(fileUrl: any) {
        const base64String = fileUrl.attachment;
        const fileName = fileUrl.fileName;
        const fileType = `application/${fileUrl.fileType}`;
        this.fileService.downloadFile(base64String, fileName, fileType);
    }

    downalodInvFile(base64String: any, InvNo: any = 'Invoice') {

        const fileName = InvNo + '.pdf';
        const fileType = `application/pdf`;
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


