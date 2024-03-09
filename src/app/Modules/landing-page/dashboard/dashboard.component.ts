import { Component, OnInit } from '@angular/core';
import { AppService, ConfirmationDialogModalComponent, CustomersService, NgbModal, Router, ToastrService, customerStatusListModel, formatDate, publicVariable } from '../../customers/Export/new-customer';
import { timeout, finalize, catchError, throwError } from 'rxjs';
import { InvoicesService } from '../../invoice/service/invoices.service';
import { InvoiceSummaryModel, invoiceApproveModule, invoiceStatusModule } from '../../invoice/interface/invoice';
import { forkJoin } from 'rxjs';
import { EmailComponent } from '../../invoice/send-email/email/email.component';
import { UpdateEmailComponent } from '../../invoice/update-email/update-email.component';


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
    forapproval: number = 0;

    PIisDRAFT: number = 0;
    PIPendingApproval: number = 0;
    PIApprovedAccounts: number = 0;
    PIRejectedbyAccounts: number = 0;
    PIALL: number = 0;
    PIforapproval: number = 0;
    PostedTaxInvoiceCount : number = 0;
    InvoiceSummaryList : InvoiceSummaryModel[] = [];
    Cancelled:number = 0;

    dashboardData: any;
    invoiceStatuslistData: invoiceStatusModule[] = [];


    constructor(private appService: AppService,
        private modalService: NgbModal,
        private router: Router,
        private toastr: ToastrService,
        private API: CustomersService,
        private IAPI: InvoicesService
    ) { }

    ngOnInit(): void {
        this.loadCustomerStatusCountList();
        this.publicVariable.storedEmail = localStorage.getItem('userEmail') ?? '';
    }


    loadCustomerStatusCountList(): void {
        // Observable for the first API call
        const statusSubscription = this.API.getCustomerStatusNew().pipe(
            timeout(120000),
            catchError((error: any) => {
                if (error.name === 'TimeoutError') {
                    this.toastr.error('Operation timed out after 2 minutes', error.name);
                } else {
                    this.toastr.error('Error loading user list', error.name);
                }
                return throwError(error);
            })
        );

        // Observable for the second API call
        const accountSubscription = this.API.getCustomerStatuaccount().pipe(
            timeout(120000),
            catchError((error: any) => {
                if (error.name === 'TimeoutError') {
                    this.toastr.error('Operation timed out after 2 minutes', error.name);
                } else {
                    this.toastr.error('Error loading user list', error.name);
                }
                return throwError(error);
            })
        );
        forkJoin([statusSubscription, accountSubscription]).subscribe({
            next: ([statusResponse, accountResponse]: [any, any]) => {

                this.dashboardData = [...statusResponse.data, ...accountResponse.data];
                this.countDataByStatus(this.dashboardData);

                this.loadCustomerStatusList(this.customerStatus);
                this.publicVariable.isProcess = false;
            },
            error: (error: any) => {
                this.toastr.error('Error loading user list', error.name);
            }
        });
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
            'FOR APPROVAL': 0,
            'ALL': 0
        };

        // Filter data for each customer status
        const draftData = data.filter(item => item.customerStatus === 'DRAFT');
        counts['DRAFT'] = draftData.length;

        const foraprovalData = data.filter((item: any) =>
            (item.customerStatus === 'PENDING WITH ACCOUNTS APPROVER'));
        counts['FOR APPROVAL'] = foraprovalData.length;


        const pendingData = data.filter((item: any) =>
            item.createdBy === this.publicVariable.storedEmail &&
            (item.customerStatus === 'PENDING WITH TL APPROVER' ||
                item.customerStatus === 'PENDING WITH CH APPROVER' ||
                item.customerStatus === 'PENDING WITH ACCOUNTS APPROVER' ||
                item.customerStatus === 'PENDING WITH FINANCE APPROVER'));
        counts['PENDING WITH TL APPROVER'] = pendingData.length;


        const approvedData = data.filter(item => item.customerStatus === 'APPROVED BY ACCOUNTS APPROVER');
        counts['APPROVED BY ACCOUNTS APPROVER'] = approvedData.length;

        const rejectedData = data.filter(item => item.customerStatus === 'REJECTED BY TL APPROVER'
            || item.customerStatus === 'REJECTED BY CH APPROVER'
            || item.customerStatus === 'REJECTED BY ACCOUNTS APPROVER');
        counts['REJECTED BY CH APPROVER'] = rejectedData.length;

        // Calculate total count
        const allData = this.publicVariable.storedRole !== 'Accounts' ?
            data.filter(item => item.createdBy === this.publicVariable.storedEmail) :
            data;
        counts['ALL'] = allData.length;

        // Update counts
        this.isDRAFT = counts['DRAFT'];
        this.PendingApproval = counts['PENDING WITH TL APPROVER'];
        this.ApprovedAccounts = counts['APPROVED BY ACCOUNTS APPROVER'];
        this.RejectedbyAccounts = counts['REJECTED BY CH APPROVER'];
        this.forapproval = counts['FOR APPROVAL']
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
                    item.createdBy === this.publicVariable.storedEmail &&
                    (item.customerStatus === 'PENDING WITH TL APPROVER' ||
                        item.customerStatus === 'PENDING WITH CH APPROVER' ||
                        item.customerStatus === 'PENDING WITH ACCOUNTS APPROVER' ||
                        item.customerStatus === 'PENDING WITH FINANCE APPROVER'));
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
                    item.customerStatus === 'REJECTED BY ACCOUNTS APPROVER' ||
                    item.customerStatus === 'REJECTED BY FINANCE APPROVER'));
                break;
            case 'FOR APPROVAL':
                filteredData = this.dashboardData.filter((item: any) => (item.customerStatus === 'PENDING WITH ACCOUNTS APPROVER'));
                break;

            case 'ALL':

                filteredData = this.publicVariable.storedRole !== 'Accounts' ?
                    this.dashboardData.filter((item: any) => item.createdBy === this.publicVariable.storedEmail) :
                    this.dashboardData;
                break;

            default:
                filteredData = this.dashboardData
                break;
        }

        this.publicVariable.customerStatusList = filteredData;
        this.publicVariable.count = filteredData.length;

    }

    loadPurchaseInvoiceList(): void {
        try {
            // Observable for the first API call
            const purchaseInvoiceObservable = this.IAPI.getPurchaseInvoice_New().pipe(
                catchError((error: any) => {
                    console.error('Error loading purchase invoice list:', error);
                    return throwError(error);
                })
            );

            // Observable for the second API call
            const approveInvoiceObservable = this.IAPI.getApproveInvoice().pipe(
                timeout(120000), // Timeout set to 2 minutes (120000 milliseconds)
                catchError((error: any) => {
                    console.error('Error loading approve invoice list:', error);
                    return throwError(error);
                }),
                finalize(() => {
                    this.publicVariable.isProcess = false;
                })
            );

             // Observable for the third API call
             const accountInvoiceObservable = this.IAPI.getApproveAccountInvoice().pipe(
                timeout(120000), // Timeout set to 2 minutes (120000 milliseconds)
                catchError((error: any) => {
                    console.error('Error loading approve invoice list:', error);
                    return throwError(error);
                }),
                finalize(() => {
                    this.publicVariable.isProcess = false;
                })
            );



            // Combining both observables
            forkJoin([purchaseInvoiceObservable, approveInvoiceObservable, accountInvoiceObservable]).subscribe({
                next: ([purchaseResponse, approveResponse, accountResponse]: [any, any, any]) => {
                    // Check if data is not null and iterable for purchaseResponse
                    if (purchaseResponse.data && Array.isArray(purchaseResponse.data)) {
                        this.dashboardData = purchaseResponse.data;
                    } else {
                        console.warn('Purchase response data is null or not iterable');
                        this.dashboardData = [];
                    }

                    // Concatenate approveResponse.data with dashboardData if it's iterable
                    if (approveResponse.data && Array.isArray(approveResponse.data)) {
                        this.dashboardData = [...this.dashboardData, ...approveResponse.data];
                    } else {
                        console.warn('Approve response data is null or not iterable');
                    }

                    // Concatenate accountResponse.data with dashboardData if it's iterable
                    if (accountResponse.data && Array.isArray(accountResponse.data)) {
                        this.dashboardData = [...this.dashboardData, ...accountResponse.data];
                    } else {
                        console.warn('Account response data is null or not iterable');
                    }

                    // Processing the merged data
                    this.countDataByInvoies(this.dashboardData);
                    this.loadInoivceStatusList(this.customerStatus);
                    this.publicVariable.isProcess = false;
                    this.loadInvoiceSummary();
                },
                error: (error: any) => {
                    this.toastr.error('Error loading invoice lists', error.name);
                    this.publicVariable.isProcess = false;
                }
            });

        } catch (error) {
            console.error('Error loading invoice lists:', error);
            this.publicVariable.isProcess = false;
        }
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
            'FOR APPROVAL': 0,
            'Cancelled':0,
            'ALL': 0
        };

        // Filter data for each customer status
        const draftData = data.filter(item => item.headerStatus === 'DRAFT');
        counts['DRAFT'] = draftData.length;

        const pendingData = data.filter(item =>
            item.impiHeaderCreatedBy === this.publicVariable.storedEmail &&
            (item.headerStatus === 'PENDING WITH TL APPROVER' ||
                item.headerStatus === 'PENDING WITH CH APPROVER' ||
                item.headerStatus === 'PENDING WITH ACCOUNTS APPROVER' ||
                item.headerStatus === 'PENDING WITH FINANCE APPROVER'));
        counts['PENDING WITH TL APPROVER'] = pendingData.length;

        const forapproval = data.filter(item => item.headerStatus === 'PENDING WITH TL APPROVER'
            || item.headerStatus === 'PENDING WITH CH APPROVER'
            || item.headerStatus === 'PENDING WITH ACCOUNTS APPROVER'
            || item.headerStatus === 'PENDING WITH FINANCE APPROVER');
        counts['FOR APPROVAL'] = forapproval.length;

        const approvedData = data.filter(item => item.headerStatus === 'APPROVED BY ACCOUNTS APPROVER'
        || item.headerStatus ==='MAIL SENT BY ACCOUNT TO CUSTOMER');
        counts['PENDING WITH FINANCE APPROVER'] = approvedData.length;

        const rejectedData = data.filter(item => item.headerStatus === 'REJECTED BY TL APPROVER'
            || item.headerStatus === 'REJECTED BY CH APPROVER'
            || item.headerStatus === 'REJECTED BY ACCOUNTS APPROVER'
            );
        counts['REJECTED BY CH APPROVER'] = rejectedData.length;

        const cancelData = data.filter(item =>
        item.headerStatus === 'CANCEL BY EMPLOYEE');
    counts['Cancelled'] = cancelData.length;

        // Cancelled


        // Calculate total count
        counts['ALL'] =  data.length;

        // Update counts
        this.PIisDRAFT = counts['DRAFT'];
        this.PIforapproval = counts['FOR APPROVAL'];
        this.PIPendingApproval = counts['PENDING WITH TL APPROVER'];
        this.PIApprovedAccounts = counts['PENDING WITH FINANCE APPROVER'];
        this.PIRejectedbyAccounts = counts['REJECTED BY CH APPROVER'];
        this.PIALL = counts['ALL'];
        this.Cancelled = counts['Cancelled'];
        this.publicVariable.count = counts['ALL']; // Total count
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
                    item.impiHeaderCreatedBy === this.publicVariable.storedEmail &&
                    (item.headerStatus === 'PENDING WITH TL APPROVER' ||
                        item.headerStatus === 'PENDING WITH CH APPROVER' ||
                        item.headerStatus === 'PENDING WITH ACCOUNTS APPROVER' ||
                        item.headerStatus === 'PENDING WITH FINANCE APPROVER'));
                break;
            case 'APPROVED BY ACCOUNTS APPROVER':
                filteredData = this.dashboardData.filter((item: any) =>
                    item.headerStatus === 'APPROVED BY ACCOUNTS APPROVER'
                    || item.headerStatus ==='MAIL SENT BY ACCOUNT TO CUSTOMER');
                break;
            case 'REJECTED BY CH APPROVER':
                filteredData = this.dashboardData.filter((item: any) =>
                // item.createdBy === this.publicVariable.storedEmail &&
                (item.headerStatus === 'REJECTED BY TL APPROVER' ||
                    item.headerStatus === 'REJECTED BY CH APPROVER' ||
                    item.headerStatus === 'REJECTED BY ACCOUNTS APPROVER' ||
                    item.headerStatus === 'REJECTED BY FINANCE APPROVER' ));
                break;
                case 'Cancelled':
                    filteredData = this.dashboardData.filter((item: any) =>
                    // item.createdBy === this.publicVariable.storedEmail &&
                    (
                        item.headerStatus === 'CANCEL BY EMPLOYEE'));
                    break;
            case 'FOR APPROVAL':
                filteredData = this.dashboardData.filter((item: any) => (
                    item.headerStatus === 'PENDING WITH TL APPROVER' ||
                    item.headerStatus === 'PENDING WITH CH APPROVER' ||
                    item.headerStatus === 'PENDING WITH ACCOUNTS APPROVER' ||
                    item.headerStatus === 'PENDING WITH FINANCE APPROVER'
                ));
                break;
                case 'ALL':
               filteredData = this.dashboardData
                break;
            default:
                filteredData = this.dashboardData
                break;
        }

        this.invoiceStatuslistData = filteredData;
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

    onApproval(data: customerStatusListModel) {
        if (data.customerId) {
            this.router.navigate(['customer/accounts/remarks/', data.customerId], { state: { data: data } });
        } else {
            console.error('ID is undefined or null');
        }
    }


    onDeletePI(id: any) {
        const modalRef = this.modalService.open(ConfirmationDialogModalComponent, { size: "sm", centered: true, backdrop: "static" });
        var componentInstance = modalRef.componentInstance as ConfirmationDialogModalComponent;
        componentInstance.message = "Do you really want to delete these records? This process cannot be undone ?";
        modalRef.result.then((canDelete: boolean) => {
            if (canDelete) {
                this.publicVariable.isProcess = true;
                this.IAPI.delete(id).subscribe({
                    next: (res: any) => {
                        this.toastr.success(res.message, 'Success');
                        this.publicVariable.isProcess = false;
                        this.loadPurchaseInvoiceList();

                    },
                    error: (error) => {
                        this.publicVariable.isProcess = false;
                        this.toastr.error(error.error.message, 'Error');
                    }
                });

            }
        }).catch(() => { });

    }

    onEditPI(data: invoiceStatusModule): void {
        if (data.headerId) {
            this.router.navigate(['invoice/status/edit', data.headerId], { state: { data: data } });
        } else {
            console.error('ID is undefined or null');
        }
    }

    onViewPI(data: invoiceStatusModule): void {
        if (data.headerId) {
            this.router.navigate(['invoice/status/view', data.headerId], { state: { data: data } });
        } else {
            console.error('ID is undefined or null');
        }
    }
    onApprovalPI(data: invoiceStatusModule): void {
        if (data.headerId) {
            this.router.navigate(['invoice/approval/view', data.headerId], { state: { data: data } });
        } else {
            console.error('ID is undefined or null');
        }
    }
    onViewAccountPI(data: invoiceStatusModule): void {
        if (data.headerId) {
            this.router.navigate(['invoice/accounts/view', data.headerId], { state: { data: data } });
        } else {
            console.error('ID is undefined or null');
        }
    }

    InvoicedView(data:any):void{

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
            "GST Registration No.": x.gstNumber || '',
            'PAN Card': x.pan || '',
            'GST Customer Type': x.gstType.gstTypeName ? this.toTitleCase(x.gstType.gstTypeName) : '',
            'Created On': x.createdOn ? formatDate(x.createdOn, 'medium', 'en-IN', 'IST') : '',
            'Created By': x.createdBy ? this.toTitleCase(x.createdBy) : '',
            'Last Updated On': x.createdOn ? formatDate(x.modifiedOn, 'medium', 'en-IN', 'IST') : '',
            'Last Update By': x.lastUpdateBy ? this.toTitleCase(x.lastUpdateBy) : '',
            'Status': x.customerStatus ? this.toTitleCase(x.customerStatus) : '',
        }));

        const headers = ['Cust. No.', 'Name', 'Name 2', 'Address', 'Address 2', 'Country', 'State', 'City',
            'Pincode', 'Email', 'Phone Number', 'Contact Person',
            'GST Customer Type', 'GST Registration No.', 'PAN Card',
            'Created On', 'Created By', 'Last Updated On', 'Last Update By', 'Status'];
        this.appService.exportAsExcelFile(exportData, 'Customer Status', headers);
    }


    getStateNameById(stateId: string) {
        const state = this.publicVariable.stateList.find(state => state.stateCode === stateId);
        return state ? state.stateName : null;
    }



    handleLoadingError() {
        this.publicVariable.isProcess = false; // Set status to false on error
    }

    onDownloadPI() {
        const exportData = this.invoiceStatuslistData.map((x) => ({
            "PO No.": x?.impiHeaderProjectCode || '',
            'Project' :x?.impiHeaderProjectName ? this.toTitleCase(x.impiHeaderProjectName) : '',
            Department: x?.impiHeaderProjectDepartmentName ? this.toTitleCase(x.impiHeaderProjectDepartmentName) : '',
            Divison: x?.impiHeaderProjectDivisionName ? this.toTitleCase(x.impiHeaderProjectDivisionName) : '',
            Category: x?.impiHeaderInvoiceType ? this.toTitleCase(x.impiHeaderInvoiceType) : '',
            "PAN No": x?.impiHeaderPanNo || '',
            "State": this.getStateNameById(x?.impiHeaderCustomerState),
            "City": x?.impiHeaderCustomerCity,
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
            'Tl Approver': x?.impiHeaderTlApprover ? this.toTitleCase(x.impiHeaderTlApprover) : '',
            'Cl Approver': x?.impiHeaderClusterApprover ? this.toTitleCase(x.impiHeaderClusterApprover) : '',
            'Finance Approver': x?.impiHeaderFinanceApprover ? this.toTitleCase(x.impiHeaderFinanceApprover) : '',
            'Accounts Approver': x?.accountApprover ? this.toTitleCase(x.accountApprover) : '',

            'Created On': x?.impiHeaderSubmittedDate ? formatDate(x.impiHeaderSubmittedDate, 'medium', 'en-IN', 'IST') : '',
            'Created By': x?.impiHeaderCreatedBy ? this.toTitleCase(x.impiHeaderCreatedBy) : '',
            "Update Date": x?.impiHeaderModifiedDate ? formatDate(x.impiHeaderModifiedDate, 'medium', 'en-IN', 'IST') : '',
            'Status': x?.headerStatus ? this.toTitleCase(x?.headerStatus) : '',
        }));

        const headers = [
            'PO No.','Project', 'Department', 'Divison', 'Category',
            'Vendor Name', 'Address', 'State', 'City', 'Pincode',
            'Phone No', "Email ID", 'Contact Person', 'Customer  GST Number', 'PAN No', 'Amount', 'Payment Terms',
            'impiHeaderRemarks', 'Tl Approver', 'Cl Approver', 'Finance Approver', 'Accounts Approver','Created On', 'Created By', 'Update Date',
            'Status'
        ];
        this.appService.exportAsExcelFile(exportData, 'PI Invoice Status', headers);
    }


    loadInvoiceSummary(){
        this.publicVariable.isProcess = true;
        const subscription = this.IAPI.GetInvoiceSummary().pipe(
            timeout(120000), // Timeout set to 2 minutes (120000 milliseconds)
            finalize(() => {
                this.publicVariable.isProcess = false;
            })
        ).subscribe({
            next: (response: any) => {
                if (response.data && Array.isArray(response.data)) {
                    this.InvoiceSummaryList = response.data;
                    this.PostedTaxInvoiceCount = response.data.length;
                } else {
                    // Handle case where response data is null or not an array
                    this.InvoiceSummaryList = [];
                    this.PostedTaxInvoiceCount = 0;
                    console.warn('Response data is null or not an array:', response.data);
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

    sendEmail(dataItem: any) {
        this.publicVariable.isProcess = true;
        const modalRef = this.modalService.open(EmailComponent, { size: "xl" });
        var componentInstance = modalRef.componentInstance as EmailComponent;
        componentInstance.isEmail = dataItem;
        modalRef.result.then((data: any) => {
            if (data) {
                const newData = data;
                const formData = new FormData();
                formData.append('MailTo', newData.emailTo);
                formData.append('MailSubject', newData.subject);
                formData.append('MailBody', newData.body);
                formData.append('LoginId', this.publicVariable.storedEmail);
                formData.append('MailCC', dataItem.impiHeaderCreatedBy );
                formData.append('ResourceType', dataItem.impiHeaderInvoiceType );
                formData.append('ResourceId', dataItem.headerId );

                newData.attachment.forEach((file: any) => {
                    formData.append('Attachments', file);
                });

                this.publicVariable.isProcess = true;
                this.publicVariable.Subscription.add(
                    this.IAPI.sendEmail(formData).subscribe({
                        next: (res: any) => {
                            if (res.status === true) {
                                this.toastr.success(res.message, 'Success');
                                // this.loadApproveInvoiceList();
                            } else {
                                this.toastr.error(res.message, 'Error');
                            }
                        },
                        error: (error: any) => {
                            this.toastr.error(error.error.message || 'An error occurred. Please try again later.', 'Error');
                        },
                        complete: () => {
                            this.publicVariable.isProcess = false;
                        }
                    })
                );
            }
        }).catch(() => {
            this.publicVariable.isProcess = false;
        });
    }


    onSendEmail(dataItem: any) {
        this.sendEmail(dataItem);
    }


    onediteEmail(dataItem: any) {
        const subscription = this.IAPI.IsLatestEmail(dataItem.headerId).pipe(
            timeout(120000),
            finalize(() => {
                this.publicVariable.isProcess = false;
            })
        ).subscribe({
            next: (response: any) => {
                this.publicVariable.isProcess = true;
                const modalRef = this.modalService.open(UpdateEmailComponent, { size: "xl" });
                var componentInstance = modalRef.componentInstance as UpdateEmailComponent;
                componentInstance.isEmail = response;
                let updateEmail = response.data;
                modalRef.result.then((data: any) => {
                    if (data) {
                        const newData = data;
                        const formData = new FormData();
                        formData.append('MailTo', newData.emailTo);
                        formData.append('MailSubject', newData.subject);
                        formData.append('MailBody', newData.body);
                        formData.append('LoginId', this.publicVariable.storedEmail);
                        formData.append('MailCC', updateEmail.immdMailCc);
                        formData.append('ResourceType', updateEmail.resourceType);
                        formData.append('ResourceId', updateEmail.resourceId);
                        newData.attachment.forEach((file: any) => {
                            formData.append('Attachments', file);
                        });

                        this.publicVariable.isProcess = true;
                        this.publicVariable.Subscription.add(
                            this.IAPI.sendEmail(formData).subscribe({
                                next: (res: any) => {
                                    if (res.status === true) {
                                        this.toastr.success(res.message, 'Success');
                                        // this.loadApproveInvoiceList();
                                    } else {
                                        this.toastr.error(res.message, 'Error');
                                    }
                                },
                                error: (error: any) => {
                                    this.toastr.error(error.error.message || 'An error occurred. Please try again later.', 'Error');
                                },
                                complete: () => {
                                    this.publicVariable.isProcess = false;
                                }
                            })
                        );
                    }
                }).catch(() => {
                    this.publicVariable.isProcess = false;
                });
                this.publicVariable.isProcess = false;
            },
            error: (error: any) => {
                this.publicVariable.isProcess = false;
            }
        });

        this.publicVariable.Subscription.add(subscription);



    }

}
