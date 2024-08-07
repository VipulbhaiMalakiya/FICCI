import { Component, OnInit } from '@angular/core';
import { AppService, ConfirmationDialogModalComponent, formatDate, CustomersService, NgbModal, Router, ToastrService, customerStatusListModel, publicVariable } from '../../Export/new-customer'
import { finalize, timeout } from 'rxjs';
import { DatePipe } from '@angular/common';
@Component({
    selector: 'app-status-customer',
    templateUrl: './status-customer.component.html',
    styleUrls: ['./status-customer.component.css']
})
export class StatusCustomerComponent implements OnInit {
    publicVariable = new publicVariable();
    startDate?: any;
    endDate?: any;
    dateRangeError: boolean = false;
    selectedValue?: any = 'ALL';
    public filteredCustomerStatusList: any[] = [];



    constructor(private appService: AppService,
        private modalService: NgbModal,
        private router: Router,
        private toastr: ToastrService,
        private API: CustomersService,
        private datePipe: DatePipe

    ) {

    }

    ngOnInit(): void {
        let model: any = {
            'startDate': '',
            'endDate': ''
        }
        this.loadCustomerStatusList(model);
        this.publicVariable.storedEmail = localStorage.getItem('userEmail') ?? '';
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

        this.publicVariable.isProcess = true;
        var model: any = {
            startDate: this.datePipe.transform(this.startDate, 'yyyy-MM-dd'),
            endDate: this.datePipe.transform(this.endDate, 'yyyy-MM-dd'),
        };
        this.loadCustomerStatusList(model);

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
            this.publicVariable.isProcess = true;

            this.loadCustomerStatusList(model);

        }
    }

    loadCustomerStatusList(model: any): void {
        const subscription = this.API.getCustomerStatusNew(model).pipe(
            timeout(120000), // Timeout set to 2 minutes (120000 milliseconds)
            finalize(() => {
                this.publicVariable.isProcess = false;
            })
        ).subscribe({
            next: (response: any) => {
                if (this.publicVariable.storedRole === 'Admin') {
                    this.publicVariable.customerStatusList = response.data;
                    this.publicVariable.count = response.data.length;
                    this.publicVariable.isProcess = false;
                    this.updateFilteredUserList();
                } else {

                    this.publicVariable.customerStatusList = response.data;
                    this.publicVariable.count = response.data.length;
                    // Filter the response data by email
                    //const filteredData = response.data.filter((item: any) => item.createdBy === this.publicVariable.storedEmail);
                    //this.publicVariable.customerStatusList = filteredData;
                    //this.publicVariable.count = filteredData.length;
                    this.publicVariable.isProcess = false;
                    this.updateFilteredUserList();


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

    updateFilteredUserList(): void {
        const searchText = this.publicVariable.searchText.toLowerCase();


        const filteredData = this.publicVariable.customerStatusList.filter((customer: any) => {
            const nameMatch = (customer.customerName ?? '').toLowerCase().includes(searchText);
            const addressMatch = (customer.address ?? '').toLowerCase().includes(searchText);
            const phoneNumberMatch = (customer.phoneNumber ?? '').toLowerCase().includes(searchText);
            const emailMatch = (customer.email ?? '').toLowerCase().includes(searchText);
            const gstNumberMatch = (customer.gstNumber ?? '').toLowerCase().includes(searchText);
            const panMatch = (customer.pan ?? '').toLowerCase().includes(searchText);
            const statusMatch = (customer.customerStatus ?? '').toLowerCase().includes(searchText);
            const remarksMatch = (customer.customerRemarks ?? '').toLowerCase().includes(searchText);
            const recordIDMatch = (customer.recordID ?? '').toLowerCase().includes(searchText);

            const cityNameMatch = (customer.cityList?.cityName ?? '').toLowerCase().includes(searchText);
            const stateNameMatch = (customer.stateList?.stateName ?? '').toLowerCase().includes(searchText);
            const countryNameMatch = (customer.countryList?.countryName ?? '').toLowerCase().includes(searchText);

            const workFlowHistoryMatch = customer.workFlowHistory?.some((history: any) =>
                (history.imwdRemarks ?? '').toLowerCase().includes(searchText) ||
                (history.imwdPendingAt ?? '').toLowerCase().includes(searchText) ||
                (history.imwdCreatedBy ?? '').toLowerCase().includes(searchText)
            ) ?? false;

            return nameMatch || addressMatch || phoneNumberMatch || emailMatch || gstNumberMatch ||
                panMatch || statusMatch || remarksMatch || recordIDMatch || cityNameMatch ||
                stateNameMatch || countryNameMatch || workFlowHistoryMatch;
        });


        this.publicVariable.count = filteredData.length;



        const startIndex = (this.publicVariable.page - 1) * this.publicVariable.tableSize;
        const endIndex = startIndex + this.publicVariable.tableSize;
        this.filteredCustomerStatusList = filteredData.slice(startIndex, endIndex);

    }




    getCityName(cityId: string): string | undefined {
        const city = this.publicVariable.cityList.find((c: any) => c.cityId === cityId);
        const cityName = city ? city.cityName : undefined;
        this.handleLoadingError(); // Set isProcess to false after retrieving the city name
        return cityName;
    }
    handleLoadingError() {
        this.publicVariable.isProcess = false; // Set status to false on error
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

                        let model: any = {
                            'startDate': this.startDate,
                            'endDate': this.endDate
                        }
                        this.loadCustomerStatusList(model);
                    },
                    error: (error) => {
                        this.publicVariable.isProcess = false;
                        this.toastr.error(error.error.message, 'Error');
                    }
                });

            }
        }).catch(() => { });

    }

    calculateIndex(page: number, index: number): number {
        return (page - 1) * this.publicVariable.tableSize + index + 1;
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
            'Last Update By': x.lastUpdateBy ? this.toTitleCase(x.lastUpdateBy) : '',
            'Status': x.customerStatus ? this.toTitleCase(x.customerStatus) : '',
        }));

        const headers = ['Cust. No.', 'Name', 'Name 2', 'Address', 'Address 2', 'Country', 'State', 'City',
            'Pincode', 'Email', 'Phone Number', 'Contact Person',
            'GST Customer Type', 'GST Registration No.', 'PAN Card',
            'Created On', 'Created By', 'Last Updated On', 'Last Update By', 'Status'];
        this.appService.exportAsExcelFile(exportData, 'Customer Status', headers);
    }
    onTableDataChange(event: any) {
        this.publicVariable.page = event;
        // this.publicVariable.customerStatusList;
        this.updateFilteredUserList();

    }
    onTableSizeChange(event: any): void {
        this.publicVariable.tableSize = event.target.value;
        this.publicVariable.page = 1;
        this.publicVariable.customerStatusList;

    }


}
