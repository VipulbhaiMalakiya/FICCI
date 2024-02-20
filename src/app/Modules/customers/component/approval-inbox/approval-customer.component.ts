import { Component, OnInit } from '@angular/core';
import { AppService, CustomersService, NgbModal, Router, ToastrService, publicVariable } from '../../Export/new-customer';
import { finalize, timeout } from 'rxjs';

@Component({
    selector: 'app-approval-customer',
    templateUrl: './approval-customer.component.html',
    styleUrls: ['./approval-customer.component.css']
})
export class ApprovalCustomerComponent implements OnInit {
    publicVariable = new publicVariable();


    constructor(private appService: AppService,
        private modalService: NgbModal,
        private router: Router,
        private toastr: ToastrService,
        private API: CustomersService


    ) {

    }

    ngOnInit(): void {
        this.loadCustomerStatusList();
        this.publicVariable.storedEmail = localStorage.getItem('userEmail') ?? '';
    }

    loadCustomerStatusList(): void {
        const subscription = this.API.getCustomerStatus().pipe(
            timeout(120000), // Timeout set to 2 minutes (120000 milliseconds)
            finalize(() => {
                this.publicVariable.isProcess = false;
            })
        ).subscribe({
            next: (response: any) => {
                if(this.publicVariable.storedRole === 'Admin'){
                    this.publicVariable.customerStatusList = response.data;
                    this.publicVariable.count = response.data.length;
                }else{
                      // Filter the response data by email
                const filteredData = response.data.filter((item: any) => item.createdBy === this.publicVariable.storedEmail);
                this.publicVariable.customerStatusList = filteredData;
                this.publicVariable.count = filteredData.length;
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

        this.publicVariable.Subscription.add(subscription);
    }

    onDownload() {
        // const exportData = this.publicVariable.userlist.map((x) => ({
        //   "Cust. No.": x?.imeM_EmpId || '',
        //   Name: x?.imeM_Name || '',
        //   Address: x?.imeM_Username || '',
        //   City: x?.imeM_Email || '',
        //   Contact: x && x.isActive ? 'Yes' : 'No',
        //   Email: x?.roleName || ''
        // }));

        // const headers = ['Cust. No.','Name', 'Address', 'City','Contact', 'Email'];
        // this.appService.exportAsExcelFile(exportData,'Customer Status',headers);
    }

    onTableDataChange(event: any) {
        this.publicVariable.page = event;
        // this.publicVariable.userlist
    }
    onTableSizeChange(event: any): void {
        this.publicVariable.tableSize = event.target.value;
        this.publicVariable.page = 1;
        // this.publicVariable.userlist

    }
}
