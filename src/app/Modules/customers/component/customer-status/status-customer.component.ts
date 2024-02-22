import { Component, OnInit } from '@angular/core';
import { AppService, ConfirmationDialogModalComponent, formatDate, CustomersService, NgbModal, Router, ToastrService, customerStatusListModel, publicVariable } from '../../Export/new-customer'
import { finalize, timeout } from 'rxjs';
@Component({
    selector: 'app-status-customer',
    templateUrl: './status-customer.component.html',
    styleUrls: ['./status-customer.component.css']
})
export class StatusCustomerComponent implements OnInit {
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
        const subscription = this.API.getCustomerStatusNew().pipe(
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


                } else {
                    // Filter the response data by email
                    const filteredData = response.data.filter((item: any) => item.createdBy === this.publicVariable.storedEmail);
                    this.publicVariable.customerStatusList = filteredData;
                    this.publicVariable.count = filteredData.length;
                    this.publicVariable.isProcess = false;

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
                        this.loadCustomerStatusList();
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
            State: x?.stateCode ,
            Country: x.countryCode ,
            City: x?.cityCode ,
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
