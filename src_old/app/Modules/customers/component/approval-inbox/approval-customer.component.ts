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
        this.publicVariable.storedEmail = sessionStorage.getItem('userEmail') ?? '';
    }

    onEdit(data: ApproveCustomerList): void {
        if (data.customerId) {
            const encryptedHeaderId = btoa(data.customerId.toString());

            this.router.navigate(['customer/approval/remarks/', encryptedHeaderId], { state: { data: data } });
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
                if (response.data) {
                    if (this.publicVariable.storedRole === 'Admin') {
                        // Handle Admin role logic if needed
                    } else {
                        const filteredData = response.data;
                        this.publicVariable.ApproveCustomerList = filteredData;
                        this.publicVariable.count = filteredData.length;
                    }
                } else {
                    console.warn('Response data is null:', response.data);
                    // Set default values or handle the case where response data is null
                    this.publicVariable.ApproveCustomerList = [];
                    this.publicVariable.count = 0;
                }
                this.publicVariable.isProcess = false;
            },
            error: (error: any) => {
                if (error.name === 'TimeoutError') {
                    this.toastr.error('Operation timed out after 2 minutes', error.name);
                } else {
                    this.toastr.error('Error loading user list', error.name);
                }
                this.publicVariable.isProcess = false;
            }
        });

        this.publicVariable.Subscription.add(subscription);
    }

    toTitleCase(str: string): string {
        return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    onDownload() {
        const exportData = this.publicVariable.ApproveCustomerList.map((x) => ({
            "Cust. No.": x?.customerCode || '',
            Name: x?.customerName ? this.toTitleCase(x.customerName) : '',
            "Name 2": x?.customerLastName ? this.toTitleCase(x.customerLastName) : '',
            Address: x?.address || '',
            "Address 2": x.address2 || '',
            State: x?.stateList.stateName,
            Country: x?.countryList.countryName,
            City: x?.cityList.cityName,
            Pincode: x?.pincode,
            "Contact Person": x && x.contact,
            "Phone Number": x?.phoneNumber || '',
            Email: x?.email || '',
            "GST Registration No.": x.gstNumber || '',
            'PAN Card': x.pan || '',
            'GST Customer Type': x.gstType.gstTypeName ? this.toTitleCase(x.gstType.gstTypeName) : '',
            'Created On': x.createdOn ? formatDate(x.createdOn, 'medium', 'en-IN', 'IST') : '',
            'Created By': x.createdBy ? this.toTitleCase(x.createdBy) : '',
            'Last Updated On': x.createdOn ? formatDate(x.modifiedOn, 'medium', 'en-IN', 'IST') : '',
            'Status': x.customerStatus ? this.toTitleCase(x.customerStatus) : '',
        }));

        const headers = ['Cust. No.', 'Name', 'Name 2', 'Address', 'Address 2', 'Country', 'State', 'City',
            'Pincode', 'Email', 'Phone Number', 'Contact Person',
            'GST Customer Type', 'GST Registration No.', 'PAN Card',
            'Created On', 'Created By', 'Last Updated On', 'Last Update By', 'Status'];
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
