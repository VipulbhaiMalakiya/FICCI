import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomersService, publicVariable } from '../../Export/invoce';
import { InvoicesService } from '../../service/invoices.service';

@Component({
    selector: 'app-posted-tax-invoice',
    templateUrl: './posted-tax-invoice.component.html',
    styleUrls: ['./posted-tax-invoice.component.css']
})
export class PostedTaxInvoiceComponent {
    invoice_no?: number;
    data: any;
    TaxInvoicedata?: any;
    InvoiceAttachment:any;
    publicVariable = new publicVariable();


    constructor(private route: ActivatedRoute, private CAPI: CustomersService,
        private API: InvoicesService,
        private toastr: ToastrService,
        private router: Router,
        private fb: FormBuilder,
    ) {

    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.invoice_no = +params['id'];
        });
        this.data = history.state.data;
        console.log("GetInvoiceSummary" ,this.data);

        this.loadTaxInvoiceInformation();
    }


    loadTaxInvoiceInformation() {
        try {
            const subscription = this.API.GetTaxInvoiceInformation().subscribe({
                next: (response: any) => {
                    this.TaxInvoicedata = response.data;
                    this.filterTaxInvoiceByInvoiceNo(this.data.invoice_no); // Move this line here
                    this.loadTaxInvoiceAttachment();
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

        const filteredInvoicesObject: any = {};
        TaxInvoicedataArray.forEach((invoice: any) => {
            filteredInvoicesObject[invoice.invoice_no] = invoice;
        });
        this.TaxInvoicedata = filteredInvoicesObject;
        console.log("GetTaxInvoiceInformation", this.TaxInvoicedata);
    }


    handleLoadingError() {
        this.publicVariable.isProcess = false; // Set status to false on error
    }

    loadTaxInvoiceAttachment() {
        try {
            const subscription = this.API.GetTaxInvoiceAttachment().subscribe({
                next: (response: any) => {
                    this.InvoiceAttachment = response.data;
                    this.filterTaxInvoiceAttachmentByInvoiceNo("7TI/APR22/0078");
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
    filterTaxInvoiceAttachmentByInvoiceNo(invoiceNo: string) {
        const TaxInvoicedataArray = this.InvoiceAttachment.filter((invoice: any) => invoice.invoiceNo === invoiceNo);

        const filteredInvoicesObject: any = {};
        TaxInvoicedataArray.forEach((invoice: any) => {
            filteredInvoicesObject[invoice.invoiceNo] = invoice;
        });
        this.InvoiceAttachment = filteredInvoicesObject;
        console.log("GetTaxInvoiceAttachment", this.InvoiceAttachment);
    }


}
