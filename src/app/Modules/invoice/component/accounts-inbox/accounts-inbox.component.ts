import { Component, OnInit } from '@angular/core';
import { AppService, CustomersService, InvoicesService, NgbModal, Router, ToastrService, formatDate, publicVariable } from '../../Export/invoce';
import { timeout, finalize } from 'rxjs';
import { invoiceStatusModule } from '../../interface/invoice';

@Component({
    selector: 'app-accounts-inbox',
    templateUrl: './accounts-inbox.component.html',
    styleUrls: ['./accounts-inbox.component.css']
})
export class AccountsInboxComponent implements OnInit {
    publicVariable = new publicVariable();


    constructor(private appService: AppService,
        private modalService: NgbModal,
        private router: Router,
        private toastr: ToastrService,
        private API: InvoicesService,
        private CAPI: CustomersService

    ) {

    }

    ngOnInit(): void {
        this.loadApproveInvoiceList();
    }


    loadApproveInvoiceList(): void {
        const subscription = this.API.getApproveAccountInvoice().pipe(
            timeout(120000), // Timeout set to 2 minutes (120000 milliseconds)
            finalize(() => {
                this.publicVariable.isProcess = false;
            })
        ).subscribe({
            next: (response: any) => {

                this.publicVariable.invoiceStatuslistData = response.data;
                this.publicVariable.count = response.data.length;
                this.loadStateList();
                this.publicVariable.isProcess = false;
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


    onView(data: invoiceStatusModule): void {
        if (data.headerId) {
            this.router.navigate(['invoice/accounts/view', data.headerId], { state: { data: data } });
        } else {
            console.error('ID is undefined or null');
        }
    }

    toTitleCase(str: string): string {
        return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    loadStateList() {
        try {
            const subscription = this.CAPI.getStateList().subscribe({
                next: (response: any) => {
                    this.publicVariable.stateList = response.data;
                    this.loadCityList();
                },
                error: (error) => {
                    console.error('Error loading project list:', error);
                    this.handleLoadingError()
                },
            });

            this.publicVariable.Subscription.add(subscription);
        } catch (error) {
            console.error('Error loading project list:', error);
            this.handleLoadingError()
        }
    }

    loadCityList() {
        try {
            const subscription = this.CAPI.getCityList().subscribe({
                next: (response: any) => {
                    this.publicVariable.cityList = response.data;
                    this.handleLoadingError();
                },
                error: (error) => {
                    console.error('Error loading city list:', error);
                    console.error('Failed to load city list. Please try again later.');
                    this.handleLoadingError();
                },
            });

            this.publicVariable.Subscription.add(subscription);
        } catch (error) {
            console.error('Error loading city list:', error);
            console.error('An unexpected error occurred. Please try again later.');
            this.handleLoadingError();
        }
    }

    getStateNameById(stateId: string) {
        const state = this.publicVariable.stateList.find(state => state.stateCode === stateId);
        return state ? state.stateName : null;
    }

    getCityNameById(cityId: any) {
        const city = this.publicVariable.cityList.find(city => city.cityCode === cityId);
        return city ? city.cityName : null;
    }

    handleLoadingError() {
        this.publicVariable.isProcess = false; // Set status to false on error
    }

    onDownload() {
        const exportData = this.publicVariable.invoiceStatuslistData.map((x) => ({
            "PO No.": x?.impiHeaderProjectCode || '',
            "PO Date": x?.impiHeaderSubmittedDate ? formatDate(x.impiHeaderSubmittedDate, 'medium', 'en-IN', 'IST') : '',
            Department: x?.impiHeaderProjectDepartmentName ? this.toTitleCase(x.impiHeaderProjectDepartmentName) : '',
            Divison: x?.impiHeaderProjectDivisionName ? this.toTitleCase(x.impiHeaderProjectDivisionName) : '',
            Category: x?.impiHeaderInvoiceType ? this.toTitleCase(x.impiHeaderInvoiceType) : '',
            "PAN No": x?.impiHeaderPanNo || '',
            "State": this.getStateNameById(x?.impiHeaderCustomerState),
            "City": this.getCityNameById(x?.impiHeaderCustomerCity),
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
            'Support Approver': x?.impiHeaderSupportApprover ? this.toTitleCase(x.impiHeaderSupportApprover) : '',
            "Update Date": x?.impiHeaderModifiedDate ? formatDate(x.impiHeaderModifiedDate, 'medium', 'en-IN', 'IST') : '',
        }));

        const headers = [
            'PO No.', 'PO Date', 'Department', 'Divison', 'Category',
            'Vendor Name', 'Address', 'State', 'City', 'Pincode',
            'Phone No', "Email ID", 'Contact Person', 'Customer  GST Number', 'PAN No', 'Amount', 'Payment Terms',
            'impiHeaderRemarks', 'Tl Approver', 'Cl Approver', 'Finance Approver', 'Support Approver', 'Update Date'
        ];
        this.appService.exportAsExcelFile(exportData, 'PI Invoice Status', headers);
    }

    onTableDataChange(event: any) {
        this.publicVariable.page = event;
        this.publicVariable.invoiceStatuslistData
    }
    onTableSizeChange(event: any): void {
        this.publicVariable.tableSize = event.target.value;
        this.publicVariable.page = 1;
        this.publicVariable.invoiceStatuslistData

    }
}
