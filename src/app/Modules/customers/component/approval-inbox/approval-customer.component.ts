import { Component, OnInit } from '@angular/core';
import { AppService, CustomersService, NgbModal, Router, formatDate, ToastrService, publicVariable } from '../../Export/new-customer';
import { finalize, timeout } from 'rxjs';
import { ApproveCustomerList } from '../../interface/customers';

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

    onEdit(data: ApproveCustomerList): void {
        if (data.customerId) {
            this.router.navigate(['customer/approval/remarks/', data.customerId], { state: { data: data } });
        } else {
            console.error('ID is undefined or null');
        }
    }

    loadCustomerStatusList(): void {
        const subscription = this.API.ApproveCustomer().pipe(
            timeout(120000), // Timeout set to 2 minutes (120000 milliseconds)
            finalize(() => {
                this.publicVariable.isProcess = false;
            })
        ).subscribe({
            next: (response: any) => {

                if (this.publicVariable.storedRole === 'Admin') {
                    this.publicVariable.ApproveCustomerList = response.data;
                    this.publicVariable.count = response.data.length;
                    this.publicVariable.isProcess = false;
                } else {
                    // Filter the response data by email
                    const filteredData = response.data.filter((item: any) => item.approverEmail === this.publicVariable.storedEmail);
                    this.publicVariable.ApproveCustomerList = filteredData;
                    this.publicVariable.count = filteredData.length;
                    this.publicVariable.isProcess = false;

                }
            },
            error: (error: any) => {
                if (error.name === 'TimeoutError') {
                    this.publicVariable.isProcess = false;
                    this.toastr.error('Operation timed out after2 minutes', error.name);
                } else {
                    this.publicVariable.isProcess = false;
                    this.toastr.error('Error loading user list', error.name);
                }
            }
        });

        this.publicVariable.Subscription.add(subscription);
    }
    toTitleCase(str: string): string {
        return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    onDownload() {
        const exportData = this.publicVariable.ApproveCustomerList.map((x) => ({
            Name: x?.customerName ? this.toTitleCase(x.customerName) : '',
            Name2: x?.customerLastname ? this.toTitleCase(x.customerLastname) : '',
            Address: x?.custoemrAddress || '',
            Address2: x?.custoemrAddress2 || '',
            Email: x?.customerEmailId ? this.toTitleCase(x.customerEmailId) : '',
            "Country/Region Code":x?.countryCode || '',
            State:x?.stateCode ||  '',
            City: x?.cityCode || '',
            "Phone Number": x?.customerPhoneNo || '',
            "GstNo": x?.customerGstNo || '',
            "Contact Person": x?.customerContactPerson ? this.toTitleCase(x.customerContactPerson) : '',
            "Post Code":x.customerPinCode || '',
            "PanNo": x?.customerPanNo || '',
            "createdOn": x.createdOn ? formatDate(x.createdOn, 'medium', 'en-IN', 'IST') : '',
            "createdby": x.createdby ? this.toTitleCase(x.createdby) : '',
            "Status": x?.statusName ? this.toTitleCase(x.statusName) : '',
            "UpdatedOn": x?.customerUpdatedOn ? formatDate(x.customerUpdatedOn, 'medium', 'en-IN', 'IST') : '',
            'lastUpdateBy': x?.lastUpdateBy ? this.toTitleCase(x.lastUpdateBy) : '',
            "TL Approver": x.customerTlApprover ? this.toTitleCase(x.customerTlApprover) : '',
            "CL Approver": x.customerClusterApprover ? this.toTitleCase(x.customerClusterApprover) : '',
            'Customer TypeName': x.customerTypeName ? this.toTitleCase(x.customerTypeName) : '',
            "Approver Email": x.approverEmail ? this.toTitleCase(x.approverEmail) : '',

        }));

        const headers = ['Name', 'Name2', 'Address', 'Address2', 'Country/Region Code','City','Post Code','Email',
        'Phone Number',
            'Contact Person', 'Customer TypeName','GstNo', 'PanNo', 'TL Approver', 'CL Approver',
            'Approver Email',
            'createdOn', 'createdby', 'UpdatedOn', 'lastUpdateBy',
            'Status'];
        this.appService.exportAsExcelFile(exportData, 'Customer Approval Inbox', headers);
    }

    onTableDataChange(event: any) {
        this.publicVariable.page = event;
        this.publicVariable.ApproveCustomerList
    }
    onTableSizeChange(event: any): void {
        this.publicVariable.tableSize = event.target.value;
        this.publicVariable.page = 1;
        this.publicVariable.ApproveCustomerList
    }
}
