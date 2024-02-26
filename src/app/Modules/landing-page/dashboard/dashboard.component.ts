import { Component, OnInit } from '@angular/core';
import { AppService, ConfirmationDialogModalComponent, CustomersService, NgbModal, Router, ToastrService, customerStatusListModel, formatDate, publicVariable } from '../../customers/Export/new-customer';
import { timeout, finalize } from 'rxjs';
import { InvoicesService } from '../../invoice/service/invoices.service';
import { invoiceApproveModule, invoiceStatusModule } from '../../invoice/interface/invoice';


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

    PIisDRAFT: number = 0;
    PIPendingApproval: number = 0;
    PIApprovedAccounts: number = 0;
    PIRejectedbyAccounts: number = 0;
    PIALL: number = 0;
    dashboardData: any;
    invoiceStatuslistData: invoiceStatusModule[] = [];


    constructor(private appService: AppService,
        private modalService: NgbModal,
        private router: Router,
        private toastr: ToastrService,
        private API: CustomersService,
        private IAPI : InvoicesService

    ) {

    }

    ngOnInit(): void {
        this.loadCustomerStatusCountList();
        // this.loadCityList();
        this.publicVariable.storedEmail = localStorage.getItem('userEmail') ?? '';
    }


    loadCityList() {
        try {
            const subscription = this.API.getCityList().subscribe({
                next: (response: any) => {
                    this.publicVariable.cityList = response.data;
                    this.loadCustomerStatusCountList();

                },
                error: (error) => {
                    console.error('Error loading city list:', error);
                    console.error('Failed to load city list. Please try again later.');
                },
            });

            this.publicVariable.Subscription.add(subscription);
        } catch (error) {
            console.error('Error loading city list:', error);
            console.error('An unexpected error occurred. Please try again later.');
        }
    }



    // getCityName(cityId: string): string | undefined {
    //     const city = this.publicVariable.cityList.find((c: any) => c.cityId === cityId);
    //     const cityName = city ? city.cityName : undefined;
    //     this.handleLoadingError(); // Set isProcess to false after retrieving the city name
    //     return cityName;
    // }
    // handleLoadingError() {
    //     this.publicVariable.isProcess = false; // Set status to false on error
    // }

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

    loadPurchaseInvoiceList(): void {
        try {
            const subscription = this.IAPI.getPurchaseInvoice_New().subscribe({
                next: (response: any) => {
                    this.countDataByInvoies(response.data);
                    this.dashboardData = response.data;

                    this.loadInoivceStatusList(this.customerStatus);
                },
                error: (error) => {
                    console.error('Error loading project list:', error);
                }
            });

            this.publicVariable.Subscription.add(subscription);
        } catch (error) {
            console.error('Error loading project list:', error);
        }
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

    countDataByInvoies(data: any[]): void {
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
        const draftData = data.filter(item => item.headerStatus === 'DRAFT');
        counts['DRAFT'] = draftData.length;

        const pendingData = data.filter(item => item.headerStatus === 'PENDING WITH TL APPROVER'
            || item.headerStatus === 'PENDING WITH CH APPROVER'
            || item.headerStatus === 'PENDING WITH ACCOUNTS APPROVER');
        counts['PENDING WITH TL APPROVER'] = pendingData.length;


        const approvedData = data.filter(item => item.headerStatus === 'APPROVED BY ACCOUNTS APPROVER');
        counts['APPROVED BY ACCOUNTS APPROVER'] = approvedData.length;

        const rejectedData = data.filter(item => item.headerStatus === 'REJECTED BY TL APPROVER'
            || item.headerStatus === 'REJECTED BY CH APPROVER'
            || item.headerStatus === 'REJECTED BY ACCOUNTS APPROVER');
        counts['REJECTED BY CH APPROVER'] = rejectedData.length;

        // Calculate total count
        counts['ALL'] = data.length;

        // Update counts
        this.PIisDRAFT = counts['DRAFT'];
        this.PIPendingApproval = counts['PENDING WITH TL APPROVER'];
        this.PIApprovedAccounts = counts['APPROVED BY ACCOUNTS APPROVER'];
        this.PIRejectedbyAccounts = counts['REJECTED BY CH APPROVER'];
        this.PIALL = counts['ALL'];
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

    loadInoivceStatusList(status: string): void {
        this.customerStatus = status;
        let filteredData;

        switch (this.customerStatus) {
            case 'DRAFT':
                filteredData = this.dashboardData.filter((item: any) =>
                    // item.createdBy === this.publicVariable.storedEmail &&
                    item.headerStatus === 'DRAFT');
                break;
            case 'PENDING WITH APPROVER':
                filteredData = this.dashboardData.filter((item: any) =>
                // item.createdBy === this.publicVariable.storedEmail &&
                (item.headerStatus === 'PENDING WITH TL APPROVER' ||
                    item.headerStatus === 'PENDING WITH CH APPROVER' ||
                    item.headerStatus === 'PENDING WITH ACCOUNTS APPROVER'));
                break;
            case 'APPROVED BY ACCOUNTS APPROVER':
                filteredData = this.dashboardData.filter((item: any) =>
                    // item.createdBy === this.publicVariable.storedEmail &&
                    item.headerStatus ==='APPROVED BY ACCOUNTS APPROVER');
                break;
            case 'REJECTED BY CH APPROVER':
                filteredData = this.dashboardData.filter((item: any) =>
                // item.createdBy === this.publicVariable.storedEmail &&
                (item.headerStatus === 'REJECTED BY TL APPROVER' ||
                    item.headerStatus === 'REJECTED BY CH APPROVER' ||
                    item.headerStatus === 'REJECTED BY ACCOUNTS APPROVER'));
                break;
            default:
                filteredData = this.dashboardData
                break;
        }

        this.invoiceStatuslistData = filteredData;
        console.log(this.invoiceStatuslistData);

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
            "Name 2":x?.customerLastName ? this.toTitleCase(x.customerLastName) : '',
            Address: x?.address || '',
            "Address 2":x.address2  || '',
            State: x?.stateCode ,
            Country: x.countryCode ,
            City: x?.cityCode,
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
            'Last Update By': x.lastUpdateBy ? this.toTitleCase(x.lastUpdateBy) : '',
            'TL Approver': x.tlApprover ? this.toTitleCase(x.tlApprover) : '',
            'CL Approver': x.clApprover ? this.toTitleCase(x.clApprover) : '',
            'Status': x.customerStatus ? this.toTitleCase(x.customerStatus) : '',
        }));

        const headers = ['Cust. No.', 'Name','Name 2', 'Address','Address 2', 'Country', 'State', 'City',
            'Pincode', 'Email','Phone Number','Contact Person',
           'GST Customer Type', 'GST Registration No.', 'PAN Card',
            'Created On', 'Created By', 'Last Updated On', 'Last Update By', 'TL Approver', 'CL Approver', 'Status'];
        this.appService.exportAsExcelFile(exportData, 'Customer Status', headers);
    }

    onDownloadPI() {
        const exportData = this.invoiceStatuslistData.map((x) => ({
            "PO No.": x?.impiHeaderProjectCode || '',
            "PO Date": x?.impiHeaderSubmittedDate ? formatDate(x.impiHeaderSubmittedDate, 'medium', 'en-IN', 'IST') : '',
            Department: x?.impiHeaderProjectDepartmentName ? this.toTitleCase(x.impiHeaderProjectDepartmentName) : '',
            Divison: x?.impiHeaderProjectDivisionName ? this.toTitleCase(x.impiHeaderProjectDivisionName) : '',
            Category: x?.impiHeaderInvoiceType ? this.toTitleCase(x.impiHeaderInvoiceType) : '',
            "PAN No": x?.impiHeaderPanNo || '',
            "State": x?.impiHeaderCustomerState ? this.toTitleCase(x.impiHeaderCustomerState) : '',
            "City": x?.impiHeaderCustomerCity ? this.toTitleCase(x.impiHeaderCustomerCity) : '',
            "Pincode": x?.impiHeaderCustomerPinCode || '',
            "Vendor Name": x && x.impiHeaderCustomerName ? this.toTitleCase(x.impiHeaderCustomerName) : '',
            "Address": x?.impiHeaderCustomerAddress,
            'Customer  GST Number': x?.impiHeaderCustomerGstNo || '',
            'Contact Person': x?.impiHeaderCustomerContactPerson || '',
            'Phone No': x?.impiHeaderCustomerPhoneNo || '',
            "Email ID": x?.impiHeaderCustomerEmailId || '',
            Amount: x?.impiHeaderTotalInvoiceAmount != null ? (x.impiHeaderTotalInvoiceAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '',
            'Payment Terms': x?.impiHeaderPaymentTerms || '',
            'impiHeaderRemarks': x?.impiHeaderRemarks || '',
            'Tl Approver':x?.impiHeaderTlApprover  ? this.toTitleCase(x.impiHeaderTlApprover) : '',
            'Cl Approver':x?.impiHeaderClusterApprover  ? this.toTitleCase(x.impiHeaderClusterApprover) : '',
            'Finance Approver': x?.impiHeaderFinanceApprover ? this.toTitleCase(x.impiHeaderFinanceApprover) : '',
            'Support Approver' : x?.impiHeaderSupportApprover ? this.toTitleCase(x.impiHeaderSupportApprover) : '',
            "Update Date": x?.impiHeaderModifiedDate ? formatDate(x.impiHeaderModifiedDate, 'medium', 'en-IN', 'IST') : '',
        }));

        const headers = [
            'PO No.', 'PO Date', 'Department', 'Divison', 'Category',
            'Vendor Name', 'Address', 'State', 'City', 'Pincode',
            'Phone No', "Email ID", 'Contact Person', 'Customer  GST Number', 'PAN No', 'Amount', 'Payment Terms',
            'impiHeaderRemarks','Tl Approver', 'Cl Approver','Finance Approver','Support Approver','Update Date'
        ];
        this.appService.exportAsExcelFile(exportData, 'PI Invoice Status', headers);
    }



}
