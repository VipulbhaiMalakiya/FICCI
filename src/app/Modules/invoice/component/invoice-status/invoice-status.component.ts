import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AppService, ConfirmationDialogModalComponent, CustomersService, InvoicesService, NgbModal, Router, ToastrService, formatDate, publicVariable } from '../../Export/invoce';
import { invoiceStatusModule } from '../../interface/invoice';
import { FileService } from '../../service/FileService';

@Component({
    selector: 'app-invoice-status',
    templateUrl: './invoice-status.component.html',
    styleUrls: ['./invoice-status.component.css']
})
export class InvoiceStatusComponent implements OnInit {
    publicVariable = new publicVariable();
    InvoiceAttachment: any;


    constructor(private appService: AppService,
        private modalService: NgbModal,
        private router: Router,
        private toastr: ToastrService,
        private API: InvoicesService,
        private cdr: ChangeDetectorRef,
        private CAPI: CustomersService,
        private fileService: FileService

    ) {

    }

    ngOnInit(): void {
        this.loadPurchaseInvoiceList();
        this.loadStateList();
    }
    loadPurchaseInvoiceList(): void {
        try {
            const subscription = this.API.getPurchaseInvoice_New().subscribe({
                next: (response: any) => {
                    if (response.data && Array.isArray(response.data)) {
                        this.publicVariable.invoiceStatuslistData = response.data;
                        this.publicVariable.count = response.data.length;
                    } else {
                        // Handle case where response data is null or not an array
                        this.publicVariable.invoiceStatuslistData = [];
                        this.publicVariable.count = 0;
                        console.warn('Response data is null or not an array:', response.data);
                    }
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

    toTitleCase(str: string): string {
        return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    onView(data: invoiceStatusModule): void {
        if (data.headerId) {
            const encryptedHeaderId = btoa(data.headerId.toString());
            this.router.navigate(['invoice/status/view', encryptedHeaderId], { state: { data: data } });
        } else {
            console.error('ID is undefined or null');
        }
    }

    downalodFile(fileUrl: any) {
        this.publicVariable.isProcess  = true;

        try {
            const subscription = this.API.GetTaxInvoiceAttachment(fileUrl).subscribe({
                next: (response: any) => {

                    this.InvoiceAttachment = response.data[0];

                    if(this.InvoiceAttachment.attachment != undefined && this.InvoiceAttachment.attachment !='' && this.InvoiceAttachment.attachment != null )
                   {
                    const fileName = this.InvoiceAttachment.invoiceNo+'.pdf';
                    const fileType = `application/pdf`;
                    this.fileService.downloadFile(this.InvoiceAttachment.attachment, fileName, fileType);

                   }
                   else
                   {

                  this.toastr.warning('There is an issue with the download of the file from ERP.','File Not Found')
                   }

                    this.publicVariable.isProcess  = false;
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
        this.publicVariable.isProcess  = true;

        try {
            const subscription = this.API.GetPITaxInvoiceAttachment(fileUrl).subscribe({
                next: (response: any) => {

                    this.InvoiceAttachment = response.data[0];
                    // const fileName = this.InvoiceAttachment.invoiceNo+'.pdf';
                    // const fileType = `application/pdf`;
                    // this.fileService.downloadFile(this.InvoiceAttachment.attachment, fileName, fileType);
                    // this.publicVariable.isProcess  = false;

                    if(this.InvoiceAttachment.attachment != undefined && this.InvoiceAttachment.attachment !='' && this.InvoiceAttachment.attachment != null )
                    {
                     const fileName = this.InvoiceAttachment.invoiceNo+'.pdf';
                     const fileType = `application/pdf`;
                     this.fileService.downloadFile(this.InvoiceAttachment.attachment, fileName, fileType);

                    }
                    else
                    {

                   this.toastr.warning('There is an issue with the download of the file from ERP.','File Not Found')
                    }
                    this.publicVariable.isProcess  = false;

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

    onDelete(id: any) {
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
                        this.cdr.detectChanges();
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

    calculateIndex(page: number, index: number): number {
        return (page - 1) * this.publicVariable.tableSize + index + 1;
    }
    onEdit(data: invoiceStatusModule): void {
        if (data.headerId) {
            const encryptedHeaderId = btoa(data.headerId.toString());

            this.router.navigate(['invoice/status/edit', encryptedHeaderId], { state: { data: data } });
        } else {
            console.error('ID is undefined or null');
        }
    }

    loadStateList() {
        try {
            const subscription = this.CAPI.getStateList().subscribe({
                next: (response: any) => {
                    this.publicVariable.stateList = response.data;
                    this.handleLoadingError();
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

    getStateNameById(stateId: string) {
        const state = this.publicVariable.stateList.find(state => state.stateCode === stateId);
        return state ? state.stateName : null;
    }

    handleLoadingError() {
        this.publicVariable.isProcess = false; // Set status to false on error
    }

    onDownload() {
        const exportData = this.publicVariable.invoiceStatuslistData.map((x) => ({
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
        }));

        const headers = [
            'Record No', 'Invoice Type', 'PI No', 'Project Code', 'Project Name', 'Department', 'Division',
            'Vendor Name', 'City', 'Amount', 'TL Approver', 'Finance Approver', 'Created On', 'Created By', 'Status'
        ];
        this.appService.exportAsExcelFile(exportData, 'Sales Invoice Status', headers);
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
