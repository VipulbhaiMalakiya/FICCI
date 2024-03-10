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
    TaxInvoicedata: any;
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
        this.loadTaxInvoiceInformation();
    }


    loadTaxInvoiceInformation() {
        try {
            const subscription = this.API.GetTaxInvoiceInformation().subscribe({
                next: (response: any) => {
                    this.TaxInvoicedata = response.data;
                    this.filterTaxInvoiceByInvoiceNo(this.data.invoice_no);
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

    filterTaxInvoiceByInvoiceNo(invoiceNo: string) {
        const TaxInvoicedataArray = this.TaxInvoicedata.filter((invoice: any) => invoice.invoice_no === invoiceNo);
        const filteredInvoicesObject: any = {};
        TaxInvoicedataArray.forEach((invoice: any) => {
            filteredInvoicesObject[invoice.invoice_no] = invoice;
        });
        this.TaxInvoicedata = filteredInvoicesObject;
    }

    handleLoadingError() {
        this.publicVariable.isProcess = false; // Set status to false on error
    }

}
