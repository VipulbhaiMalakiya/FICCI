import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AppService, ConfirmationDialogModalComponent, CustomersService, NgbModal, Router, ToastrService, customerStatusListModel, formatDate, publicVariable } from '../../customers/Export/new-customer';
import { timeout, finalize, catchError, throwError } from 'rxjs';
import { InvoicesService } from '../../invoice/service/invoices.service';
import { InvoiceSummaryModel, invoiceApproveModule, invoiceStatusModule } from '../../invoice/interface/invoice';
import { forkJoin } from 'rxjs';
import { EmailComponent } from '../../invoice/send-email/email/email.component';
import { UpdateEmailComponent } from '../../invoice/update-email/update-email.component';
import { PostedEmailComponent } from '../../invoice/send-email/posted-email/posted-email.component';
import { PIEmailComponent } from '../../invoice/send-email/pi-email/pi-email.component';
import { CreditSalesEmailComponent } from '../../invoice/send-email/credit-sales-email/credit-sales-email.component';
import { FileService } from '../../invoice/service/FileService';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

    publicVariable = new publicVariable();
    customerStatus: string = 'DRAFT';
    headerStatus: string = 'DRAFT';
    InvoiceAttachment: any;
    startDate?: any;
    endDate?: any;
    dateRangeError: boolean = false;
    selectedValue?: any = 'ALL';



    ppitableSize: number = 10;
    ppitableSizes: number[] = [10, 20, 50, 100];
    ppipage: number = 1;

    ptitableSize: number = 10;
    ptitableSizes: number[] = [10, 20, 50, 100];
    ptipage: number = 1;


    pitableSize: number = 10;
    pitableSizes: number[] = [10, 20, 50, 100];
    pipage: number = 1;

    p: number = 1;

    // pitableSize: number = 10;
    // pitableSizes: number[] = [10, 20, 50, 100];
    // pipage: number = 1;

    isDRAFT: number = 0;
    PendingApproval: number = 0;
    ApprovedAccounts: number = 0;
    RejectedbyAccounts: number = 0;
    ALL: number = 0;
    forapproval: number = 0;
    storedRole: string = '';
    PIisDRAFT: number = 0;
    PIPendingApproval: number = 0;
    PIApprovedAccounts: number = 0;
    PIRejectedbyAccounts: number = 0;
    SNCSCOUNT: number = 0;
    SalesCreditNoteSummaryData: any[] = []
    PIALL: number = 0;
    PIforapproval: number = 0;
    PostedTaxInvoiceCount: number = 0;
    PIPostedTaxInvoiceCount: number = 0;
    InvoiceSummaryList: InvoiceSummaryModel[] = [];
    PIInvoiceSummaryList: InvoiceSummaryModel[] = [];
    TaxInvoicePaymentSummaryList: any[] = [];
    invoiceType: any = 'Tax Invoice';
    Cancelled: number = 0;
    Reversal: number = 0;
    storeIsFinance!: boolean;
    dashboardData: any[] = [];
    CreditNotedashboardData: any[] = [];
    invoiceStatuslistData: invoiceStatusModule[] = [];
    creditNoteCount: number = 0;
    PICount: number = 0;
    PIPROCESSEDCOUNT: number = 0;
    PITEXTCOUNT: number = 0;



    constructor(private appService: AppService,
        private modalService: NgbModal,
        private router: Router,
        private toastr: ToastrService,
        private API: CustomersService,
        private IAPI: InvoicesService,
        private cd: ChangeDetectorRef,
        private fileService: FileService,
        private datePipe: DatePipe
    ) {

    }





    ngOnInit(): void {
        // this.loadCustomerStatusCountList();
        this.publicVariable.storedEmail = localStorage.getItem('userEmail') ?? '';
        this.storedRole = localStorage.getItem('userRole') ?? '';
        const isFinanceValue = localStorage.getItem('IsFinance');
        this.loadPurchaseInvoiceList(this.invoiceType);
        this.storeIsFinance = isFinanceValue === 'true'; // Convert string to boolean

        const navDepartment = encodeURIComponent(localStorage.getItem('navDepartment') ?? '');


        if (!navDepartment && this.storedRole != 'Admin') {
            this.toastr.warning("Department Data not updated in User Master", "Warning");
        }
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions to prevent memory leaks
        this.publicVariable.Subscription.unsubscribe();
    }

    get isFinance() {
        return this.storeIsFinance == true;
    }

    calculateIndex(page: number, index: number): number {
        return (page - 1) * this.ppitableSize + index + 1;
    }

    invoiceStatuscalculateIndex(page: number, index: number): number {
        return (page - 1) * this.publicVariable.tableSize + index + 1;
    }

    PostTextInvoicecalculateIndex(page: number, index: number): number {
        return (page - 1) * this.ptitableSize + index + 1;
    }

    InvoicecalculateIndex(page: number, index: number): number {
        return (page - 1) * this.pitableSize + index + 1;
    }



    loadSalesCreditNoteSummary(): void {
        try {
            this.publicVariable.isProcess = true;
            const subscription = this.IAPI.GetSalesCreditNoteSummary().subscribe({
                next: (response: any) => {
                    if (response.data && Array.isArray(response.data)) {
                        this.SalesCreditNoteSummaryData = response.data;
                        this.publicVariable.count = response.data.length;
                        this.creditNoteCount = response.data.length;
                        this.publicVariable.isProcess = false;
                    } else {
                        // Handle case where response data is null or not an array
                        this.SalesCreditNoteSummaryData = [];
                        this.publicVariable.count = 0;
                        this.publicVariable.isProcess = false;

                        console.warn('Response data is null or not an array:', response.data);
                    }
                },
                error: (error) => {
                    console.error('Error loading project list:', error);
                    this.publicVariable.isProcess = false;

                }
            });

            this.publicVariable.Subscription.add(subscription);
        } catch (error) {
            console.error('Error loading project list:', error);
            this.publicVariable.isProcess = false;

        }
    }



    loadCustomerStatusCountList(): void {
        let model: any = {
            'startDate': '',
            'endDate': ''
        }
        this.CustomerDateFilter(model)
    }


    CustomerDateFilter(model: any) {
        const statusSubscription = this.API.getCustomerStatusNew(model).pipe(
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
        // const accountSubscription = this.API.getCustomerStatuaccount().pipe(
        //     timeout(120000),
        //     catchError((error: any) => {
        //         if (error.name === 'TimeoutError') {
        //             this.toastr.error('Operation timed out after 2 minutes', error.name);
        //         } else {
        //             this.toastr.error('Error loading user list', error.name);
        //         }
        //         return throwError(error);
        //     })
        // );

        forkJoin([statusSubscription]).subscribe({
            next: ([statusResponse]: [any]) => {
                // console.log(accountResponse);

                // this.dashboardData = [...statusResponse.data, ...accountResponse.data];
                const combinedData = [...statusResponse.data];


                // Create a map to store unique data by customerId
                const uniqueDataMap = new Map();

                // Iterate through combinedData to group data by customerId
                combinedData.forEach(item => {
                    if (!uniqueDataMap.has(item.customerId)) {
                        uniqueDataMap.set(item.customerId, item);
                    }
                });

                // Convert the map values back to an array
                this.dashboardData = Array.from(uniqueDataMap.values());

                // this.countDataByStatus(this.dashboardData);

                // this.loadCustomerStatusList(this.customerStatus);

                this.countDataByStatus(this.dashboardData);

                if (this.storedRole == 'Admin') {
                    this.loadCustomerStatusList('PENDING WITH APPROVER');

                }
                else {
                    this.loadCustomerStatusList('DRAFT');
                }
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
        const draftData = data.filter(item => (item.customerStatus === 'DRAFT') && (item.department === localStorage.getItem('department')));
        counts['DRAFT'] = draftData.length;

        const foraprovalData = data.filter((item: any) =>
            (item.customerStatus === 'PENDING WITH ACCOUNTS APPROVER' || item.customerStatus === 'PENDING WITH FINANCE APPROVER')
            && (item.department === localStorage.getItem('department'))
        );
        counts['FOR APPROVAL'] = foraprovalData.length;

        let pendingData: any[] = [];

        if (this.storedRole == 'Admin') {
            pendingData = data.filter((item: any) =>

                item.customerStatus === 'PENDING WITH TL APPROVER' ||
                item.customerStatus === 'PENDING WITH CH APPROVER' ||
                item.customerStatus === 'PENDING WITH ACCOUNTS APPROVER' ||
                item.customerStatus === 'PENDING WITH FINANCE APPROVER');
        } else {
            pendingData = data.filter((item: any) =>
                (item.createdBy === this.publicVariable.storedEmail ||
                    item.department === localStorage.getItem('department')) &&
                (item.customerStatus === 'PENDING WITH TL APPROVER' ||
                    item.customerStatus === 'PENDING WITH CH APPROVER' ||
                    item.customerStatus === 'PENDING WITH ACCOUNTS APPROVER' ||
                    item.customerStatus === 'PENDING WITH FINANCE APPROVER'));
        }

        counts['PENDING WITH TL APPROVER'] = pendingData.length;


        const approvedData = data.filter(item => (item.customerStatus === 'APPROVED BY ACCOUNTS APPROVER'
            || item.customerStatus === 'APPROVED BY FINANCE')

            // && item.department === localStorage.getItem('department')
        );
        counts['APPROVED BY ACCOUNTS APPROVER'] = approvedData.length;

        const rejectedData = data.filter(item => (item.customerStatus === 'REJECTED BY TL APPROVER'
            || item.customerStatus === 'REJECTED BY CH APPROVER'
            || item.customerStatus === 'REJECTED BY ACCOUNTS APPROVER'
            || item.customerStatus === 'REJECTED BY FINANCE APPROVER')
            //&& item.department === localStorage.getItem('department')
        );
        counts['REJECTED BY CH APPROVER'] = rejectedData.length;




        // Calculate total count

        let allData = [];

        if (this.storedRole == "Admin") {
            allData = data.filter(item =>
                item.customerStatus != 'DRAFT');
        }
        else {
            allData = data;
        }

        counts['ALL'] = allData.length;

        // Calculate total count
        // const allData = data;
        // counts['ALL'] = allData.length;

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
                    (item.department === localStorage.getItem('department') ||
                        item.createdBy === this.publicVariable.storedEmail) &&
                    item.customerStatus === 'DRAFT');
                break;
            case 'PENDING WITH APPROVER':


                if (this.storedRole == 'Admin') {
                    filteredData = this.dashboardData.filter((item: any) =>
                        item.customerStatus === 'PENDING WITH TL APPROVER' ||
                        item.customerStatus === 'PENDING WITH CH APPROVER' ||
                        item.customerStatus === 'PENDING WITH ACCOUNTS APPROVER' ||
                        item.customerStatus === 'PENDING WITH FINANCE APPROVER');
                } else {
                    filteredData = this.dashboardData.filter((item: any) =>
                        (
                            //item.createdBy === this.publicVariable.storedEmail ||

                            item.department === localStorage.getItem('department')) &&
                        (item.customerStatus === 'PENDING WITH TL APPROVER' ||
                            item.customerStatus === 'PENDING WITH CH APPROVER' ||
                            item.customerStatus === 'PENDING WITH ACCOUNTS APPROVER' ||
                            item.customerStatus === 'PENDING WITH FINANCE APPROVER'));
                }


                break;


            case 'APPROVED BY ACCOUNTS APPROVER':
                filteredData = this.dashboardData.filter((item: any) =>
                    // item.department === localStorage.getItem('department') ||
                    // item.createdBy === this.publicVariable.storedEmail &&
                    item.customerStatus === this.customerStatus || item.customerStatus === 'APPROVED BY FINANCE');

                break;
            case 'REJECTED BY CH APPROVER':
                filteredData = this.dashboardData.filter((item: any) =>
                // item.department === localStorage.getItem('department') ||
                //  item.createdBy === this.publicVariable.storedEmail &&
                (item.customerStatus === 'REJECTED BY TL APPROVER' ||
                    item.customerStatus === 'REJECTED BY CH APPROVER' ||
                    item.customerStatus === 'REJECTED BY ACCOUNTS APPROVER' ||
                    item.customerStatus === 'REJECTED BY FINANCE APPROVER'
                    || item.customerStatus === 'REJECTED BY FINANCE APPROVER'));
                break;
            case 'FOR APPROVAL':
                filteredData = this.dashboardData.filter((item: any) => (item.customerStatus === 'PENDING WITH ACCOUNTS APPROVER' || item.customerStatus === 'PENDING WITH FINANCE APPROVER'));
                break;

            case 'ALL':

                filteredData = this.dashboardData

                break;

            default:
                filteredData = this.dashboardData
                break;
        }

        this.publicVariable.customerStatusList = filteredData;
        this.publicVariable.count = filteredData.length;

    }



    // Method to filter data
    getFilteredList(items: any[], searchText: string): any[] {
        if (!items || !searchText) {
            return items;
        }
        searchText = searchText.toLowerCase();
        return items.filter(item => {
            return (item.customerName && item.customerName.toLowerCase().includes(searchText)) ||
                (item.cityList && item.cityList.cityName && item.cityList.cityName.toLowerCase().includes(searchText)) ||
                (item.address && item.address.toLowerCase().includes(searchText)) ||
                (item.phoneNumber && item.phoneNumber.toLowerCase().includes(searchText)) ||
                (item.gstNumber && item.gstNumber.toLowerCase().includes(searchText)) ||
                (item.pan && item.pan.toLowerCase().includes(searchText)) ||
                (item.createdOn && item.createdOn.toString().toLowerCase().includes(searchText)) ||
                (item.createdBy && item.createdBy.toLowerCase().includes(searchText)) ||
                (item.customerStatus && item.customerStatus.toLowerCase().includes(searchText)) ||
                (item.customerCode && item.customerCode.toLowerCase().includes(searchText)) ||
                (item.recordID && item.recordID.toLowerCase().includes(searchText));
        });
    }

    // Computed filtered list
    get filteredList() {
        return this.getFilteredList(this.publicVariable.customerStatusList, this.publicVariable.searchText);
    }
    model: any = {
        'startDate': '',
        'endDate': ''
    }
    loadPurchaseInvoiceList(invoiceType: any): void {
        try {
            this.invoiceType = invoiceType;
            this.invoiceDateFilter(this.model)

        } catch (error) {
            console.error('Error loading invoice lists:', error);
            this.publicVariable.isProcess = false;
        }
    }


    invoiceDateFilter(model: any) {
        this.cd.detectChanges();

        this.dashboardData = [];



        // Observable for the first API call
        const purchaseInvoiceObservable = this.IAPI.getPurchaseInvoice_New(model).pipe(
            catchError((error: any) => {
                console.error('Error loading purchase invoice list:', error);
                return throwError(error);
            })
        );


        // Observable for the second API call
        const approveInvoiceObservable = this.IAPI.getApproveInvoice(model).pipe(
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



                }

                //debugger;
                if (approveResponse.data && Array.isArray(approveResponse.data))

                    approveResponse.data.forEach((element: any) => {
                        if (this.dashboardData.filter(x => x.headerId == element.headerId).length <= 0) {

                            this.dashboardData.push(element);
                        }
                    });

                // //debugger;
                if (accountResponse.data && Array.isArray(accountResponse.data))
                    accountResponse.data.forEach((element: any) => {
                        if (this.dashboardData.filter(x => x.headerRecordID == element.headerRecordID) == undefined) {
                            this.dashboardData.push(element);
                        }
                    });
                //  this.invoiceStatuslistData =this.dashboardData;
                // //debugger;
                // console.log(this.dashboardData);
                // this.invoiceStatuslistData = this.dashboardData.filter(x => (x.headerStatus === 'PENDING WITH TL APPROVER' ||
                // x.headerStatus === 'PENDING WITH CH APPROVER' ||
                // x.headerStatus === 'PENDING WITH ACCOUNTS APPROVER' ||
                // x.headerStatus === 'PENDING WITH FINANCE APPROVER' ||
                // x.headerStatus === 'DRAFT' || x.headerStatus === 'CANCEL BY EMPLOYEE') && x.impiHeaderInvoiceType == this.invoiceType);



                // Concatenate approveResponse.data with dashboardData if it's iterable
                // if (approveResponse.data && Array.isArray(approveResponse.data)) {
                //     this.dashboardData = [...this.dashboardData, ...approveResponse.data];
                // } else {
                //     console.warn('Approve response data is null or not iterable');
                // }

                // Concatenate accountResponse.data with dashboardData if it's iterable
                // if (accountResponse.data && Array.isArray(accountResponse.data)) {
                //     this.dashboardData = [...this.dashboardData, ...accountResponse.data];
                // } else {
                //     console.warn('Account response data is null or not iterable');
                // }






                // Processing the merged data

                this.publicVariable.isProcess = false;

                // if (this.invoiceType == 'Tax Invoice') {
                //     this.loadInvoiceSummary();
                // }

                // else if (this.invoiceType == 'Proforma Invoice') {
                //     this.PIloadInvoiceSummary();
                // }

                // Set default status to "DRAFT" if the invoice type changes
                // console.log("without filter" ,this.dashboardData);
                this.dashboardData = this.dashboardData.filter(x => x.impiHeaderInvoiceType == this.invoiceType);

                console.log("with filter", this.dashboardData);
                if (!this.isfilterDefaultStatus) {
                    if ((this.invoiceType === 'Tax Invoice' || this.invoiceType === 'Proforma Invoice') && this.storedRole === 'Approver') {
                        this.headerStatus = 'FOR APPROVAL';
                        //  this.invoiceType = 'Tax Invoice';
                        this.loadInoivceStatusList('FOR APPROVAL');
                    }

                    // else if ((this.invoiceType === 'Tax Invoice' || this.invoiceType === 'Proforma Invoice')) {
                    //     this.headerStatus = 'APPROVED BY ACCOUNTS APPROVER';
                    //   //  this.invoiceType = 'Tax Invoice';
                    //     this.loadInoivceStatusList('APPROVED BY ACCOUNTS APPROVER');
                    // }

                    else if ((this.invoiceType === 'Tax Invoice' || this.invoiceType === 'Proforma Invoice') && this.storedRole === 'Admin') {
                        this.headerStatus = 'DRAFT';
                    }

                    else {
                        this.headerStatus = 'DRAFT';
                        //this.invoiceType = 'Tax Invoice';
                        this.loadInoivceStatusList('DRAFT');
                        this.cd.detectChanges();
                    }
                }

                this.countDataByInvoies(this.dashboardData, this.invoiceType);
                this.loadInoivceStatusList(this.customerStatus);

                //this.loadInvoiceSummary();
                //this.PIloadInvoiceSummary();
            },
            error: (error: any) => {
                this.toastr.error('Error loading invoice lists', error.name);
                this.publicVariable.isProcess = false;
            }
        });
    }


    countDataByInvoies(data: any[], invoiceType: any): void {

        console.log(invoiceType, data);
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
            'Cancelled': 0,
            'Reversal': 0,
            'ALL': 0,
            'TAX INVOICE POSTED': 0,
            'PI PROCESSED': 0,
            'PI TEXT': 0
        };

        this.invoiceType = invoiceType;

        // Filter data for each customer status
        const draftData = data.filter(item => item.headerStatus === 'DRAFT' && item.impiHeaderInvoiceType == invoiceType);
        counts['DRAFT'] = draftData.length;


        const pendingData = data.filter(item =>
            (
                //item.impiHeaderCreatedBy === this.publicVariable.storedEmail &&
                item.impiHeaderInvoiceType == invoiceType) &&
            (item.headerStatus === 'PENDING WITH TL APPROVER' ||
                item.headerStatus === 'PENDING WITH CH APPROVER' ||
                item.headerStatus === 'PENDING WITH ACCOUNTS APPROVER' ||
                item.headerStatus === 'PENDING WITH FINANCE APPROVER'
                || item.headerStatus === 'CANCEL BY EMPLOYEE'
                || item.headerStatus === 'PENDING CANCELLATION REQUEST'
            ));

        counts['PENDING WITH TL APPROVER'] = pendingData.length;


        const forapproval = data.filter(item => item.impiHeaderInvoiceType == invoiceType &&
            (item.headerStatus === 'PENDING WITH TL APPROVER'
                || item.headerStatus === 'PENDING WITH CH APPROVER'
                || item.headerStatus === 'PENDING WITH ACCOUNTS APPROVER'
                || item.headerStatus === 'PENDING WITH FINANCE APPROVER'
                || item.headerStatus === 'CANCEL BY EMPLOYEE'
                || item.headerStatus === 'PENDING CANCELLATION REQUEST'

            ));
        counts['FOR APPROVAL'] = forapproval.length;

        if (this.publicVariable.storedRole == 'Approver' || this.publicVariable.storedRole == 'Admin') {
            const approvedData = data.filter(item => (item.impiHeaderInvoiceType == invoiceType) && (
                // item.headerStatus === 'APPROVED BY ACCOUNTS APPROVER'
                // || item.headerStatus === 'MAIL SENT BY FINANCE TO CUSTOMER'
                item.headerStatus === 'APPROVED BY TL'
                || item.headerStatus == 'TI PENDING WITH ACCOUNTS'
                // || item.headerStatus === 'MAIL SENT BY ACCOUNT TO CUSTOMER'
                // || item.headerStatus === 'APPROVED BY FINANCE'
            ));
            counts['PENDING WITH FINANCE APPROVER'] = approvedData.length;
        }
        else {
            const approvedData = data.filter(item => item.impiHeaderInvoiceType == invoiceType && (
                // item.headerStatus === 'APPROVED BY ACCOUNTS APPROVER'
                // || item.headerStatus === 'MAIL SENT BY FINANCE TO CUSTOMER'
                item.headerStatus === 'APPROVED BY TL'
                || item.headerStatus === 'TI PENDING WITH ACCOUNTS'
                // || item.headerStatus === 'APPROVED BY FINANCE'
            ));
            counts['PENDING WITH FINANCE APPROVER'] = approvedData.length;
        }

        if (this.publicVariable.storedRole == 'Approver' || this.publicVariable.storedRole == 'Admin') {
            const piprocessed = data.filter(item => (item.impiHeaderInvoiceType == invoiceType) && (
                item.headerStatus === 'APPROVED BY ACCOUNTS APPROVER'
                || item.headerStatus === 'MAIL SENT BY FINANCE TO CUSTOMER'
                || item.headerStatus === 'MAIL SENT BY ACCOUNT TO CUSTOMER'
                || item.headerStatus === 'APPROVED BY FINANCE'
            ));
            counts['PI PROCESSED'] = piprocessed.length;
        }
        else {
            const piprocessed = data.filter(item => item.impiHeaderInvoiceType == invoiceType && (
                item.headerStatus === 'APPROVED BY ACCOUNTS APPROVER'
                || item.headerStatus === 'MAIL SENT BY FINANCE TO CUSTOMER'
                || item.headerStatus === 'MAIL SENT BY ACCOUNT TO CUSTOMER'
                || item.headerStatus === 'APPROVED BY FINANCE'
            ));
            counts['PI PROCESSED'] = piprocessed.length;
        }


        if (this.publicVariable.storedRole == 'Approver' || this.publicVariable.storedRole == 'Admin') {
            const pitext = data.filter(item => (item.impiHeaderInvoiceType == invoiceType) && (
                item.headerStatus === 'APPROVED BY ACCOUNTS APPROVER'
                || item.headerStatus === 'MAIL SENT BY FINANCE TO CUSTOMER'
                || item.headerStatus === 'MAIL SENT BY ACCOUNT TO CUSTOMER'
                || item.headerStatus === 'APPROVED BY FINANCE'
                || item.headerStatus == 'TAX INVOICE POSTED'
                || item.headerStatus == 'POSTED TAX INVOICE'
            ));
            counts['PI TEXT'] = pitext.length;
        }
        else {
            const pitext = data.filter(item => item.impiHeaderInvoiceType == invoiceType && (
                item.headerStatus == 'APPROVED BY ACCOUNTS APPROVER'
                || item.headerStatus == 'MAIL SENT BY FINANCE TO CUSTOMER'
                || item.headerStatus == 'MAIL SENT BY ACCOUNT TO CUSTOMER'
                || item.headerStatus == 'APPROVED BY FINANCE'
                || item.headerStatus == 'TAX INVOICE POSTED'
                || item.headerStatus == 'POSTED TAX INVOICE'
            ));
            counts['PI TEXT'] = pitext.length;
        }




        const rejectedData = data.filter(item => item.impiHeaderInvoiceType == invoiceType && (item.headerStatus === 'REJECTED BY TL APPROVER'
            || item.headerStatus === 'REJECTED BY CH APPROVER'
            || item.headerStatus === 'REJECTED BY ACCOUNTS APPROVER'
            || item.headerStatus === 'REJECTED BY FINANCE APPROVER'
            || item.headerStatus === 'CANCELLATION REJECTED BY TL'

            || item.headerStatus === 'CANCELLATION REJECTED BY FINANCE'

        ));
        counts['REJECTED BY CH APPROVER'] = rejectedData.length;

        const cancelData = data.filter(item =>
            item.impiHeaderInvoiceType == this.invoiceType &&
            (
                item.headerStatus == 'CANCELLATION APPROVED BY FINANCE' || item.headerStatus == 'CANCELLATION APPROVED BY TL'));
        counts['Cancelled'] = cancelData.length;

        const ReversalData = data.filter(item =>
            item.headerStatus === '');
        counts['Reversal'] = ReversalData.length

        // Cancelled


        // Calculate total count

        let allData = [];

        if (this.storedRole == "Approver") {
            allData = data.filter(item =>
                // item.impiHeaderInvoiceType == invoiceType && item.headerStatus != 'DRAFT');

                item.impiHeaderInvoiceType == invoiceType);
        }
        else if (this.storedRole == "Admin") {
            allData = data.filter(item =>

                (item.impiHeaderInvoiceType == invoiceType && item.headerStatus != 'PENDING WITH TL APPROVER'));
            // (item.impiHeaderInvoiceType == invoiceType && item.headerStatus != 'DRAFT' && item.headerStatus != 'PENDING WITH TL APPROVER'));
        }
        else {
            allData = data.filter(item =>
                item.impiHeaderInvoiceType == invoiceType);
        }

        counts['ALL'] = allData.length;

        // Update counts
        this.PIisDRAFT = counts['DRAFT'];
        this.PIforapproval = counts['FOR APPROVAL'];
        this.PIPendingApproval = counts['PENDING WITH TL APPROVER'];
        this.PIApprovedAccounts = counts['PENDING WITH FINANCE APPROVER'];
        this.PIRejectedbyAccounts = counts['REJECTED BY CH APPROVER'];
        this.PIALL = counts['ALL'];
        this.Cancelled = counts['Cancelled'];
        this.Reversal = counts['Reversal'];
        this.publicVariable.count = counts['ALL']; // Total count
        this.PIPROCESSEDCOUNT = counts['PI PROCESSED'];
        this.PITEXTCOUNT = counts['PI TEXT'];
    }
    loadInoivceStatusList(status: string): void {
        this.customerStatus = status;
        this.headerStatus = status;
        let filteredData;
        switch (this.customerStatus) {
            case 'DRAFT':
                filteredData = this.dashboardData.filter((item: any) =>
                    // item.createdBy === this.publicVariable.storedEmail &&
                    item.headerStatus === 'DRAFT' && item.impiHeaderInvoiceType == this.invoiceType);
                break;
            case 'PENDING WITH APPROVER':
                filteredData = this.dashboardData.filter((item: any) =>
                    // item.impiHeaderCreatedBy === this.publicVariable.storedEmail &&
                    item.impiHeaderInvoiceType == this.invoiceType &&
                    (item.headerStatus === 'PENDING WITH TL APPROVER' ||
                        item.headerStatus === 'PENDING WITH CH APPROVER' ||
                        item.headerStatus === 'PENDING WITH ACCOUNTS APPROVER' ||
                        item.headerStatus === 'PENDING WITH FINANCE APPROVER'
                        || item.headerStatus === 'CANCEL BY EMPLOYEE'
                        //|| item.headerStatus == 'TI PENDING WITH ACCOUNTS'
                        || item.headerStatus === 'PENDING CANCELLATION REQUEST'
                    ));
                break;
            case 'APPROVED BY ACCOUNTS APPROVER':
                if (this.publicVariable.storedRole == 'Approver' || this.publicVariable.storedRole == 'Admin') {
                    filteredData = this.dashboardData.filter((item: any) =>
                        (item.impiHeaderInvoiceType == this.invoiceType) && (
                            // item.headerStatus === 'APPROVED BY ACCOUNTS APPROVER'
                            // || item.headerStatus === 'MAIL SENT BY ACCOUNT TO CUSTOMER'
                            // || item.headerStatus === 'APPROVED BY FINANCE'
                            item.headerStatus === 'APPROVED BY TL'
                            || item.headerStatus === 'TI PENDING WITH ACCOUNTS'
                            // || item.headerStatus === 'TAX INVOICE POSTED'
                            // || item.headerStatus === 'MAIL SENT BY FINANCE TO CUSTOMER'
                        ));
                }
                else {
                    filteredData = this.dashboardData.filter((item: any) =>
                        (item.impiHeaderInvoiceType == this.invoiceType) && (
                            // item.headerStatus === 'APPROVED BY ACCOUNTS APPROVER'
                            // || item.headerStatus === 'MAIL SENT BY ACCOUNT TO CUSTOMER'
                            // || item.headerStatus === 'APPROVED BY FINANCE'
                            item.headerStatus == 'APPROVED BY TL'
                            || item.headerStatus == 'TI PENDING WITH ACCOUNTS'
                            // || item.headerStatus === 'TAX INVOICE POSTED'
                            // || item.headerStatus === 'MAIL SENT BY FINANCE TO CUSTOMER'
                        )
                    );
                }

                break;
            case 'PI Processed':
                if (this.publicVariable.storedRole == 'Approver' || this.publicVariable.storedRole == 'Admin') {
                    filteredData = this.dashboardData.filter((item: any) =>
                        (item.impiHeaderInvoiceType == this.invoiceType) && (
                            item.headerStatus === 'APPROVED BY ACCOUNTS APPROVER'
                            || item.headerStatus === 'MAIL SENT BY ACCOUNT TO CUSTOMER'
                            || item.headerStatus === 'APPROVED BY FINANCE'
                            //|| item.headerStatus === 'TAX INVOICE POSTED'
                            || item.headerStatus === 'MAIL SENT BY FINANCE TO CUSTOMER'
                        ));
                }
                else {
                    filteredData = this.dashboardData.filter((item: any) =>
                        (item.impiHeaderInvoiceType == this.invoiceType) && (
                            item.headerStatus === 'APPROVED BY ACCOUNTS APPROVER'
                            || item.headerStatus === 'MAIL SENT BY ACCOUNT TO CUSTOMER'
                            || item.headerStatus === 'APPROVED BY FINANCE'
                            // || item.headerStatus === 'TAX INVOICE POSTED'
                            || item.headerStatus === 'MAIL SENT BY FINANCE TO CUSTOMER'
                        )
                    );
                }

                break;
            case 'Posted Tax Invoice new':
                if (this.publicVariable.storedRole == 'Approver' || this.publicVariable.storedRole == 'Admin') {
                    filteredData = this.dashboardData.filter((item: any) =>
                        (item.impiHeaderInvoiceType == this.invoiceType) && (
                            item.headerStatus === 'APPROVED BY ACCOUNTS APPROVER'
                            || item.headerStatus === 'MAIL SENT BY ACCOUNT TO CUSTOMER'
                            || item.headerStatus === 'APPROVED BY FINANCE'
                            || item.headerStatus === 'TAX INVOICE POSTED'
                            || item.headerStatus === 'MAIL SENT BY FINANCE TO CUSTOMER'

                            || item.headerStatus == 'POSTED TAX INVOICE'
                        ));
                }
                else {
                    filteredData = this.dashboardData.filter((item: any) =>
                        (item.impiHeaderInvoiceType == this.invoiceType) && (
                            item.headerStatus === 'APPROVED BY ACCOUNTS APPROVER'
                            || item.headerStatus === 'MAIL SENT BY ACCOUNT TO CUSTOMER'
                            || item.headerStatus === 'APPROVED BY FINANCE'
                            || item.headerStatus === 'TAX INVOICE POSTED'
                            || item.headerStatus === 'MAIL SENT BY FINANCE TO CUSTOMER'
                            || item.headerStatus == 'POSTED TAX INVOICE'
                        )
                    );
                }

                break;
            case 'REJECTED BY CH APPROVER':
                filteredData = this.dashboardData.filter((item: any) =>
                    // item.createdBy === this.publicVariable.storedEmail &&
                    item.impiHeaderInvoiceType == this.invoiceType &&
                    (item.headerStatus === 'REJECTED BY TL APPROVER' ||
                        item.headerStatus === 'REJECTED BY CH APPROVER' ||
                        item.headerStatus === 'REJECTED BY ACCOUNTS APPROVER' ||
                        item.headerStatus === 'REJECTED BY FINANCE APPROVER'
                        || item.headerStatus === 'CANCELLATION REJECTED BY TL'
                        || item.headerStatus === 'CANCELLATION REJECTED BY FINANCE'

                    ));
                break;
            case 'Cancelled':
                filteredData = this.dashboardData.filter((item: any) =>
                    // item.createdBy === this.publicVariable.storedEmail &&
                    item.impiHeaderInvoiceType == this.invoiceType &&
                    (
                        item.headerStatus === 'CANCELLATION APPROVED BY FINANCE'
                        || item.headerStatus == 'CANCELLATION APPROVED BY TL'));
                break;
            case 'Reversal':
                filteredData = this.dashboardData.filter((item: any) =>
                // item.createdBy === this.publicVariable.storedEmail &&
                (
                    item.headerStatus === ''));
                break;
            case 'FOR APPROVAL':
                filteredData = this.dashboardData.filter((item: any) =>
                    item.impiHeaderInvoiceType == this.invoiceType && (
                        item.headerStatus === 'PENDING WITH TL APPROVER' ||
                        item.headerStatus === 'PENDING WITH CH APPROVER' ||
                        item.headerStatus === 'PENDING WITH ACCOUNTS APPROVER' ||
                        item.headerStatus === 'PENDING WITH FINANCE APPROVER' ||
                        item.headerStatus === 'CANCEL BY EMPLOYEE' ||
                        item.headerStatus === 'PENDING CANCELLATION REQUEST'
                        // || item.headerStatus == 'TI PENDING WITH ACCOUNTS'


                    ));
                break;
            case 'ALL':



                // if (this.storedRole == "Approver") {
                //     filteredData = this.dashboardData.filter((item: any) =>
                //         item.impiHeaderInvoiceType == this.invoiceType && item.headerStatus != 'DRAFT');
                // }
                // else if (this.storedRole == "Admin") {
                //     filteredData = this.dashboardData.filter(item =>
                //         (item.impiHeaderInvoiceType == this.invoiceType && item.headerStatus != 'DRAFT' && item.headerStatus != 'PENDING WITH TL APPROVER'));
                // }

                // else {
                filteredData = this.dashboardData.filter((item: any) =>
                    item.impiHeaderInvoiceType == this.invoiceType);
                // }
                break;
            default:
                filteredData = this.dashboardData.filter((item: any) =>
                    item.impiHeaderInvoiceType == this.invoiceType);
                break;
        }

        this.invoiceStatuslistData = filteredData;
        this.publicVariable.count = filteredData.length;
        // this.PICount = filteredData.length;

    }




    onCreditSendEmail(dataItem: any) {
        this.sendEmailCredit(dataItem);
    }

    sendEmailCredit(dataItem: any) {
        this.publicVariable.isProcess = true;

        const modalRef = this.modalService.open(CreditSalesEmailComponent, { size: "xl" });
        var componentInstance = modalRef.componentInstance as CreditSalesEmailComponent;
        componentInstance.isEmail = dataItem;
        modalRef.result.then((data: any) => {
            if (data) {

                const newData = data;
                const formData = new FormData();
                formData.append('MailTo', newData.emailTo);
                formData.append('MailSubject', newData.subject);
                formData.append('MailBody', newData.body);
                formData.append('LoginId', this.publicVariable.storedEmail);
                formData.append('MailCC', newData.MailCC);
                formData.append('ResourceType', 'Invoice');
                formData.append('ResourceId', '1');

                newData.attachment.forEach((file: any) => {
                    if (file instanceof File) {
                        formData.append('Attachments', file);
                    } else {

                        const base64Data = file.attachment; // Your base64 encoded attachment data
                        const decodedData = atob(base64Data); // Decode base64 data

                        // Convert the decoded data to Uint8Array
                        const bytes = new Uint8Array(decodedData.length);
                        for (let i = 0; i < decodedData.length; i++) {
                            bytes[i] = decodedData.charCodeAt(i);
                        }

                        // Create a Blob from the Uint8Array
                        const blob = new Blob([bytes.buffer], { type: 'application/pdf' });

                        // Create a File object with a unique name
                        file = new File([blob], `${file.name}.${file.type}`, { type: 'application/pdf' });

                        formData.append('Attachments', file);
                    }
                });



                this.publicVariable.isProcess = true;

                this.publicVariable.Subscription.add(
                    this.IAPI.sendEmail(formData).subscribe({
                        next: (res: any) => {
                            if (res.status === true) {
                                this.toastr.success(res.message, 'Success');
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

    onCreditNoteView(data: any): void {
        if (data.no) {
            this.router.navigate(['invoice/sales-navision/view', data.no], { state: { data: data } });
        } else {
            console.error('ID is undefined or null');
        }
    }


    //CreditNote


    loadSalesCreditNote(): void {
        try {
            this.SLFilterBYDate(this.model);
        } catch (error) {
            console.error('Error loading invoice lists:', error);
            this.publicVariable.isProcess = false;
        }
    }


    SLFilterBYDate(model: any) {
        const purchaseInvoiceObservable = this.IAPI.getSalesCreditMemo(model).pipe(
            catchError((error: any) => {
                console.error('Error loading purchase invoice list:', error);
                return throwError(error);
            })
        );

        // Observable for the second API call
        const approveInvoiceObservable = this.IAPI.getApproveSalesInvoice(model).pipe(
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
        forkJoin([purchaseInvoiceObservable, approveInvoiceObservable]).subscribe({
            next: ([purchaseResponse, approveResponse]: [any, any]) => {
                // Check if data is not null and iterable for purchaseResponse
                if (purchaseResponse.data && Array.isArray(purchaseResponse.data)) {
                    this.CreditNotedashboardData = purchaseResponse.data;
                } else {
                    console.warn('Purchase response data is null or not iterable');
                    this.CreditNotedashboardData = [];
                }

                // Concatenate approveResponse.data with dashboardData if it's iterable

                if (approveResponse.data && Array.isArray(approveResponse.data)) {
                    this.CreditNotedashboardData = [...this.CreditNotedashboardData, ...approveResponse.data];

                } else {
                    console.warn('Approve response data is null or not iterable');
                }


                this.headerStatus = this.customerStatus;



                this.publicVariable.isProcess = false;

                this.countDataBySalesInvoies(this.CreditNotedashboardData);
                this.loadInoivceSalesStatusList(this.customerStatus);

                this.loadSalesCreditNoteSummary();

            },
            error: (error: any) => {
                //      this.toastr.error('Error loading invoice lists', error.name);
                this.publicVariable.isProcess = false;
            }
        });
    }


    countDataBySalesInvoies(data: any[]): void {

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
            'Cancelled': 0,
            'Reversal': 0,
            'ALL': 0,
            'CREDIT MEMO POSTED': 0,
            'Posted Credit Note': 0
        };

        // Filter data for each customer status
        const draftData = data.filter(item => item.headerStatus === 'DRAFT');
        counts['DRAFT'] = draftData.length;


        const pendingData = data.filter(item =>
            item.impiHeaderCreatedBy === this.publicVariable.storedEmail &&
            (item.headerStatus === 'PENDING WITH TL APPROVER' ||

                item.headerStatus === 'PENDING WITH ACCOUNTS APPROVER' ||
                item.headerStatus === 'PENDING WITH FINANCE APPROVER' ||
                item.headerStatus == 'PENDING CANCELLATION REQUEST' ||
                item.headerStatus === 'CANCEL BY EMPLOYEE'));
        counts['PENDING WITH TL APPROVER'] = pendingData.length;



        console.log(pendingData.length)

        const forapproval = data.filter(item => (item.headerStatus == 'PENDING WITH TL APPROVER'
            || item.headerStatus == 'PENDING WITH CH APPROVER'
            || item.headerStatus == 'PENDING WITH ACCOUNTS APPROVER'
            || item.headerStatus == 'PENDING WITH FINANCE APPROVER'
            || item.headerStatus === 'CANCEL BY EMPLOYEE'
        ));
        counts['FOR APPROVAL'] = forapproval.length;

        const approvedData = data.filter(item => (
            // item.headerStatus === 'APPROVED BY ACCOUNTS APPROVER'
            // || item.headerStatus === 'MAIL SENT BY FINANCE TO CUSTOMER'
            item.headerStatus === 'PENDING WITH CH APPROVER' ||
            item.headerStatus === 'APPROVED BY TL'
            // || item.headerStatus === 'MAIL SENT BY ACCOUNT TO CUSTOMER'
            // || item.headerStatus === 'APPROVED BY FINANCE'

        ));
        counts['PENDING WITH FINANCE APPROVER'] = approvedData.length;


        const PostedCreditNote = data.filter(item => (
            item.headerStatus === 'APPROVED BY ACCOUNTS APPROVER'
            || item.headerStatus === 'MAIL SENT BY FINANCE TO CUSTOMER'
            || item.headerStatus === 'MAIL SENT BY ACCOUNT TO CUSTOMER'
            || item.headerStatus === 'APPROVED BY FINANCE'
            || item.headerStatus == 'CREDIT MEMO POSTED'

        ));
        counts['Posted Credit Note'] = PostedCreditNote.length;

        const rejectedData = data.filter(item => (item.headerStatus === 'REJECTED BY TL APPROVER'
            || item.headerStatus === 'REJECTED BY CH APPROVER'
            || item.headerStatus === 'REJECTED BY ACCOUNTS APPROVER'
            || item.headerStatus === 'REJECTED BY FINANCE APPROVER'
            || item.headerStatus === 'CANCELLATION REJECTED BY TL'

            || item.headerStatus === 'CANCELLATION REJECTED BY FINANCE'

        ));
        counts['REJECTED BY CH APPROVER'] = rejectedData.length;

        const cancelData = data.filter(item =>
            item.headerStatus === 'CANCELLATION APPROVED BY FINANCE' || item.headerStatus == 'CANCELLATION APPROVED BY TL');
        counts['Cancelled'] = cancelData.length;

        const ReversalData = data.filter(item =>
            item.headerStatus === '');
        counts['Reversal'] = ReversalData.length

        // Cancelled


        // Calculate total count

        const allData = data;
        counts['ALL'] = allData.length;

        console.log('all data', allData);


        // Update counts
        this.PIisDRAFT = counts['DRAFT'];
        this.PIforapproval = counts['FOR APPROVAL'];
        this.PIPendingApproval = counts['PENDING WITH TL APPROVER'];
        this.PIApprovedAccounts = counts['PENDING WITH FINANCE APPROVER'];
        this.PIRejectedbyAccounts = counts['REJECTED BY CH APPROVER'];
        this.PIALL = counts['ALL'];
        this.Cancelled = counts['Cancelled'];
        this.Reversal = counts['Reversal'];
        this.SNCSCOUNT = counts['Posted Credit Note'];
        this.publicVariable.count = counts['ALL']; // Total count
    }

    loadInoivceSalesStatusList(status: string): void {
        this.customerStatus = status;
        let filteredData;
        switch (this.customerStatus) {
            case 'DRAFT':
                filteredData = this.CreditNotedashboardData.filter((item: any) =>
                    // item.createdBy === this.publicVariable.storedEmail &&
                    item.headerStatus === 'DRAFT');
                break;
            case 'PENDING WITH APPROVER':
                filteredData = this.CreditNotedashboardData.filter((item: any) =>
                    item.impiHeaderCreatedBy === this.publicVariable.storedEmail &&

                    (item.headerStatus === 'PENDING WITH TL APPROVER' ||

                        item.headerStatus === 'PENDING WITH ACCOUNTS APPROVER' ||
                        item.headerStatus === 'PENDING WITH FINANCE APPROVER' ||
                        item.headerStatus === 'PENDING CANCELLATION REQUEST' ||

                        item.headerStatus === 'CANCEL BY EMPLOYEE'));
                break;
            case 'APPROVED BY ACCOUNTS APPROVER':
                filteredData = this.CreditNotedashboardData.filter((item: any) =>
                (
                    // item.headerStatus === 'APPROVED BY ACCOUNTS APPROVER'
                    // || item.headerStatus === 'MAIL SENT BY ACCOUNT TO CUSTOMER'
                    // || item.headerStatus === 'APPROVED BY FINANCE'
                    item.headerStatus === 'PENDING WITH CH APPROVER' ||
                    item.headerStatus === 'APPROVED BY TL'
                    || item.headerStatus === 'TI PENDING WITH ACCOUNTS'

                    // || item.headerStatus === 'CREDIT MEMO POSTED'
                    // || item.headerStatus === 'MAIL SENT BY FINANCE TO CUSTOMER'
                ));
                break;

            case 'Posted Credit Note':
                filteredData = this.CreditNotedashboardData.filter((item: any) =>
                (
                    item.headerStatus === 'APPROVED BY ACCOUNTS APPROVER'
                    || item.headerStatus === 'MAIL SENT BY ACCOUNT TO CUSTOMER'
                    || item.headerStatus === 'APPROVED BY FINANCE'

                    || item.headerStatus === 'CREDIT MEMO POSTED'
                    || item.headerStatus === 'MAIL SENT BY FINANCE TO CUSTOMER'
                ));
                break;

            //Posted Credit Note
            case 'REJECTED BY CH APPROVER':
                filteredData = this.CreditNotedashboardData.filter((item: any) =>
                // item.createdBy === this.publicVariable.storedEmail &&
                // item.impiHeaderInvoiceType == this.invoiceType &&
                (
                    item.headerStatus === 'REJECTED BY TL APPROVER' ||
                    item.headerStatus === 'REJECTED BY CH APPROVER' ||
                    item.headerStatus === 'REJECTED BY ACCOUNTS APPROVER' ||
                    item.headerStatus === 'REJECTED BY FINANCE APPROVER'
                    || item.headerStatus === 'CANCELLATION REJECTED BY TL'
                    || item.headerStatus === 'CANCELLATION REJECTED BY FINANCE'

                ));
                break;
            case 'Cancelled':
                filteredData = this.CreditNotedashboardData.filter((item: any) =>
                // item.createdBy === this.publicVariable.storedEmail &&
                // item.impiHeaderInvoiceType == this.invoiceType &&
                (
                    item.headerStatus === 'CANCELLATION APPROVED BY FINANCE'
                    || item.headerStatus == 'CANCELLATION APPROVED BY TL'));
                break;
            case 'Reversal':
                filteredData = this.CreditNotedashboardData.filter((item: any) =>
                // item.createdBy === this.publicVariable.storedEmail &&
                (
                    item.headerStatus === ''));
                break;
            case 'FOR APPROVAL':
                filteredData = this.CreditNotedashboardData.filter((item: any) =>
                // item.impiHeaderInvoiceType == this.invoiceType &&
                (
                    item.headerStatus === 'PENDING WITH TL APPROVER' ||
                    item.headerStatus === 'PENDING WITH CH APPROVER' ||
                    item.headerStatus === 'PENDING WITH ACCOUNTS APPROVER' ||
                    item.headerStatus === 'PENDING WITH FINANCE APPROVER'
                    || item.headerStatus === 'CANCEL BY EMPLOYEE'


                ));
                break;
            case 'ALL':
                filteredData = this.CreditNotedashboardData;
                break;
            default:
                filteredData = this.CreditNotedashboardData;

                break;
        }

        this.invoiceStatuslistData = filteredData;


        this.publicVariable.count = filteredData.length;
        //this.PICount = filteredData.length;

    }






    // Implement similar methods for loading data for other statuses


    onTableDataChange(event: any, status?: any) {
        //this.publicVariable.customerStatusList;



        if (status == 'Posted Proforma Invoice') {
            this.ppipage = event;
            this.PIInvoiceSummaryList;
            this.cd.detectChanges();
            //this.PIloadInvoiceSummary();
        }

        else if (status == 'Customer') {
            this.publicVariable.page = event;
            this.publicVariable.customerStatusList;
            this.cd.detectChanges();

            //this.loadCustomerStatusList(this.customerStatus);
        }
        else if (status == 'Posted Tax Invoice') {
            // this.loadInvoiceSummary();
            this.ptipage = event;
            this.InvoiceSummaryList;
            this.cd.detectChanges();
        }
        else if (status == 'invoice') {
            this.pipage = event;
            this.invoiceStatuslistData;
            this.cd.detectChanges();
            // this.loadInoivceStatusList(this.customerStatus);
        }

        else if (status == 'Sales Credit Note') {
            this.publicVariable.page = event;
            this.SalesCreditNoteSummaryData;
            this.cd.detectChanges();
        }

    }


    onTableSizeChange(event: any, status?: any): void {




        //this.publicVariable.customerStatusList
        // this.publicVariable.tableSize = event.target.value;
        // this.publicVariable.page = 1;
        if (status == 'Posted Proforma Invoice') {

            this.ppitableSize = event.target.value;
            this.ppipage = 1;
            this.PIInvoiceSummaryList;
        }
        else if (status == 'Customer') {
            this.publicVariable.tableSize = event.target.value;
            this.publicVariable.page = 1;
            this.publicVariable.customerStatusList;
        }
        else if (status == 'Posted Tax Invoice') {
            this.ptitableSize = event.target.value;
            this.ptipage = 1;
            this.InvoiceSummaryList;
        }
        else if (status == 'invoice') {
            this.pitableSize = event.target.value;
            this.pipage = 1;
            this.invoiceStatuslistData;
        }

        else if (status == 'Sales Credit Note') {
            this.publicVariable.tableSize = event.target.value;
            this.publicVariable.page = 1;
            this.SalesCreditNoteSummaryData;
        }

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

    PostedSalesCreditNotedownalodFile(fileUrl: any) {
        this.publicVariable.isProcess = true;
        this.PostedSalesCreditNoteAttachment(fileUrl);
    }

    PostedSalesCreditNoteAttachment(invoice: string) {
        try {
            const subscription = this.IAPI.GetPITaxInvoiceAttachment(invoice).subscribe({
                next: (response: any) => {

                    if (response.data.length > 0) {
                        this.InvoiceAttachment = response.data[0];
                        const fileName = this.InvoiceAttachment.invoiceNo + '.pdf';
                        const fileType = `application/pdf`;
                        this.fileService.downloadFile(this.InvoiceAttachment.attachment, fileName, fileType);
                        this.publicVariable.isProcess = false;
                    }
                    this.handleLoadingError();
                },
                error: (error) => {
                    console.error('Error loading project list:', error);
                    this.handleLoadingError();
                },
            });

            this.publicVariable.Subscription.add(subscription);
        } catch (error) {
            console.error('Error loading project list:', error);
            this.handleLoadingError();
        }
    }


    onEdit(data: customerStatusListModel): void {
        if (data.customerId) {
            const encryptedHeaderId = btoa(data.customerId.toString());

            this.router.navigate(['customer/status/edit', encryptedHeaderId], { state: { data: data } });
        } else {
            console.error('ID is undefined or null');
        }
    }

    onView(data: customerStatusListModel): void {
        if (data.customerId) {
            const encryptedHeaderId = btoa(data.customerId.toString());

            this.router.navigate(['customer/status/view', encryptedHeaderId], { state: { data: data } });
        } else {
            console.error('ID is undefined or null');
        }
    }

    onApproval(data: customerStatusListModel) {
        if (data.customerId) {
            const encryptedHeaderId = btoa(data.customerId.toString());

            this.router.navigate(['customer/accounts/remarks/', encryptedHeaderId], { state: { data: data } });
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
                        this.loadPurchaseInvoiceList(this.invoiceType);

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
            const encryptedHeaderId = btoa(data.headerId.toString());

            this.router.navigate(['invoice/status/edit', encryptedHeaderId], { state: { data: data } });
        } else {
            console.error('ID is undefined or null');
        }
    }

    onEditSI(data: invoiceStatusModule): void {
        if (data.headerId) {
            const encryptedHeaderId = btoa(data.headerId.toString());

            this.router.navigate(['invoice/credit-memo-status/edit', encryptedHeaderId], { state: { data: data } });
        } else {
            console.error('ID is undefined or null');
        }
    }

    onViewPI(data: invoiceStatusModule): void {


        if (data.headerId) {
            if (data.impiHeaderCreatedBy == this.publicVariable.storedEmail) {
                const encryptedHeaderId = btoa(data.headerId.toString());
                this.router.navigate(['invoice/status/view', encryptedHeaderId], { state: { data: data } });
            }
            else {
                const encryptedHeaderId = btoa(data.headerId.toString());
                this.router.navigate(['invoice/approval/view', encryptedHeaderId], { state: { data: data } });
            }
        }
        else {
            console.error('ID is undefined or null');
        }
    }

    // onApprovalPI(data: invoiceStatusModule): void {
    //     if (data.headerId) {
    //         const encryptedHeaderId = btoa(data.headerId.toString());

    //         this.router.navigate(['invoice/approval/view', encryptedHeaderId], { state: { data: data } });
    //     } else {
    //         console.error('ID is undefined or null');
    //     }
    // }

    onViewSales(data: invoiceStatusModule) {
        if (data.headerId) {
            if (this.storedRole == 'Employee') {
                const encryptedHeaderId = btoa(data.headerId.toString());

                this.router.navigate(['invoice/credit-memo-status/view', encryptedHeaderId], { state: { data: data } });
            }
            else {
                const encryptedHeaderId = btoa(data.headerId.toString());
                console.log("Login by", this.publicVariable.storedEmail);
                console.log("Status", data.headerStatus);
                console.log("selected data", data)
                if ((data.headerStatus == 'PENDING WITH TL APPROVER' && data.impiHeaderTlApprover.toLocaleLowerCase() == this.publicVariable.storedEmail.toLocaleLowerCase()) || (data.headerStatus == 'PENDING WITH CH APPROVER' && data.impiHeaderClusterApprover.toLocaleLowerCase() == this.publicVariable.storedEmail.toLocaleLowerCase())) {

                    this.router.navigate(['invoice/sales-approval/view', encryptedHeaderId], { state: { data: data } });
                }
                else {
                    this.router.navigate(['invoice/credit-memo-status/view', encryptedHeaderId], { state: { data: data } });

                }
            }
        } else {
            console.error('ID is undefined or null');
        }
    }



    onViewAccountPI(data: invoiceStatusModule): void {
        if (data.headerId) {
            const encryptedHeaderId = btoa(data.headerId.toString());

            this.router.navigate(['invoice/accounts/view', encryptedHeaderId], { state: { data: data } });
        } else {
            console.error('ID is undefined or null');
        }
    }

    InvoicedView(data: any): void {
        if (data.invoice_no) {
            const encryptedHeaderId = btoa(data.invoice_no.toString());

            this.router.navigate(['invoice/tax-invoice/view', encryptedHeaderId], { state: { data: data } });
        } else {
            console.error('ID is undefined or null');
        }
    }

    PIInvoicedView(data: any): void {
        if (data.no) {
            const encryptedHeaderId = btoa(data.no.toString());

            this.router.navigate(['invoice/pi-invoice/view', encryptedHeaderId], { state: { data: data } });
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

    onPIDownloadInvoiceSummary() {
        const exportData = this.PIInvoiceSummaryList.map((x) => ({
            "No": x?.no || '',
            "Customer No": x?.sellToCustomerNo || '',
            "Customer": x?.sellToCustomerName || '',
            "Project Code": x?.projectCode || '',
            "Department": x?.departmentName || '',
            "Division": x?.divisionName || '',
            "Amount": x?.amount || '',
            'status': x?.status || '',

        }));

        const headers = ['No', 'Customer No', 'Customer', 'Project Code', 'Department', 'Division', 'Amount', 'status'
        ];
        this.appService.exportAsExcelFile(exportData, 'Proforma Invoice', headers);
    }

    onDownloadInvoiceSummary() {

        const exportData = this.InvoiceSummaryList.map((x) => ({
            "No": x?.no || '',
            "Posting Date": x?.postingDate || '',
            "Invoice No": x?.invoice_no || '',
            "Customer No": x?.sellToCustomerNo || '',
            "Customer": x?.sellToCustomerName || '',
            "Project Code": x?.projectCode || '',
            "Department": x?.departmentName || '',
            "Division": x?.divisionName || '',
            "Amount": x?.amount || '',


        }));

        const headers = ['No', 'Posting Date', 'Invoice No', 'Customer No', 'Customer', 'Project Code', 'Department', 'Division', 'Amount'
        ];
        this.appService.exportAsExcelFile(exportData, 'Posted Tax Invoice', headers);


    }

    getStateNameById(stateId: string) {
        const state = this.publicVariable.stateList.find(state => state.stateCode === stateId);
        return state ? state.stateName : null;
    }



    handleLoadingError() {
        this.publicVariable.isProcess = false; // Set status to false on error
    }
    onDownloadSCN() {
        const exportData = this.SalesCreditNoteSummaryData.map((x) => ({
            "No": x?.no || '',
            "Posting Date": x?.postingDate || '',
            "Applies To DocNo": x?.appliesToDocNo || '',
            "Customer No": x?.sellToCustomerNo || '',
            "Customer Name": x?.sellToCustomerName || '',
            "Department": x?.deptCode || '',
            "Division": x?.divisionCode || '',
            "Project Code": x?.projectCode || '',
            'Status': x?.status

        }));

        const headers = ['No', 'Posting Date', 'Applies To DocNo', 'Customer No', 'Customer Name', 'Department', 'Division', 'Project Code', 'Status'];
        this.appService.exportAsExcelFile(exportData, 'Posted Sales Credit Note', headers);
    }
    onDownloadPI() {
        const exportData = this.invoiceStatuslistData.map((x) => ({
            "Record No": x?.headerRecordID || '',
            "Invoice Type": x?.impiHeaderInvoiceType || '',
            "PI No": x?.headerPiNo || '',
            "Project Code": x?.impiHeaderProjectCode || '',
            "Project Name": x?.impiHeaderProjectName || '',
            "Department": x?.impiHeaderProjectDepartmentName || '',
            "Division": x?.impiHeaderProjectDivisionName || '',
            "Vendor Name": x?.impiHeaderCustomerName || '',
            "City": x?.impiHeaderCustomerCity || '',
            "Amount": x?.impiHeaderTotalInvoiceAmount || '',
            "TL Approver": x?.impiHeaderTlApprover || '',
            "Finance Approver": x?.impiHeaderFinanceApprover || '',
            "Created On": x?.impiHeaderSubmittedDate || '',
            "Created By": x?.impiHeaderCreatedBy || '',
            "Status": x?.headerStatus || '',
            'Refund Status': x?.refundStatus ? this.toTitleCase(x.refundStatus) : '',
        }));

        const headers = [
            'Record No', 'Invoice Type', 'PI No', 'Project Code', 'Project Name', 'Department', 'Division',
            'Vendor Name', 'City', 'Amount', 'TL Approver', 'Finance Approver', 'Created On', 'Created By', 'Status', 'Refund Status'
        ];
        this.appService.exportAsExcelFile(exportData, 'Sales Invoice Status', headers);
    }

    get isAccount() {
        return this.storedRole == 'Accounts';
    }


    loadInvoiceSummary() {
        this.publicVariable.isProcess = true;
        this.headerStatus = 'Posted Tax Invoice'
        const subscription = this.IAPI.GetInvoiceSummary().pipe(
            timeout(120000), // Timeout set to 2 minutes (120000 milliseconds)
            finalize(() => {
                this.publicVariable.isProcess = false;
            })
        ).subscribe({
            next: (response: any) => {
                if (response.data && Array.isArray(response.data)) {

                    // // Filter the data by createdBy
                    // this.InvoiceSummaryList = response.data.filter((item: any) => item.createdByUser === this.publicVariable.storedEmail);
                    // this.PostedTaxInvoiceCount = this.InvoiceSummaryList.length;


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

    PIloadInvoiceSummary() {
        this.cd.detectChanges();
        this.publicVariable.isProcess = true;
        this.headerStatus = 'Posted Proforma Invoice';
        const subscription = this.IAPI.GetPIInvoiceSummary().pipe(
            timeout(120000), // Timeout set to 2 minutes (120000 milliseconds)
            finalize(() => {
                this.publicVariable.isProcess = false;
            })
        ).subscribe({
            next: (response: any) => {
                if (response.data && Array.isArray(response.data)) {

                    // // Filter the data by createdBy
                    // this.InvoiceSummaryList = response.data.filter((item: any) => item.createdByUser === this.publicVariable.storedEmail);
                    // this.PostedTaxInvoiceCount = this.InvoiceSummaryList.length;


                    this.PIInvoiceSummaryList = response.data;
                    this.PIPostedTaxInvoiceCount = response.data.length;
                    this.cd.detectChanges();



                    // console.log(this.PIPostedTaxInvoiceCount);

                } else {
                    // Handle case where response data is null or not an array
                    this.PIInvoiceSummaryList = [];
                    this.PIPostedTaxInvoiceCount = 0;
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
                formData.append('MailCC', dataItem.impiHeaderCreatedBy);
                formData.append('ResourceType', dataItem.impiHeaderInvoiceType);
                formData.append('ResourceId', dataItem.headerId);

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


    sendEmail111(dataItem: any) {
        this.publicVariable.isProcess = true;

        const modalRef = this.modalService.open(PostedEmailComponent, { size: "xl" });
        var componentInstance = modalRef.componentInstance as PostedEmailComponent;
        componentInstance.isEmail = dataItem;
        modalRef.result.then((data: any) => {
            if (data) {
                const newData = data;
                const formData = new FormData();
                formData.append('MailTo', newData.emailTo);
                formData.append('MailSubject', newData.subject);
                formData.append('MailBody', newData.body);
                formData.append('LoginId', this.publicVariable.storedEmail);
                formData.append('MailCC', newData.MailCC);
                formData.append('ResourceType', 'Invoice');
                formData.append('ResourceId', '1');

                newData.attachment.forEach((file: any) => {
                    if (file instanceof File) {
                        formData.append('Attachments', file);
                    } else {

                        const base64Data = file.attachment; // Your base64 encoded attachment data
                        const decodedData = atob(base64Data); // Decode base64 data

                        // Convert the decoded data to Uint8Array
                        const bytes = new Uint8Array(decodedData.length);
                        for (let i = 0; i < decodedData.length; i++) {
                            bytes[i] = decodedData.charCodeAt(i);
                        }

                        // Create a Blob from the Uint8Array
                        const blob = new Blob([bytes.buffer], { type: 'application/pdf' });

                        // Create a File object with a unique name
                        file = new File([blob], `${file.name}.${file.type}`, { type: 'application/pdf' });

                        formData.append('Attachments', file);
                    }
                });
                this.publicVariable.isProcess = true;

                this.publicVariable.Subscription.add(
                    this.IAPI.sendEmail(formData).subscribe({
                        next: (res: any) => {
                            if (res.status === true) {
                                this.toastr.success(res.message, 'Success');
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


    sendEmailPI(dataItem: any) {
        this.publicVariable.isProcess = true;

        const modalRef = this.modalService.open(PIEmailComponent, { size: "xl" });
        var componentInstance = modalRef.componentInstance as PIEmailComponent;
        componentInstance.isEmail = dataItem;
        modalRef.result.then((data: any) => {
            if (data) {
                const newData = data;
                const formData = new FormData();
                formData.append('MailTo', newData.emailTo);
                formData.append('MailSubject', newData.subject);
                formData.append('MailBody', newData.body);
                formData.append('LoginId', this.publicVariable.storedEmail);
                formData.append('MailCC', newData.MailCC);
                formData.append('ResourceType', 'Invoice');
                formData.append('ResourceId', '1');

                newData.attachment.forEach((file: any) => {
                    if (file instanceof File) {
                        formData.append('Attachments', file);
                    } else {

                        const base64Data = file.attachment; // Your base64 encoded attachment data
                        const decodedData = atob(base64Data); // Decode base64 data

                        // Convert the decoded data to Uint8Array
                        const bytes = new Uint8Array(decodedData.length);
                        for (let i = 0; i < decodedData.length; i++) {
                            bytes[i] = decodedData.charCodeAt(i);
                        }

                        // Create a Blob from the Uint8Array
                        const blob = new Blob([bytes.buffer], { type: 'application/pdf' });

                        // Create a File object with a unique name
                        file = new File([blob], `${file.name}.${file.type}`, { type: 'application/pdf' });

                        formData.append('Attachments', file);
                    }
                });
                this.publicVariable.isProcess = true;

                this.publicVariable.Subscription.add(
                    this.IAPI.sendEmail(formData).subscribe({
                        next: (res: any) => {
                            if (res.status === true) {
                                this.toastr.success(res.message, 'Success');
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

    onTextSendEmail(dataItem: any) {
        this.sendEmail111(dataItem);
    }

    onTextPISendEmail(dataItem: any) {
        this.sendEmailPI(dataItem);
    }

    onsalesSendEmail(dataItem: any) {
        this.sendSalesEmail(dataItem);
    }


    sendSalesEmail(dataItem: any) {
        this.publicVariable.isProcess = true;
        const modalRef = this.modalService.open(CreditSalesEmailComponent, { size: "xl" });
        var componentInstance = modalRef.componentInstance as CreditSalesEmailComponent;
        componentInstance.isEmail = dataItem;
        modalRef.result.then((data: any) => {
            if (data) {
                const newData = data;
                const formData = new FormData();
                formData.append('MailTo', newData.emailTo);
                formData.append('MailSubject', newData.subject);
                formData.append('MailBody', newData.body);
                formData.append('LoginId', this.publicVariable.storedEmail);
                formData.append('MailCC', dataItem.impiHeaderCreatedBy);
                formData.append('ResourceType', dataItem.impiHeaderInvoiceType);
                formData.append('ResourceId', dataItem.headerId);

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


    loadTaxPaymentInvoiceSummary(data: any) {

        this.publicVariable.isProcess = true;
        const subscription = this.IAPI.getTaxPaymentDetails(data.postedInvoiceNumber).pipe(
            timeout(120000), // Timeout set to 2 minutes (120000 milliseconds)
            finalize(() => {
                this.publicVariable.isProcess = false;
            })
        ).subscribe({
            next: (response: any) => {
                if (response.data && Array.isArray(response.data)) {

                    this.TaxInvoicePaymentSummaryList = response.data;
                    console.log(response);
                    this.publicVariable.isProcess = false;
                    //this.PostedTaxInvoiceCount = response.data.length;
                } else {
                    // Handle case where response data is null or not an array
                    this.TaxInvoicePaymentSummaryList = [];
                    this.publicVariable.isProcess = false;
                    //   this.PostedTaxInvoiceCount = 0;
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



    downalodpostedTexFile(fileUrl: any) {
        this.publicVariable.isProcess = true;

        try {
            const subscription = this.IAPI.GetTaxInvoiceAttachment(fileUrl).subscribe({
                next: (response: any) => {

                    this.InvoiceAttachment = response.data[0];
                    const fileName = this.InvoiceAttachment.invoiceNo + '.pdf';
                    const fileType = `application/pdf`;
                    this.fileService.downloadFile(this.InvoiceAttachment.attachment, fileName, fileType);
                    this.publicVariable.isProcess = false;
                },
                error: (error) => {
                    console.error('Error loading project list:', error);
                    // this.handleLoadingError();
                },
            });

            this.publicVariable.Subscription.add(subscription);
        } catch (error) {
            console.error('Error loading project list:', error);
            // this.handleLoadingError();
        }


    }

    ProformaInvoicedownalodFile(fileUrl: any) {
        this.publicVariable.isProcess = true;

        try {
            const subscription = this.IAPI.GetPITaxInvoiceAttachment(fileUrl).subscribe({
                next: (response: any) => {

                    this.InvoiceAttachment = response.data[0];
                    const fileName = this.InvoiceAttachment.invoiceNo + '.pdf';
                    const fileType = `application/pdf`;
                    this.fileService.downloadFile(this.InvoiceAttachment.attachment, fileName, fileType);
                    this.publicVariable.isProcess = false;
                },
                error: (error) => {
                    console.error('Error loading project list:', error);
                    // this.handleLoadingError();
                },
            });

            this.publicVariable.Subscription.add(subscription);
        } catch (error) {
            console.error('Error loading project list:', error);
            // this.handleLoadingError();
        }


    }

    downalod1File(fileUrl: any) {
        this.publicVariable.isProcess = true;

        try {
            const subscription = this.IAPI.GetTaxInvoiceAttachment(fileUrl).subscribe({
                next: (response: any) => {

                    this.InvoiceAttachment = response.data[0];

                    if (this.InvoiceAttachment.attachment != undefined && this.InvoiceAttachment.attachment != '' && this.InvoiceAttachment.attachment != null) {
                        const fileName = this.InvoiceAttachment.invoiceNo + '.pdf';
                        const fileType = `application/pdf`;
                        this.fileService.downloadFile(this.InvoiceAttachment.attachment, fileName, fileType);

                    }
                    else {

                        this.toastr.warning('There is an issue with the download of the file from ERP.', 'File Not Found')
                    }

                    this.publicVariable.isProcess = false;
                },
                error: (error) => {
                    console.error('Error loading project list:', error);
                    // this.handleLoadingError();
                },
            });

            this.publicVariable.Subscription.add(subscription);
        } catch (error) {
            console.error('Error loading project list:', error);
            // this.handleLoadingError();
        }


    }

    downalodFilePI(fileUrl: any) {
        this.publicVariable.isProcess = true;

        try {
            const subscription = this.IAPI.GetPITaxInvoiceAttachment(fileUrl).subscribe({
                next: (response: any) => {

                    this.InvoiceAttachment = response.data[0];
                    // const fileName = this.InvoiceAttachment.invoiceNo+'.pdf';
                    // const fileType = `application/pdf`;
                    // this.fileService.downloadFile(this.InvoiceAttachment.attachment, fileName, fileType);
                    // this.publicVariable.isProcess  = false;

                    if (this.InvoiceAttachment.attachment != undefined && this.InvoiceAttachment.attachment != '' && this.InvoiceAttachment.attachment != null) {
                        const fileName = this.InvoiceAttachment.invoiceNo + '.pdf';
                        const fileType = `application/pdf`;
                        this.fileService.downloadFile(this.InvoiceAttachment.attachment, fileName, fileType);

                    }
                    else {

                        this.toastr.warning('There is an issue with the download of the file from ERP.', 'File Not Found')
                    }
                    this.publicVariable.isProcess = false;

                },
                error: (error) => {
                    console.error('Error loading project list:', error);
                    // this.handleLoadingError();
                },
            });

            this.publicVariable.Subscription.add(subscription);
        } catch (error) {
            console.error('Error loading project list:', error);
            // this.handleLoadingError();
        }


    }

    onValueChange(event: Event) {
        const target = event.target as HTMLSelectElement;
        this.selectedValue = target.value;
        const oneWeekFromNow = new Date();
        if (this.selectedValue === 'ALL') {
            this.startDate = '';
            this.endDate = ''
        }
        else if (this.selectedValue === 'Today') {
            this.startDate = this.datePipe.transform(
                oneWeekFromNow.toISOString().split('T')[0],
                'yyyy-MM-dd'
            );
            this.endDate = this.datePipe.transform(
                oneWeekFromNow.toISOString().split('T')[0],
                'yyyy-MM-dd'
            );
        } else if (this.selectedValue === 'Yesterday') {
            oneWeekFromNow.setDate(oneWeekFromNow.getDate() - 1);
            this.startDate = this.datePipe.transform(
                oneWeekFromNow.toISOString().split('T')[0],
                'yyyy-MM-dd'
            );
            this.endDate = this.datePipe.transform(
                oneWeekFromNow.toISOString().split('T')[0],
                'yyyy-MM-dd'
            );
        } else if (this.selectedValue === '7') {
            const oneWeekFromNow = new Date();
            this.endDate = this.datePipe.transform(
                oneWeekFromNow.toISOString().split('T')[0],
                'yyyy-MM-dd'
            );
            oneWeekFromNow.setDate(oneWeekFromNow.getDate() - 7);
            this.startDate = this.datePipe.transform(
                oneWeekFromNow.toISOString().split('T')[0],
                'yyyy-MM-dd'
            );
        } else if (this.selectedValue === '30') {
            const oneWeekFromNow = new Date();
            this.endDate = this.datePipe.transform(
                oneWeekFromNow.toISOString().split('T')[0],
                'yyyy-MM-dd'
            );
            oneWeekFromNow.setDate(oneWeekFromNow.getDate() - 30);
            this.startDate = this.datePipe.transform(
                oneWeekFromNow.toISOString().split('T')[0],
                'yyyy-MM-dd'
            );
        }

        //this.publicVariable.isProcess = true;
        var model: any = {
            startDate: this.datePipe.transform(this.startDate, 'yyyy-MM-dd'),
            endDate: this.datePipe.transform(this.endDate, 'yyyy-MM-dd'),
        };
        this.CustomerDateFilter(model)

    }

    reset() {
        this.startDate = '';
        this.endDate = '';
        this.selectedValue = 'ALL';
    }

    submitDateRange() {
        const start = new Date(this.startDate);
        const end = new Date(this.endDate);
        if (start > end) {
            this.dateRangeError = true;
        } else {
            this.dateRangeError = false;
            var model: any = {
                startDate: this.datePipe.transform(this.startDate, 'yyyy-MM-dd'),
                endDate: this.datePipe.transform(this.endDate, 'yyyy-MM-dd'),
            };

            this.CustomerDateFilter(model)
        }
    }

    isfilterDefaultStatus: boolean = false;
    onValueChangePI(event: Event) {
        const target = event.target as HTMLSelectElement;

        if (this.headerStatus == 'DRAFT') {
            this.isfilterDefaultStatus = true;
        }
        this.selectedValue = target.value;
        const oneWeekFromNow = new Date();
        if (this.selectedValue === 'ALL') {
            this.startDate = '';
            this.endDate = ''
        }
        else if (this.selectedValue === 'Today') {
            this.startDate = this.datePipe.transform(
                oneWeekFromNow.toISOString().split('T')[0],
                'yyyy-MM-dd'
            );
            this.endDate = this.datePipe.transform(
                oneWeekFromNow.toISOString().split('T')[0],
                'yyyy-MM-dd'
            );
        } else if (this.selectedValue === 'Yesterday') {
            oneWeekFromNow.setDate(oneWeekFromNow.getDate() - 1);
            this.startDate = this.datePipe.transform(
                oneWeekFromNow.toISOString().split('T')[0],
                'yyyy-MM-dd'
            );
            this.endDate = this.datePipe.transform(
                oneWeekFromNow.toISOString().split('T')[0],
                'yyyy-MM-dd'
            );
        } else if (this.selectedValue === '7') {
            const oneWeekFromNow = new Date();
            this.endDate = this.datePipe.transform(
                oneWeekFromNow.toISOString().split('T')[0],
                'yyyy-MM-dd'
            );
            oneWeekFromNow.setDate(oneWeekFromNow.getDate() - 7);
            this.startDate = this.datePipe.transform(
                oneWeekFromNow.toISOString().split('T')[0],
                'yyyy-MM-dd'
            );
        } else if (this.selectedValue === '30') {
            const oneWeekFromNow = new Date();
            this.endDate = this.datePipe.transform(
                oneWeekFromNow.toISOString().split('T')[0],
                'yyyy-MM-dd'
            );
            oneWeekFromNow.setDate(oneWeekFromNow.getDate() - 30);
            this.startDate = this.datePipe.transform(
                oneWeekFromNow.toISOString().split('T')[0],
                'yyyy-MM-dd'
            );
        }

        //this.publicVariable.isProcess = true;
        var model: any = {
            startDate: this.datePipe.transform(this.startDate, 'yyyy-MM-dd'),
            endDate: this.datePipe.transform(this.endDate, 'yyyy-MM-dd'),
        };
        // this.CustomerDateFilter(model)

        this.invoiceDateFilter(model);

        console.log(this.customerStatus, this.headerStatus);






    }

    submitDateRangePI() {
        const start = new Date(this.startDate);
        const end = new Date(this.endDate);
        if (start > end) {
            this.dateRangeError = true;
        } else {
            this.dateRangeError = false;
            var model: any = {
                startDate: this.datePipe.transform(this.startDate, 'yyyy-MM-dd'),
                endDate: this.datePipe.transform(this.endDate, 'yyyy-MM-dd'),
            };

            this.invoiceDateFilter(model)


        }
    }


    onValueChangeSL(event: Event) {
        const target = event.target as HTMLSelectElement;
        this.selectedValue = target.value;
        const oneWeekFromNow = new Date();
        if (this.selectedValue === 'ALL') {
            this.startDate = '';
            this.endDate = ''
        }
        else if (this.selectedValue === 'Today') {
            this.startDate = this.datePipe.transform(
                oneWeekFromNow.toISOString().split('T')[0],
                'yyyy-MM-dd'
            );
            this.endDate = this.datePipe.transform(
                oneWeekFromNow.toISOString().split('T')[0],
                'yyyy-MM-dd'
            );
        } else if (this.selectedValue === 'Yesterday') {
            oneWeekFromNow.setDate(oneWeekFromNow.getDate() - 1);
            this.startDate = this.datePipe.transform(
                oneWeekFromNow.toISOString().split('T')[0],
                'yyyy-MM-dd'
            );
            this.endDate = this.datePipe.transform(
                oneWeekFromNow.toISOString().split('T')[0],
                'yyyy-MM-dd'
            );
        } else if (this.selectedValue === '7') {
            const oneWeekFromNow = new Date();
            this.endDate = this.datePipe.transform(
                oneWeekFromNow.toISOString().split('T')[0],
                'yyyy-MM-dd'
            );
            oneWeekFromNow.setDate(oneWeekFromNow.getDate() - 7);
            this.startDate = this.datePipe.transform(
                oneWeekFromNow.toISOString().split('T')[0],
                'yyyy-MM-dd'
            );
        } else if (this.selectedValue === '30') {
            const oneWeekFromNow = new Date();
            this.endDate = this.datePipe.transform(
                oneWeekFromNow.toISOString().split('T')[0],
                'yyyy-MM-dd'
            );
            oneWeekFromNow.setDate(oneWeekFromNow.getDate() - 30);
            this.startDate = this.datePipe.transform(
                oneWeekFromNow.toISOString().split('T')[0],
                'yyyy-MM-dd'
            );
        }

        //this.publicVariable.isProcess = true;
        var model: any = {
            startDate: this.datePipe.transform(this.startDate, 'yyyy-MM-dd'),
            endDate: this.datePipe.transform(this.endDate, 'yyyy-MM-dd'),
        };
        this.SLFilterBYDate(model)

    }



    submitDateRangeSL() {
        const start = new Date(this.startDate);
        const end = new Date(this.endDate);
        if (start > end) {
            this.dateRangeError = true;
        } else {
            this.dateRangeError = false;
            var model: any = {
                startDate: this.datePipe.transform(this.startDate, 'yyyy-MM-dd'),
                endDate: this.datePipe.transform(this.endDate, 'yyyy-MM-dd'),
            };

            this.SLFilterBYDate(model)
        }
    }

    SLLdownalodFile(fileUrl: any) {
        this.publicVariable.isProcess = true;
        this.PostedSalesCreditNoteAttachmentNEW(fileUrl);
    }

    PostedSalesCreditNoteAttachmentNEW(invoice: string) {
        try {
            this.publicVariable.isProcess = true;
            const subscription = this.IAPI.GetSLLTaxInvoiceAttachment(invoice).subscribe({
                next: (response: any) => {
                    console.log(response);

                    if (response.data.length > 0) {
                        this.InvoiceAttachment = response.data[0];


                        const fileName = this.InvoiceAttachment.salesCrMemoNo + '.pdf';
                        const fileType = `application/pdf`;
                        this.fileService.downloadFile(this.InvoiceAttachment.attachment, fileName, fileType);
                        this.publicVariable.isProcess = false;
                    }
                    this.handleLoadingError();
                },
                error: (error) => {
                    console.error('Error loading project list:', error);
                    this.handleLoadingError();
                },
            });

            this.publicVariable.Subscription.add(subscription);
        } catch (error) {
            console.error('Error loading project list:', error);
            this.handleLoadingError();
        }
    }

    downalodFile_New(fileUrl: any) {
        this.publicVariable.isProcess = true;

        try {
            const subscription = this.IAPI.GetTaxInvoiceAttachment(fileUrl).subscribe({
                next: (response: any) => {

                    this.InvoiceAttachment = response.data[0];

                    if (this.InvoiceAttachment.attachment != undefined && this.InvoiceAttachment.attachment != '' && this.InvoiceAttachment.attachment != null) {
                        const fileName = this.InvoiceAttachment.invoiceNo + '.pdf';
                        const fileType = `application/pdf`;
                        this.fileService.downloadFile(this.InvoiceAttachment.attachment, fileName, fileType);

                    }
                    else {

                        this.toastr.warning('There is an issue with the download of the file from ERP.', 'File Not Found')
                    }

                    this.publicVariable.isProcess = false;
                },
                error: (error) => {
                    console.error('Error loading project list:', error);
                    // this.handleLoadingError();
                },
            });

            this.publicVariable.Subscription.add(subscription);
        } catch (error) {
            console.error('Error loading project list:', error);
            // this.handleLoadingError();
        }


    }

    downalodFilePI_New(fileUrl: any) {
        this.publicVariable.isProcess = true;

        try {
            const subscription = this.IAPI.GetPITaxInvoiceAttachment(fileUrl).subscribe({
                next: (response: any) => {

                    this.InvoiceAttachment = response.data[0];
                    // const fileName = this.InvoiceAttachment.invoiceNo+'.pdf';
                    // const fileType = `application/pdf`;
                    // this.fileService.downloadFile(this.InvoiceAttachment.attachment, fileName, fileType);
                    // this.publicVariable.isProcess  = false;

                    if (this.InvoiceAttachment.attachment != undefined && this.InvoiceAttachment.attachment != '' && this.InvoiceAttachment.attachment != null) {
                        const fileName = this.InvoiceAttachment.invoiceNo + '.pdf';
                        const fileType = `application/pdf`;
                        this.fileService.downloadFile(this.InvoiceAttachment.attachment, fileName, fileType);

                    }
                    else {

                        this.toastr.warning('There is an issue with the download of the file from ERP.', 'File Not Found')
                    }
                    this.publicVariable.isProcess = false;

                },
                error: (error) => {
                    console.error('Error loading project list:', error);
                    // this.handleLoadingError();
                },
            });

            this.publicVariable.Subscription.add(subscription);
        } catch (error) {
            console.error('Error loading project list:', error);
            // this.handleLoadingError();
        }


    }


}
