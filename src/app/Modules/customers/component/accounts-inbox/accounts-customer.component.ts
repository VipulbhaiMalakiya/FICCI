import { Component } from '@angular/core';
import { AppService, CustomersService, NgbModal, Router, ToastrService, formatDate, publicVariable } from '../../Export/new-customer';
import { finalize, timeout } from 'rxjs';
import { ApproveCustomerList, customerStatusListModel } from '../../interface/customers';

@Component({
    selector: 'app-accounts-customer',
    templateUrl: './accounts-customer.component.html',
    styleUrls: ['./accounts-customer.component.css']
})
export class AccountsCustomerComponent {

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
        const subscription = this.API.getCustomerStatuaccount().pipe(
            timeout(120000), // Timeout set to 2 minutes (120000 milliseconds)
            finalize(() => {
                this.publicVariable.isProcess = false;
            })
        ).subscribe({
            next: (response: any) => {
                this.publicVariable.customerStatusList = response.data;
                this.publicVariable.count = response.data.length;
                this.publicVariable.isProcess = false;
            },
            error: (error: any) => {
                if (error.name === 'TimeoutError') {
                    this.toastr.error('Operation timed out after2 minutes', error.name);
                    this.publicVariable.isProcess = false;

                } else {
                    this.toastr.error('Error loading user list', error.name);
                    this.publicVariable.isProcess = false;

                }
            }
        });

        this.publicVariable.Subscription.add(subscription);
    }


    onEdit(data: customerStatusListModel): void {
        if (data.customerId) {
            const encryptedHeaderId = btoa(data.customerId.toString());

            this.router.navigate(['customer/accounts/remarks/', encryptedHeaderId], { state: { data: data } });
        } else {
            console.error('ID is undefined or null');
        }
    }

    toTitleCase(str: string): string {
        return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
    onDownload() {
        const exportData = this.publicVariable.customerStatusList.map((x) => ({
            "Cust. No.": x?.customerCode || '',
            Name: x?.customerName ? this.toTitleCase(x.customerName) : '',
            "Name 2": x?.customerLastName ? this.toTitleCase(x.customerLastName) : '',

            Address: x?.address || '',
            "Address 2": x.address2 || '',

            State: x?.stateList.stateName,
            Country: x.countryList.countryName,
            City: x?.cityList.cityName,
            Pincode: x?.pincode,
            "Contact Person": x && x.contact,
            "Phone Number": x?.phoneNumber || '',
            Email: x?.email || '',
            gstNumber: x.gstNumber || '',
            'PAN Card': x.pan || '',
            'GST Customer Type': x.gstType.gstTypeName ? this.toTitleCase(x.gstType.gstTypeName) : '',
            'Created On': x.createdOn ? formatDate(x.createdOn, 'medium', 'en-IN', 'IST') : '',
            'Created By': x.createdBy ? this.toTitleCase(x.createdBy) : '',
            'Last Updated On': x.createdOn ? formatDate(x.modifiedOn, 'medium', 'en-IN', 'IST') : '',
            'Last Update By': x.lastUpdateBy ? this.toTitleCase(x.lastUpdateBy) : '',
            'Status': x.customerStatus ? this.toTitleCase(x.customerStatus) : '',
        }));

        const headers = ['Cust. No.', 'Name', 'Name 2', 'Address', 'Address 2', 'Country', 'State', 'City',
            'Pincode', 'Contact Person', 'Email', 'Phone Number',
            'GST Customer Type', 'gstNumber', 'PAN Card',
            'Created On', 'Created By', 'Last Updated On', 'Last Update By', 'Status'];
        this.appService.exportAsExcelFile(exportData, 'Customer Status', headers);
    }
    onTableDataChange(event: any) {
        this.publicVariable.page = event;
        this.publicVariable.customerStatusList
    }
    onTableSizeChange(event: any): void {
        this.publicVariable.tableSize = event.target.value;
        this.publicVariable.page = 1;
        this.publicVariable.customerStatusList

    }


}
