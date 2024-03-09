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
        console.log(this.data);




    }

}
