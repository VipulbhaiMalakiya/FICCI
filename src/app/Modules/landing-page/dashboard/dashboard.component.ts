import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/services/excel.service';
import { CustomerService } from '../service/customer.service';
import { Subscription, finalize, timeout } from 'rxjs';
import { customerStatusListModel } from '../interface/customer';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{

    isProcess: boolean = true;
    storedRole: string = localStorage.getItem('userRole') ?? '';
    storedEmail:string =  localStorage.getItem('userEmail') ?? '';
    customerStatus:string = 'DRAFT';
    tableSize: number = 10;
    tableSizes: number[] = [10, 20, 50, 100];
    customerStatusList: customerStatusListModel[] = [];
    count: number = 0;
    Subscription: Subscription = new Subscription();
    page: number = 1;
    searchText: string = '';
    approvalsearchText:string = '';



    constructor(private appService: AppService,
        private modalService: NgbModal,
        private router: Router,
        private toastr: ToastrService,
        private API: CustomerService

    ) {

    }

    ngOnInit(): void {
        this.onCustomerStatus(this.customerStatus);
    }


    onCustomerStatus(customerStatus: string): void {
        const subscription = this.API.getCustomerStatusNew().pipe(
            timeout(120000), // Timeout set to 2 minutes (120000 milliseconds)
            finalize(() => {
                this.isProcess = false;
            })
        ).subscribe({
            next: (response: any) => {
                if (this.storedRole === 'Admin') {
                    // this.publicVariable.customerStatusList = response.data;
                    // this.publicVariable.count = response.data.length;

                    // Filter the response data by email
                    const filteredData = response.data.filter((item: any) => item.createdBy === this.storedEmail && item.customerStatus == customerStatus);
                    this.customerStatusList = filteredData;
                    this.count = filteredData.length;
                } else {

                    // Filter the response data by email and status
                    const filteredData = response.data.filter((item: any) => item.createdBy === this.storedEmail && item.customerStatus == customerStatus);
                    this.customerStatusList = filteredData;

                    this.count = filteredData.length;
                }

            },
            error: (error: any) => {
                if (error.name === 'TimeoutError') {
                    this.toastr.error('Operation timed out after2 minutes', error.name);
                } else {
                    this.toastr.error('Error loading user list', error.name);
                }
            }
        });

        this.Subscription.add(subscription);
    }

    onTableDataChange(event: any) {
        this.page = event;
        this.customerStatusList
    }
    onTableSizeChange(event: any): void {
        this.tableSize = event.target.value;
        this.page = 1;
        this.customerStatusList

    }


}
