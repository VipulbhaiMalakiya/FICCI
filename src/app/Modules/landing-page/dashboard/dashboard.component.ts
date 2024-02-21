import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/services/excel.service';
import { CustomerService } from '../service/customer.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {


    constructor(private appService: AppService,
        private modalService: NgbModal,
        private router: Router,
        private toastr: ToastrService,
        private API: CustomerService

    ) {

    }
}
