import { Component, OnInit } from '@angular/core';
import { AppService, ConfirmationDialogModalComponent, CustomersService, NgbModal, Router, ToastrService, customerStatusListModel, formatDate, publicVariable } from '../../customers/Export/new-customer';
import { timeout, finalize } from 'rxjs';


@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

    publicVariable = new publicVariable();
    customerStatus: string = 'DRAFT';
    isDRAFT: number = 0;
    PendingApproval: number = 0;
    ApprovedAccounts: number = 0;
    RejectedbyAccounts: number = 0;
    ALL: number = 0;
    dashboardData: any;


    constructor(private appService: AppService,
        private modalService: NgbModal,
        private router: Router,
        private toastr: ToastrService,
        private API: CustomersService

    ) {

    }

    ngOnInit(): void {

        this.loadCustomerStatusCountList();
        this.publicVariable.storedEmail = localStorage.getItem('userEmail') ?? '';
    }

    loadCustomerStatusCountList(): void {
        const subscription = this.API.getCustomerStatusNew().pipe(
            timeout(120000), // Timeout set to 2 minutes (120000 milliseconds)
            finalize(() => {
                this.publicVariable.isProcess = false;
            })
        ).subscribe({
            next: (response: any) => {
                this.countDataByStatus(response.data);
                this.dashboardData = response.data;
                this.loadCustomerStatusList(this.customerStatus);
            },
            error: (error: any) => {
                if (error.name === 'TimeoutError') {
                    this.toastr.error('Operation timed out after 2 minutes', error.name);
                } else {
                    this.toastr.error('Error loading user list', error.name);
                }
            }
        });

        this.publicVariable.Subscription.add(subscription);
    }

    // Helper method to count data for each customer status
    countDataByStatus(data: any[]): void {
        const counts: any = {
            'DRAFT': 0,
            'PENDING WITH TL APPROVER': 0,
            'PENDING WITH CH APPROVER': 0,
            'PENDING WITH ACCOUNTS APPROVER': 0,
            'APPROVED BY ACCOUNTS APPROVER': 0,
            'REJECTED BY TL APPROVER': 0,
            'REJECTED BY CH APPROVER': 0,
            'REJECTED BY ACCOUNTS APPROVER': 0,
            'ALL': 0
        };

        // Filter data for each customer status
        const draftData = data.filter(item => item.customerStatus === 'DRAFT');
        counts['DRAFT'] = draftData.length;

        const pendingData = data.filter(item => item.customerStatus === 'PENDING WITH TL APPROVER'
            || item.customerStatus === 'PENDING WITH CH APPROVER'
            || item.customerStatus === 'PENDING WITH ACCOUNTS APPROVER');
        counts['PENDING WITH TL APPROVER'] = pendingData.length;


        const approvedData = data.filter(item => item.customerStatus === 'APPROVED BY ACCOUNTS APPROVER');
        counts['APPROVED BY ACCOUNTS APPROVER'] = approvedData.length;

        const rejectedData = data.filter(item => item.customerStatus === 'REJECTED BY TL APPROVER'
            || item.customerStatus === 'REJECTED BY CH APPROVER'
            || item.customerStatus === 'REJECTED BY ACCOUNTS APPROVER');
        counts['REJECTED BY CH APPROVER'] = rejectedData.length;

        // Calculate total count
        counts['ALL'] = data.length;

        // Update counts
        this.isDRAFT = counts['DRAFT'];
        this.PendingApproval = counts['PENDING WITH TL APPROVER'];
        this.ApprovedAccounts = counts['APPROVED BY ACCOUNTS APPROVER'];
        this.RejectedbyAccounts = counts['REJECTED BY CH APPROVER'];
        this.ALL = counts['ALL'];
        this.publicVariable.count = counts['ALL']; // Total count

    }

    loadCustomerStatusList(status: string): void {
        this.customerStatus = status;
        let filteredData;

        switch (this.customerStatus) {
            case 'DRAFT':
                filteredData = this.dashboardData.filter((item: any) =>
                    // item.createdBy === this.publicVariable.storedEmail &&
                    item.customerStatus === 'DRAFT');
                break;
            case 'PENDING WITH APPROVER':
                filteredData = this.dashboardData.filter((item: any) =>
                // item.createdBy === this.publicVariable.storedEmail &&
                (item.customerStatus === 'PENDING WITH TL APPROVER' ||
                    item.customerStatus === 'PENDING WITH CH APPROVER' ||
                    item.customerStatus === 'PENDING WITH ACCOUNTS APPROVER'));
                break;
            case 'APPROVED BY ACCOUNTS APPROVER':
                filteredData = this.dashboardData.filter((item: any) =>
                    // item.createdBy === this.publicVariable.storedEmail &&
                    item.customerStatus === this.customerStatus);
                break;
            case 'REJECTED BY CH APPROVER':
                filteredData = this.dashboardData.filter((item: any) =>
                // item.createdBy === this.publicVariable.storedEmail &&
                (item.customerStatus === 'REJECTED BY TL APPROVER' ||
                    item.customerStatus === 'REJECTED BY CH APPROVER' ||
                    item.customerStatus === 'REJECTED BY ACCOUNTS APPROVER'));
                break;
            default:
                filteredData = this.dashboardData
                break;
        }

        this.publicVariable.customerStatusList = filteredData;
        this.publicVariable.count = filteredData.length;

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


    onDelete(id: number) {
        const modalRef = this.modalService.open(ConfirmationDialogModalComponent, { size: "sm", centered: true, backdrop: "static" });
        var componentInstance = modalRef.componentInstance as ConfirmationDialogModalComponent;
        componentInstance.message = "Do you really want to delete these records? This process cannot be undone ?";
        modalRef.result.then((canDelete: boolean) => {
            if (canDelete) {
                this.publicVariable.isProcess = true;
                this.API.delete(id).subscribe({
                    next: (res: any) => {
                        this.toastr.success(res.message, 'Success');
                        this.publicVariable.isProcess = false;
                        this.loadCustomerStatusCountList();
                    },
                    error: (error) => {
                        this.publicVariable.isProcess = false;
                        this.toastr.error(error.error.message, 'Error');
                    }
                });

            }
        }).catch(() => { });

    }

    onEdit(data: customerStatusListModel): void {
        if (data.customerId) {
            this.router.navigate(['customer/status/edit', data.customerId], { state: { data: data } });
        } else {
            console.error('ID is undefined or null');
        }
    }

    onView(data: customerStatusListModel): void {
        if (data.customerId) {
            this.router.navigate(['customer/status/view', data.customerId], { state: { data: data } });
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
            Address: x?.address || '',
            State: x?.state.stateName ? this.toTitleCase(x.state.stateName) : '',
            Country: x.country?.countryName,
            City: x?.city.cityName ? this.toTitleCase(x.city.cityName) : '',
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
            'TL Approver': x.tlApprover ? this.toTitleCase(x.tlApprover) : '',
            'CL Approver': x.clApprover ? this.toTitleCase(x.clApprover) : '',
            'Status': x.customerStatus ? this.toTitleCase(x.customerStatus) : '',
        }));

        const headers = ['Cust. No.', 'Name', 'Address', 'Country', 'State', 'City',
            'Pincode', 'Contact Person', 'Phone Number',
            'Email', 'gstNumber', 'PAN Card', 'GST Customer Type',
            'Created On', 'Created By', 'Last Updated On', 'Last Update By', 'TL Approver', 'CL Approver', 'Status'];
        this.appService.exportAsExcelFile(exportData, 'Customer Status', headers);
    }



}
