import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, CustomersService, publicVariable } from '../../Export/new-customer';

@Component({
    selector: 'app-customer-status',
    templateUrl: './customer-status.component.html',
    styleUrls: ['./customer-status.component.css']
})
export class CustomerStatusComponent implements OnInit {
    customerId?: number;
    data: any;
    publicVariable = new publicVariable();


    constructor(private route: ActivatedRoute,      private API: CustomersService) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.customerId = +params['id'];
        });
        this.data = history.state.data;
    }




}
